"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatList, ChatWindow, Conversation, Message } from '@/components/chat';
import { cn } from '@/lib/utils';

// --- MOCK DATA ---
const CURRENT_USER_ID = 'u_current_1';

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    participant: {
      id: 'p1',
      name: 'Dr. Sarah Jenkins',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
      status: 'online',
      role: 'Professor - Computer Science'
    },
    lastMessage: 'Let me know if you need help with the assignment.',
    lastMessageTime: '10:42 AM',
    unreadCount: 2
  },
  {
    id: 'c2',
    participant: {
      id: 'p2',
      name: 'Michael Chen',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&q=80',
      status: 'offline',
      role: 'Student - Year 3'
    },
    lastMessage: 'Are we still meeting at the library at 4?',
    lastMessageTime: 'Yesterday',
    unreadCount: 0
  },
  {
    id: 'c3',
    participant: {
      id: 'p3',
      name: 'Engineering Admissions',
      avatar: 'https://images.unsplash.com/photo-1562774053-701939374585?w=150&q=80',
      status: 'away',
      role: 'University Admin'
    },
    lastMessage: 'Your document verification is complete.',
    lastMessageTime: 'Mon',
    unreadCount: 0
  }
];

const INITIAL_MESSAGES: Record<string, Message[]> = {
  'c1': [
    {
      id: 'm1',
      senderId: 'p1',
      text: 'Hi there! Did you manage to look at the reading materials for week 3?',
      timestamp: '10:30 AM',
      isRead: true
    },
    {
      id: 'm2',
      senderId: CURRENT_USER_ID,
      text: 'Yes Professor, I went through the AI chapters. Had a question about Neural Nets.',
      timestamp: '10:35 AM',
      isRead: true
    },
    {
      id: 'm3',
      senderId: 'p1',
      text: 'Sure, we can discuss that during office hours tomorrow. Let me know if you need help with the assignment.',
      timestamp: '10:42 AM',
      isRead: true
    }
  ],
  'c2': [
    {
      id: 'm4',
      senderId: 'p2',
      text: 'Hey! Are we still meeting at the library at 4?',
      timestamp: 'Yesterday',
      isRead: true
    }
  ],
  'c3': [
    {
      id: 'm5',
      senderId: 'p3',
      text: 'Dear student, your document verification is complete.',
      timestamp: 'Mon',
      isRead: true
    }
  ]
};

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [messagesDict, setMessagesDict] = useState<Record<string, Message[]>>(INITIAL_MESSAGES);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isMobileListVisible, setIsMobileListVisible] = useState(true);

  // Auto-hide list on mobile when a chat is selected
  useEffect(() => {
    if (activeId !== null) {
      // Small screen logic
      if (window.innerWidth < 1024) {
        setIsMobileListVisible(false);
      }
    }
  }, [activeId]);

  const activeConversation = conversations.find(c => c.id === activeId) || null;
  const activeMessages = activeId ? (messagesDict[activeId] || []) : [];

  const handleSendMessage = (text: string) => {
    if (!activeId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: CURRENT_USER_ID,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false
    };

    setMessagesDict(prev => ({
      ...prev,
      [activeId]: [...(prev[activeId] || []), newMessage]
    }));

    // Update conversation last message preview
    setConversations(prev =>
      prev.map(c =>
        c.id === activeId
          ? { ...c, lastMessage: text, lastMessageTime: 'Just now', unreadCount: 0 }
          : c
      )
    );
  };

  const handleSelectConversation = (id: string) => {
    setActiveId(id);

    // Clear unread count when opening
    setConversations(prev =>
      prev.map(c =>
        c.id === id ? { ...c, unreadCount: 0 } : c
      )
    );
  };

  const handleBackToMobileList = () => {
    setIsMobileListVisible(true);
    setActiveId(null);
  };

  return (
    <div className="h-[calc(100vh-10rem)] min-h-[600px] w-full max-w-6xl mx-auto rounded-xl overflow-hidden shadow-xl border border-border/40 bg-card flex relative text-foreground">
      <AnimatePresence initial={false}>
        {/* Left Side: Conversation List */}
        <motion.div
          className={cn(
            "lg:relative lg:flex lg:w-[340px] xl:w-[400px] h-full shrink-0 border-r border-border/40",
            isMobileListVisible ? "absolute inset-0 z-20 flex w-full bg-background" : "hidden lg:flex"
          )}
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <ChatList
            conversations={conversations}
            activeId={activeId}
            onSelect={handleSelectConversation}
          />
        </motion.div>

        {/* Right Side: Chat Window */}
        <motion.div
          key="chat-window-container"
          className={cn(
            "h-full flex-1 relative bg-card/30 flex flex-col",
            !isMobileListVisible ? "flex w-full" : "hidden lg:flex"
          )}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <ChatWindow
            conversation={activeConversation}
            messages={activeMessages}
            currentUserId={CURRENT_USER_ID}
            onSendMessage={handleSendMessage}
            onBack={handleBackToMobileList}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
