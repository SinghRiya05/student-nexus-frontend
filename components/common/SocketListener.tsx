"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/utils/hook";
import {
    handleFollowReceived,
    handleUnfollowReceived,
    handleFollowAccepted,
    handleFollowAcceptedSelf,
    handleFollowSuccess,
    handleUnfollowSuccess,
    handleFollowRejectedSuccess
} from "@/features/follow/followSlice";
import { addMessage } from "@/features/chat/chatSlice";
import toast from "react-hot-toast";
import { usePathname } from "next/navigation";
import { 
    initiateSocketConnection, 
    disconnectSocket, 
    onFollowReceived, 
    onUnfollowReceived, 
    onFollowAccepted, 
    onFollowAcceptedSelf, 
    onFollowSuccess, 
    onUnfollowSuccess, 
    onFollowRejectedSuccess, 
    offFollowEvents,
    subscribeToNotifications,
    unsubscribeFromNotifications
} from "@/services/socket";
import { ASSET_URL } from "@/services/apiEndpoints";
import { MessageSquare, UserPlus, CheckCircle2 } from "lucide-react";

const showCustomToast = (
    title: string, 
    description: string, 
    avatar?: string, 
    icon: React.ReactNode = <MessageSquare className="w-5 h-5 text-primary" />
) => {
    const avatarUrl = avatar 
        ? (avatar.startsWith('http') ? avatar : `${ASSET_URL}${avatar}`)
        : `https://api.dicebear.com/7.x/avataaars/svg?seed=${title}`;

    toast.custom((t) => (
        <div
            className={`${
                t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black/5 border border-white/20`}
        >
            <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                        <img
                            className="h-12 w-12 rounded-full object-cover border-2 border-primary/20"
                            src={avatarUrl}
                            alt=""
                        />
                    </div>
                    <div className="ml-4 flex-1">
                        <p className="text-sm font-bold text-gray-900">
                            {title}
                        </p>
                        <p className="mt-1 text-xs font-medium text-gray-500 line-clamp-2">
                            {description}
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex border-l border-gray-100">
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className="w-full border border-transparent rounded-none rounded-r-2xl p-4 flex items-center justify-center text-sm font-medium text-primary hover:text-primary/70 focus:outline-none"
                >
                    {icon}
                </button>
            </div>
        </div>
    ), { duration: 5000 });
};

export default function SocketListener() {
    const dispatch = useAppDispatch();
    const token = useAppSelector((state) => state.auth.accessToken);
    const pathname = usePathname();
    const pathnameRef = useRef(pathname);

    // Keep the ref updated with the latest pathname
    useEffect(() => {
        pathnameRef.current = pathname;
    }, [pathname]);

    useEffect(() => {
        console.log("SocketListener: useEffect triggered. Token present:", !!token);
        if (token) {
            initiateSocketConnection(token);

            // --- Chat Notifications ---
            subscribeToNotifications((err, msg) => {
                if (err) return;
                dispatch(addMessage(msg));

                if (!pathnameRef.current?.startsWith("/chat")) {
                    showCustomToast(
                        `${msg.sender?.firstName || "Someone"} sent a message`,
                        msg.content,
                        msg.sender?.avatar,
                        <MessageSquare className="w-5 h-5 text-primary" />
                    );
                }
            });

            onFollowReceived((follow) => {
                dispatch(handleFollowReceived(follow));
                const follower = follow.follower as any;
                showCustomToast(
                    "New Follower!",
                    `${follower?.firstName || 'Someone'} started following you`,
                    follower?.avatar,
                    <UserPlus className="w-5 h-5 text-primary" />
                );
            });

            onUnfollowReceived((data) => {
                console.log("Socket: unfollow_received", data);
                dispatch(handleUnfollowReceived(data));
            });

            onFollowAccepted((follow) => {
                dispatch(handleFollowAccepted(follow));
                const following = follow.following as any;
                showCustomToast(
                    "Request Accepted!",
                    `${following?.firstName || 'A user'} accepted your follow request`,
                    following?.avatar,
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                );
            });

            onFollowAcceptedSelf((follow) => {
                console.log("Socket: follow_accepted_self", follow);
                dispatch(handleFollowAcceptedSelf(follow));
            });

            onFollowSuccess((follow) => {
                dispatch(handleFollowSuccess(follow));
                const following = follow.following as any;
                showCustomToast(
                    "Following",
                    `You are now following ${following?.firstName || 'user'}`,
                    following?.avatar,
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                );
            });

            onUnfollowSuccess((data) => {
                console.log("Socket: unfollow_success", data);
                dispatch(handleUnfollowSuccess(data));
                showCustomToast(
                    "Unfollowed",
                    "Unfollowed successfully",
                    undefined,
                    <CheckCircle2 className="w-5 h-5 text-gray-400" />
                );
            });

            onFollowRejectedSuccess((data) => {
                console.log("Socket: follow_rejected_success", data);
                dispatch(handleFollowRejectedSuccess(data));
                showCustomToast(
                    "Request Declined",
                    "The follow request has been declined",
                    undefined,
                    <CheckCircle2 className="w-5 h-5 text-gray-400" />
                );
            });

            return () => {
                offFollowEvents();
                unsubscribeFromNotifications();
                disconnectSocket(); 
            };
        }
    }, [token, dispatch]);

    return null;
}
