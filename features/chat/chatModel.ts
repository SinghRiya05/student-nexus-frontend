

export interface IUser {
    _id: string;
    firstName: string;
    lastName?: string;
    email: string;
    avatar?: string;
    roleId?: {
        _id: string;
        name: string;
    };
}

export interface IMessage {
    _id: string;
    sender: IUser;
    chat: string | IChat;
    content: string;
    messageType: "text" | "image" | "file";
    attachments: any[];
    readBy: string[];
    deliveredTo: string[];
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface IChat {
    _id: string;
    chatName: string;
    isGroupChat: boolean;
    users: IUser[];
    latestMessage?: IMessage;
    lastActivity: string;
    createdAt: string;
    updatedAt: string;
}

export interface ICreateChat {
    userId: string;
}

export interface SendMessage {
    chatId: string;
    content?: string;
    attachments?: File[];
}


// api.types.ts

export interface ApiResponse<T> {
    success: boolean;
    code: number;
    message: string;
    data: T;
}

export type AccessChatResponse = ApiResponse<IChat>;
export type FetchChatsResponse = ApiResponse<IChat[]>;
export type SendMessageResponse = ApiResponse<IMessage>;
export type FetchMessagesResponse = ApiResponse<IMessage[]>;

// chat.slice.ts (state)

export interface ChatState {
    chats: IChat[];
    messages: Record<string, IMessage[]>;
    typingUsers: Record<string, string[]>;
    unreadCounts: Record<string, number>;
    selectedChatId: string | null;
    loading: boolean;
}