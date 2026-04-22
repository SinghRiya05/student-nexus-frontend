import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

let socket: Socket | null = null;

export const initiateSocketConnection = (token: string) => {
	if (!socket) {
		socket = io(SOCKET_URL, {
			auth: { token },
			transports: ["websocket"],
		});
		console.log("Socket connected");
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
