import { io, Socket } from "socket.io-client";
import toast from "react-hot-toast";

const SOCKET_URL = process.env.NEXT_PUBLIC_ASSET_BACKEND_BASEURL;

let socket: Socket | null = null;

export const initiateSocketConnection = (token: string) => {
	// If socket already exists and token is the same, do nothing
	if (socket && (socket as any).auth?.token === token) {
		return;
	}

	// If socket exists but token is different, disconnect first
	if (socket) {
		console.log("Token changed, reconnecting socket...");
		socket.disconnect();
		socket = null;
	}

	if (!socket) {
		socket = io(SOCKET_URL, {
			auth: { token },
		});
		(socket as any).auth = { token }; // Store token for later comparison
		console.log("Socket connected with URL:", SOCKET_URL);
		
		socket.on("connect", () => {
			console.log("Socket established connection:", socket?.id);
		});

		socket.on("connect_error", (err) => {
			console.error("Socket connection error:", err);
		});

		socket.on("error_message", (data) => {
			console.error("Socket error message:", data.message);
			toast.error(data.message);
		});
	}
};

export const disconnectSocket = () => {
	if (socket) {
		socket.disconnect();
		socket = null;
	}
};

export const subscribeToChat = (chatId: string) => {
	if (socket) {
		socket.emit("join_chat", chatId);
	}
};

export const sendMessageViaSocket = (data: {
	chatId: string;
	content: string;
	messageType?: string;
	attachments?: any[];
}) => {
	if (socket) {
		socket.emit("new_message", data);
	}
};

export const subscribeToMessages = (cb: (err: any, msg: any) => void) => {
	if (!socket) return;
	socket.on("message_received", (msg) => {
		console.log("Message received via socket");
		return cb(null, msg);
	});
};

export const subscribeToNotifications = (cb: (err: any, msg: any) => void) => {
	if (!socket) return;
	socket.on("message_received_notification", (msg) => {
		console.log("Notification received via socket");
		return cb(null, msg);
	});
};

export const emitTyping = (chatId: string) => {
	if (socket) socket.emit("typing", chatId);
};

export const emitStopTyping = (chatId: string) => {
	if (socket) socket.emit("stop_typing", chatId);
};

export const emitMessageSeen = (data: { messageId?: string; chatId: string }) => {
	if (socket) socket.emit("message_seen", data);
};

export const unsubscribeFromMessages = () => {
	if (socket) socket.off("message_received");
};

export const unsubscribeFromNotifications = () => {
	if (socket) socket.off("message_received_notification");
};

export const onTyping = (cb: (room: string) => void) => {
	if (socket) socket.on("typing", cb);
};

export const onStopTyping = (cb: (room: string) => void) => {
	if (socket) socket.on("stop_typing", cb);
};

export const onMessageSeen = (cb: (data: { messageId: string; chatId: string }) => void) => {
	if (socket) socket.on("message_seen", cb);
};

export const offTyping = () => {
	if (socket) socket.off("typing");
};

export const offStopTyping = () => {
	if (socket) socket.off("stop_typing");
};

export const offMessageSeen = () => {
	if (socket) socket.off("message_seen");
};

export const getSocket = () => socket;

// --- CALLING EVENTS ---

export const emitCallUser = (data: { userToCall: string; signalData: any; from: string; name: string; type: string }) => {
	if (socket) socket.emit("call_user", data);
};

export const emitAnswerCall = (data: { to: string; signal: any }) => {
	if (socket) socket.emit("answer_call", data);
};

export const emitIceCandidate = (data: { to: string; candidate: any }) => {
	if (socket) socket.emit("ice_candidate", data);
};

export const emitEndCall = (data: { to: string }) => {
	if (socket) socket.emit("end_call", data);
};

export const emitScreenShareToggle = (data: { to: string; isSharing: boolean }) => {
	if (socket) socket.emit("screen_share_toggle", data);
};

export const onIncomingCall = (cb: (data: { signal: any; from: string; name: string; type: 'audio' | 'video' }) => void) => {
	if (socket) socket.on("call_user", cb);
};

export const onCallAccepted = (cb: (signal: any) => void) => {
	if (socket) socket.on("call_accepted", cb);
};

export const onReceiveIceCandidate = (cb: (candidate: any) => void) => {
	if (socket) socket.on("ice_candidate", cb);
};

export const onCallEnded = (cb: () => void) => {
	if (socket) socket.on("call_ended", cb);
};

export const onScreenShareStatus = (cb: (data: { isSharing: boolean }) => void) => {
	if (socket) socket.on("screen_share_status", cb);
};
export const offCallEvents = () => {
	if (socket) {
		socket.off("call_user");
		socket.off("call_accepted");
		socket.off("ice_candidate");
		socket.off("call_ended");
		socket.off("screen_share_status");
	}
};

// --- FOLLOW EVENTS ---

export const emitFollowUser = (userId: string) => {
	console.log("Emitting follow_user for:", userId);
	if (socket) socket.emit("follow_user", { userId });
	else console.error("Socket not connected during emitFollowUser");
};

export const emitUnfollowUser = (userId: string) => {
	console.log("Emitting unfollow_user for:", userId);
	if (socket) socket.emit("unfollow_user", { userId });
	else console.error("Socket not connected during emitUnfollowUser");
};

export const emitAcceptFollowRequest = (requestId: string) => {
	console.log("Emitting accept_follow_request for:", requestId);
	if (socket) socket.emit("accept_follow_request", { requestId });
	else console.error("Socket not connected during emitAcceptFollowRequest");
};

export const emitRejectFollowRequest = (requestId: string) => {
	console.log("Emitting reject_follow_request for:", requestId);
	if (socket) socket.emit("reject_follow_request", { requestId });
	else console.error("Socket not connected during emitRejectFollowRequest");
};

export const onFollowReceived = (cb: (follow: any) => void) => {
	if (socket) socket.on("follow_received", cb);
};

export const onUnfollowReceived = (cb: (data: { followerId: string }) => void) => {
	if (socket) socket.on("unfollow_received", cb);
};

export const onFollowAccepted = (cb: (follow: any) => void) => {
	if (socket) socket.on("follow_accepted", cb);
};

export const onFollowAcceptedSelf = (cb: (follow: any) => void) => {
	if (socket) socket.on("follow_accepted_self", cb);
};

export const onFollowSuccess = (cb: (follow: any) => void) => {
	if (socket) socket.on("follow_success", cb);
};

export const onUnfollowSuccess = (cb: (data: { userId: string }) => void) => {
	if (socket) socket.on("unfollow_success", cb);
};

export const onFollowRejectedSuccess = (cb: (data: { requestId: string }) => void) => {
	if (socket) socket.on("follow_rejected_success", cb);
};

export const offFollowEvents = () => {
	if (socket) {
		socket.off("follow_received");
		socket.off("unfollow_received");
		socket.off("follow_accepted");
		socket.off("follow_accepted_self");
		socket.off("follow_success");
		socket.off("unfollow_success");
		socket.off("follow_rejected_success");
	}
};
