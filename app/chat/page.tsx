"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatList, ChatWindow, Conversation, Message, NewChatList } from '@/components/chat';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/utils/hook';
import { getMutualFollowers, getMe } from '@/features/users/userThunk';
import { MutualFollower } from '@/features/users/userModel';
import { ASSET_URL } from '@/services/apiEndpoints';
import { fetchChats, getMessages, accessChat, sendMessage as sendMessageThunk } from '@/features/chat/chatThunk';
import { addMessage, setSelectedChatId, setTypingStatus, markAllMessagesAsReadInChat, } from '@/features/chat/chatSlice';
import { initiateSocketConnection, disconnectSocket, subscribeToChat, subscribeToMessages, subscribeToNotifications, onTyping, onStopTyping, onMessageSeen, offTyping, offStopTyping, offMessageSeen, unsubscribeFromMessages, unsubscribeFromNotifications, sendMessageViaSocket } from '@/services/socket';
import { IChat, IMessage } from '@/features/chat/chatModel';
import { toast } from 'react-hot-toast';
import { getSocket } from "@/services/socket";

export default function ChatPage() {
  const [isMobileListVisible, setIsMobileListVisible] = useState(true);
  const [sidebarView, setSidebarView] = useState<'list' | 'new-chat'>('list');

  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector(state => state.auth)
  const { me } = useAppSelector(state => state.user);
  const { mutualFollowers, userLoading } = useAppSelector(state => state.user);
  const { chats, messages, selectedChatId, unreadCounts, loading: chatLoading } = useAppSelector(state => state.chat);

  // --- IDENTITY HELPERS ---
  const getParticipant = (chat: IChat) => {
    return chat.users.find(u => u._id !== me?._id) || chat.users[0];
  };

  // --- MAPPING: Backend IChat -> Frontend Conversation ---
  const mappedConversations: Conversation[] = chats.map(chat => {
    const participant = getParticipant(chat);
    return {
      id: chat._id,
      participant: {
        id: participant._id,
        name: `${participant.firstName} ${participant.lastName || ''}`,
        avatar: participant.avatar ? `${ASSET_URL}${participant.avatar}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${participant.firstName}`,
        status: 'online',
        role: participant.roleId?.name || 'STUDENT'
      },
      lastMessage: chat.latestMessage?.content || 'No messages yet',
      lastMessageTime: chat.latestMessage
        ? new Date(chat.latestMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '',
      unreadCount: unreadCounts[chat._id] || 0
    };
  });

  // --- MAPPING: Backend IMessage -> Frontend Message ---
  const activeMessages: Message[] = useMemo(() => {
    const rawMessages = selectedChatId ? (messages[selectedChatId] || []) : [];
    if (rawMessages.length > 0) {
      const sampleMsg = rawMessages[0];
      const senderId = typeof sampleMsg.sender === 'string' ? sampleMsg.sender : sampleMsg.sender._id;
    }
    return rawMessages.map(msg => {
      const senderId = typeof msg.sender === 'string' ? msg.sender : msg.sender._id;
      const isOwn = me?._id ? (String(senderId).trim() === String(me._id).trim()) : false;
      return {
        id: msg._id,
        senderId,
        text: msg.content,
        timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn,
        isRead: msg.readBy.includes(chats.find(c => c._id === selectedChatId)?.users.find(u => u._id !== me?._id)?._id || ''),
        readByMe: msg.readBy.includes(me?._id || ''),
        attachments: msg.attachments
      };
    });
  }, [selectedChatId, messages, me, chats]);

  const activeConversation = mappedConversations.find(c => c.id === selectedChatId) || null;
  const isMutual = useMemo(() => {
    if (!activeConversation || !mutualFollowers) return false;
    return mutualFollowers.some(f => f._id === activeConversation.participant.id);
  }, [activeConversation, mutualFollowers]);


  useEffect(() => {
    if (me?._id && accessToken) {
      initiateSocketConnection(accessToken);
    }
    return () => {
      disconnectSocket();
    };
  }, [me]);

  // --- HYDRATION & INITIAL FETCH ---
  useEffect(() => {
    if (!me) {
      dispatch(getMe());
    }
    dispatch(fetchChats());
    dispatch(getMutualFollowers());
  }, [dispatch, me]);

  // --- SOCKET SUBSCRIPTIONS ---
  useEffect(() => {
    subscribeToMessages((err, msg: IMessage) => {
      if (msg) {
        const chatId = typeof msg.chat === 'string' ? msg.chat : msg.chat._id;
        dispatch(addMessage(msg));
        if (selectedChatId !== chatId) {
          toast.success(`New message from ${msg.sender.firstName}`, {
            icon: '💬',
            style: { borderRadius: '10px', background: '#333', color: '#fff' },
          });
        }
      }
    });

    subscribeToNotifications((err, msg: IMessage) => {
      if (msg) {
        dispatch(addMessage(msg));
      }
    });

    onTyping((chatId: string) => {
      if (selectedChatId === chatId) {
        const chat = chats.find(c => c._id === chatId);
        if (chat) {
          const participant = chat.users.find(u => u._id !== me?._id);
          if (participant) {
            dispatch(setTypingStatus({ chatId, userId: participant._id, isTyping: true }));
          }
        }
      }
    });

    onStopTyping((chatId: string) => {
      if (selectedChatId === chatId) {
        const chat = chats.find(c => c._id === chatId);
        if (chat) {
          const participant = chat.users.find(u => u._id !== me?._id);
          if (participant) {
            dispatch(setTypingStatus({ chatId, userId: participant._id, isTyping: false }));
          }
        }
      }
    });

    onMessageSeen((data: { messageId?: string; chatId: string }) => {
      const chat = chats.find(c => c._id === data.chatId);
      if (chat) {
        const participant = chat.users.find(u => u._id !== me?._id);
        if (participant) {
          dispatch(markAllMessagesAsReadInChat({
            chatId: data.chatId,
            userId: participant._id
          }));
        }
      }
    });
    return () => {
      unsubscribeFromMessages();
      unsubscribeFromNotifications();
      offTyping();
      offStopTyping();
      offMessageSeen();
    };
  }, [dispatch, selectedChatId, chats, me?._id]);

  // --- JOIN CHAT ROOM ---
  useEffect(() => {
    if (selectedChatId) {
      subscribeToChat(selectedChatId);
      if (!messages[selectedChatId]) {
        dispatch(getMessages(selectedChatId));
      }
      if (window.innerWidth < 1024) {
        setIsMobileListVisible(false);
      }
    }
  }, [selectedChatId, dispatch, messages]);

  const handleSendMessage = async (text: string, files?: File[]) => {
    if (!selectedChatId || !me?._id) return;

    if (files && files.length > 0) {
      // Use REST for file uploads
      dispatch(sendMessageThunk({
        chatId: selectedChatId,
        content: text,
        attachments: files
      }));
    } else {
      // Use socket for text-only messages
      sendMessageViaSocket({
        chatId: selectedChatId,
        content: text
      });
    }
  };

  const handleSelectConversation = (id: string) => {
    dispatch(setSelectedChatId(id));
    setSidebarView('list');
  };

  const handleStartNewChat = () => {
    setSidebarView('new-chat');
    dispatch(getMutualFollowers());
  };

  const handleSelectMutualFollower = async (user: MutualFollower) => {
    try {
      await dispatch(accessChat({ userId: user._id })).unwrap();
      setSidebarView('list');
    } catch (error) {
      toast.error("Failed to start conversation");
    }
  };

  const handleBackToMobileList = () => {
    setIsMobileListVisible(true);
    dispatch(setSelectedChatId(null));
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
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <AnimatePresence mode="wait">
            {sidebarView === 'list' ? (
              <motion.div
                key="chat-list"
                className="w-full h-full"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChatList
                  conversations={mappedConversations}
                  activeId={selectedChatId}
                  onSelect={handleSelectConversation}
                  onNewChat={handleStartNewChat}
                />
              </motion.div>
            ) : (
              <motion.div
                key="new-chat-list"
                className="w-full h-full"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <NewChatList
                  followers={mutualFollowers || []}
                  onSelect={handleSelectMutualFollower}
                  onBack={() => setSidebarView('list')}
                  loading={userLoading}
                />
              </motion.div>
            )}
          </AnimatePresence>
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
            currentUserId={me?._id || ''}
            onSendMessage={handleSendMessage}
            onBack={handleBackToMobileList}
            isMutual={isMutual}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
