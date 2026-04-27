export interface Attachment {
  url: string;
  fileType: string;
  size: number;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
  isRead?: boolean;
  readByMe?: boolean;
  attachments?: Attachment[];
}

export interface User {
  id: string;
  name: string;
  avatar: string | null;
  status: 'online' | 'offline' | 'away';
  role: string;
}

export interface Conversation {
  id: string;
  participant: User;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}
