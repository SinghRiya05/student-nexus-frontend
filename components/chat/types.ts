export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRead?: boolean;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
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
