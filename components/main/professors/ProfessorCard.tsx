"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { Star, Mail, UserPlus, CheckCircle, MessageSquare } from "lucide-react"
import Link from 'next/link'
import { useAppDispatch, useAppSelector } from "@/utils/hook"
import { sendFollowRequest, unfollow } from "@/features/follow/followThunk"
import { emitFollowUser, emitUnfollowUser } from "@/services/socket"
import toast from "react-hot-toast"
import { cn } from "@/lib/utils"
import { useState } from 'react'
import { accessChat } from '@/features/chat/chatThunk'

interface ProfessorCardProps {
    id: string | number
    name: string
    title: string
    department: string
    universityName?: string
    tags: string[]
    rating: string | number
    reviews: string | number
    isOnline?: boolean
    image?: string
}

export default function ProfessorCard({
    id,
    name,
    title,
    department,
    universityName,
    tags,
    isOnline = false,
    image
}: ProfessorCardProps) {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [isHoveringFollow, setIsHoveringFollow] = useState(false);

    const { following, followers, sentRequests, loading: followLoading } = useAppSelector(state => state.follow);
    const { user: authUser } = useAppSelector(state => state.auth);

    const isFollowingObj = following.find((f: any) =>
        (typeof f.following === 'string' ? f.following === id : f.following?._id === id)
    );
    const isFollowing = !!isFollowingObj;

    const isRequestedObj = sentRequests.find((r: any) =>
        (typeof r.following === 'string' ? r.following === id : r.following?._id === id)
    );
    const isRequested = !!isRequestedObj;

    const isFollowerObj = followers.find((f: any) =>
        (typeof f.follower === 'string' ? f.follower === id : f.follower?._id === id)
    );
    const isFollower = !!isFollowerObj;

    const isMutual = isFollowing && isFollower;

    const handleFollowAction = async () => {
        const userId = String(id);
        console.log("ProfessorCard: handleFollowAction called. id:", userId);
        if (!userId) return;
        if (isFollowing) {
            console.log("ProfessorCard: Calling emitUnfollowUser");
            emitUnfollowUser(userId);
        } else if (!isRequested) {
            console.log("ProfessorCard: Calling emitFollowUser");
            emitFollowUser(userId);
        }
    };

    const handleMessageAction = async () => {
        const result = await dispatch(accessChat({ userId: String(id) }))
        if (result.meta.requestStatus === "fulfilled") {
            toast.success("Chat opened successfully");
            router.push('/chat');
        } else {
            toast.error("Failed to open chat");
        }
    };
    return (
        <div className="bg-white border rounded-3xl p-6  hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center text-center">
            <div className="relative mb-4">
                {image ? (
                    <img src={image} alt={name} className="w-24 h-24 rounded-full object-cover border-4 border-surface-container-low shadow-md" />
                ) : (
                    <div className="w-24 h-24 rounded-full border-4 border-surface-container-low shadow-md bg-slate-200 flex items-center justify-center text-4xl font-bold text-slate-400">
                        {name.charAt(4)}
                    </div>
                )}
                {/* Online Status Badge */}
                <div className={`absolute bottom-1 right-1 w-5 h-5 border-2 border-surface-container-lowest rounded-full ${isOnline ? "bg-green-500" : "bg-slate-300"
                    }`} />
            </div>

            <h3 className="text-lg font-bold text-on-surface">{name}</h3>
            <p className="text-primary text-sm font-medium mb-1">{title}</p>
            <div className="flex flex-col gap-0.5 mb-4">
                <p className="text-on-surface-variant text-xs font-semibold">{department}</p>
                {universityName && (
                    <p className="text-[10px] text-on-surface-variant/70 italic">{universityName}</p>
                )}
            </div>

            {/* Tags/Skills Section */}
            <div className="flex gap-2 flex-wrap justify-center mb-2">
                {tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-surface-container-low text-[10px] font-bold rounded-full text-on-surface-variant">
                        {tag}
                    </span>
                ))}
            </div>



            {/* Action Buttons */}
            <div className="w-full grid grid-cols-2 gap-3 mt-auto">
                <Link href={`/professors/${id}`} className="w-full">
                    <Button variant={"outline"} onClick={() => router.push(`/professors/${id}`)} className="w-full py-2 px-4 rounded-xl  text-on-surface text-xs font-bold hover:bg-surface-container-highest transition-colors">
                        Profile
                    </Button>
                </Link>

                {authUser?._id !== String(id) && (
                    <>
                        {isMutual ? (
                            <button
                                onClick={handleMessageAction}
                                className="py-2 px-4 bg-secondary text-white rounded-xl cursor-pointer text-xs font-bold shadow-md shadow-secondary/10 hover:bg-secondary/80 transition-all flex items-center justify-center gap-2"
                            >
                                <MessageSquare className="w-4 h-4" />
                                Message
                            </button>
                        ) : (
                            <button
                                onClick={handleFollowAction}
                                onMouseEnter={() => setIsHoveringFollow(true)}
                                onMouseLeave={() => setIsHoveringFollow(false)}
                                disabled={(isRequested && !isFollowing) || followLoading}
                                className={cn(
                                    "py-2 px-4 rounded-xl cursor-pointer text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2",
                                    isFollowing
                                        ? (isHoveringFollow ? "bg-destructive text-destructive-foreground shadow-destructive/10" : "bg-accent/10 text-accent border border-accent/20")
                                        : isRequested
                                            ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none"
                                            : "bg-primary text-white shadow-primary/10 hover:bg-primary/80"
                                )}
                            >
                                {isFollowing ? (
                                    isHoveringFollow ? "Unfollow" : <><CheckCircle className="w-4 h-4" /> Following</>
                                ) : isRequested ? (
                                    "Requested"
                                ) : (
                                    <><UserPlus className="w-4 h-4" /> Follow</>
                                )}
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
