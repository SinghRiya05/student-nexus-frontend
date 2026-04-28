import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Paperclip,
  Smile,
  Send,
  Check,
  CheckCheck,
  Loader2,
  MoreVertical,
  Phone,
  Video,
  Search,
  User as UserIcon,
  Bell,
  Trash2,
  Ban,
  ShieldAlert,
  FileText,
  Eraser,
  ArrowLeft,
  X,
  FileIcon,
  Image as ImageIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppSelector, useAppDispatch } from '@/utils/hook';
import { clearChatMessages, deleteChatConversation, getMessages } from '@/features/chat/chatThunk';
import { useRouter } from 'next/navigation';
import { ASSET_URL } from '@/services/apiEndpoints';
import { toast } from 'react-hot-toast';
import {
  emitTyping,
  emitStopTyping,
  emitMessageSeen,
  onIncomingCall,
  offCallEvents
} from '@/services/socket';
import { Conversation, Message } from './types';
import { MessageBubble } from './MessageBubble';
import { CallOverlay } from './CallOverlay';
import { Button } from '../ui/button';
import EmojiPicker, { Theme } from 'emoji-picker-react';

interface ChatWindowProps {
  conversation: Conversation | null;
  messages: Message[];
  currentUserId: string;
  onSendMessage: (text: string, files?: File[]) => void;
  onBack?: () => void;
  isMutual?: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  messages,
  currentUserId,
  onSendMessage,
  onBack,
  isMutual = true
}) => {
  const [inputText, setInputText] = useState('');
  const [isCallOverlayOpen, setIsCallOverlayOpen] = useState(false);
  const [activeCallType, setActiveCallType] = useState<'audio' | 'video'>('audio');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [showConfirm, setShowConfirm] = useState<'clear' | 'delete' | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<{ url: string, name: string, type: string }[]>([]);
  const [incomingCall, setIncomingCall] = useState<{ signal: any; from: string; name: string; type: 'audio' | 'video' } | null>(null);
  const [isIncomingCall, setIsIncomingCall] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { me } = useAppSelector(state => state.user);
  const { typingUsers, pagination, loading } = useAppSelector(state => state.chat);

  const chatPagination = conversation ? pagination[conversation.id] : null;
  const chatTypingUsers = conversation ? (typingUsers[conversation.id] || []) : [];
  const otherTypingUsers = chatTypingUsers.filter(id => id !== me?._id);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef<number>(0);
  const isInitialLoadRef = useRef<boolean>(true);

  const handleViewProfile = () => {
    if (!conversation) return;
    setShowMenu(false);
    const roleMap: Record<string, string> = {
      'STUDENT': 'students',
      'TEACHER': 'professors',
      'ALUMNI': 'alumni'
    };
    const path = roleMap[conversation.participant.role] || 'students';
    router.push(`/${path}/${conversation.participant.id}`);
  };

  const handleClearChat = async () => {
    if (!conversation) return;
    try {
      await dispatch(clearChatMessages(conversation.id)).unwrap();
      toast.success('Chat cleared');
      setShowConfirm(null);
    } catch (err: any) {
      toast.error(err || 'Failed to clear chat');
    }
  };

  const handleDeleteChat = async () => {
    if (!conversation) return;
    try {
      await dispatch(deleteChatConversation(conversation.id)).unwrap();
      toast.success('Chat deleted');
      setShowConfirm(null);
    } catch (err: any) {
      toast.error(err || 'Failed to delete chat');
    }
  };

  // Auto-scroll to bottom when new messages arrive (only if on page 1 or near bottom)
  useEffect(() => {
    if (isInitialLoadRef.current && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
      isInitialLoadRef.current = false;
    } else if (!loading && prevScrollHeightRef.current > 0) {
      // Maintain scroll position after loading older messages
      if (scrollContainerRef.current) {
        const newScrollHeight = scrollContainerRef.current.scrollHeight;
        const heightDifference = newScrollHeight - prevScrollHeightRef.current;
        scrollContainerRef.current.scrollTop = heightDifference;
        prevScrollHeightRef.current = 0;
      }
    } else if (messages.length > 0) {
      // For new incoming messages, scroll to bottom
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  useEffect(() => {
    // Reset initial load when conversation changes
    isInitialLoadRef.current = true;
  }, [conversation?.id]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight } = e.currentTarget;
    if (scrollTop === 0 && chatPagination?.hasMore && !loading && conversation) {
      prevScrollHeightRef.current = scrollHeight;
      dispatch(getMessages({ 
        chatId: conversation.id, 
        page: (chatPagination.page || 1) + 1 
      }));
    }
  };

  // --- SEEN LOGIC ---
  useEffect(() => {
    if (conversation && messages.length > 0) {
      const hasUnread = messages.some(msg => msg.senderId !== me?._id && !msg.readByMe);
      if (hasUnread) {
        emitMessageSeen({
          chatId: conversation.id
        });
      }
    }
  }, [messages, conversation, me?._id]);

  // --- INCOMING CALL LISTENER ---
  useEffect(() => {
    onIncomingCall((data) => {
      setIncomingCall(data);
      setIsIncomingCall(true);
      setActiveCallType(data.type);
      setIsCallOverlayOpen(true);
      toast((t) => (
        <span className="flex items-center gap-3">
          <b>{data.name}</b> is calling you...
          <button
            onClick={() => {
              toast.dismiss(t.id);
              setIsCallOverlayOpen(true);
            }}
            className="bg-primary text-white px-3 py-1 rounded-lg text-xs"
          >
            Answer
          </button>
        </span>
      ), { duration: 10000, position: 'top-center' });
    });

    return () => {
      offCallEvents();
    };
  }, []);

  // --- TYPING EMITTER ---
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    if (conversation) {
      emitTyping(conversation.id);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        emitStopTyping(conversation.id);
      }, 2000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + selectedFiles.length > 5) {
      toast.error('Maximum 5 files allowed');
      return;
    }

    const newFiles = [...selectedFiles, ...files];
    setSelectedFiles(newFiles);

    const newPreviews = files.map(file => ({
      url: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
      name: file.name,
      type: file.type
    }));
    setFilePreviews([...filePreviews, ...newPreviews]);
  };

  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);

    const newPreviews = [...filePreviews];
    if (newPreviews[index].url) URL.revokeObjectURL(newPreviews[index].url);
    newPreviews.splice(index, 1);
    setFilePreviews(newPreviews);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && selectedFiles.length === 0) return;
    onSendMessage(inputText, selectedFiles);
    setInputText('');
    setSelectedFiles([]);
    filePreviews.forEach(p => p.url && URL.revokeObjectURL(p.url));
    setFilePreviews([]);
    setShowEmojiPicker(false);
  };

  const onEmojiClick = (emojiData: any) => {
    setInputText(prev => prev + emojiData.emoji);
  };

  if (!conversation) {
    return (
      <div className="flex-1 hidden lg:flex flex-col items-center justify-center bg-card/30">
        <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mb-6">
          <Send className="w-10 h-10 text-primary/30 ml-2" />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-primary mb-2">Your Messages</h2>
        <p className="text-muted-foreground font-medium text-sm text-center max-w-sm">
          Select a conversation from the sidebar to start chatting with your peers or professors.
        </p>
      </div>
    );
  }

  const { participant } = conversation;

  return (
    <div className="flex-1 flex flex-col h-full bg-card/30 relative overflow-hidden">
      {/* Header */}
      <div className="h-16 md:h-[88px] px-4 md:px-8 border-b border-border/40 shrink-0 bg-card/80 flex items-center justify-between z-20 shadow-sm backdrop-blur-2xl sticky top-0">
        <div className="flex items-center gap-4">
          {/* Mobile Back Button */}
          {onBack && (
            <button
              onClick={onBack}
              className="lg:hidden p-2 -ml-2 rounded-full hover:bg-primary/5 text-muted-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div
            onClick={handleViewProfile}
            className="flex items-center gap-4 cursor-pointer group/header transition-opacity hover:opacity-80"
          >
            <div className="relative">
              {participant.avatar ? (
                <img
                  src={participant.avatar}
                  alt={participant.name}
                  className="w-12 h-12 rounded-xl object-cover shadow-sm border border-border/50 group-hover/header:ring-2 group-hover/header:ring-primary/20 transition-all"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-lg text-primary shadow-sm border border-border/50 group-hover/header:ring-2 group-hover/header:ring-primary/20 transition-all">
                  {participant.name.charAt(0).toUpperCase()}
                </div>
              )}
              {participant.status === 'online' && (
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-card rounded-full" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-foreground group-hover/header:text-primary transition-colors">{participant.name}</h2>
              <p className="text-xs font-bold text-muted-foreground">
                {participant.status === 'online' ? (
                  <span className="text-green-500">Active Now</span>
                ) : (
                  `Role: ${participant.role}`
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => {
              setActiveCallType('audio');
              setIsCallOverlayOpen(true);
            }}
            className="p-2.5 rounded-full hover:bg-primary/5 text-muted-foreground transition-colors hidden sm:block"
          >
            <Phone className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              setActiveCallType('video');
              setIsCallOverlayOpen(true);
            }}
            className="p-2.5 rounded-full hover:bg-primary/5 text-muted-foreground transition-colors hidden sm:block"
          >
            <Video className="w-5 h-5" />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className={cn(
                "p-2.5 rounded-full hover:bg-primary/5 transition-all",
                showMenu ? "bg-primary/10 text-primary" : "text-muted-foreground"
              )}
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showMenu && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowMenu(false)}
                    className="fixed inset-0 z-40"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 mt-2 w-64 bg-background border border-border shadow-2xl rounded-lg p-2 z-50 origin-top-right overflow-hidden"
                  >
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={handleViewProfile}
                        className="flex items-center gap-3 w-full p-3 text-sm font-semibold hover:bg-primary/5  transition-colors text-foreground"
                      >
                        <UserIcon className="w-4 h-4 text-blue-500" />
                        View Profile
                      </button>

                      <div className="h-px bg-border my-1 mx-2" />

                      <button
                        onClick={() => { setShowMenu(false); setShowConfirm('clear'); }}
                        className="flex items-center gap-3 w-full p-3 text-sm font-semibold hover:bg-slate-100 text-rose-600 rounded-lg transition-colors text-left"
                      >
                        <Eraser className="w-4 h-4" />
                        Clear Messages
                      </button>

                      <button
                        onClick={() => { setShowMenu(false); setShowConfirm('delete'); }}
                        className="flex items-center gap-3 w-full p-3 text-sm font-semibold hover:bg-slate-100 text-rose-700 rounded-lg transition-colors text-left"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Chat
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Confirmation Dialogs */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirm(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm bg-background border border-border shadow-2xl rounded-3xl p-6 md:p-8"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className={cn(
                  "h-16 w-16 rounded-2xl flex items-center justify-center shadow-lg",
                  showConfirm === 'delete' ? "bg-rose-50 text-rose-600 shadow-rose-100" : "bg-orange-50 text-orange-600 shadow-orange-100"
                )}>
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    {showConfirm === 'delete' ? 'Delete Conversation?' : 'Clear All Messages?'}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 font-medium">
                    {showConfirm === 'delete'
                      ? 'This will permanently remove the chat and all history. This action cannot be undone.'
                      : 'Every message in this chat will be permanently deleted for both participants.'}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 w-full mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirm(null)}
                    className="rounded-xl h-12 font-bold"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={showConfirm === 'delete' ? handleDeleteChat : handleClearChat}
                    className="rounded-xl h-12 font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30"
                  >
                    {showConfirm === 'delete' ? 'Delete' : 'Clear'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Messages Area - Background Mesh */}
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay pointer-events-none grid-overlay" />

      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 md:p-8 space-y-2 z-10 scrollbar-hide"
      >
        {chatPagination?.hasMore && (
          <div className="flex justify-center py-4">
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin text-primary/40" />
            ) : (
              <span className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest">Scroll up to load more</span>
            )}
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              text={msg.text}
              timestamp={msg.timestamp}
              isOwn={msg.isOwn}
              isRead={msg.isRead}
              senderAvatar={msg.isOwn
                ? (me?.avatar ? me.avatar : null)
                : (participant.avatar ? participant.avatar : null)
              }
              senderName={msg.isOwn ? (me?.firstName || 'Me') : participant.name}
              attachments={msg.attachments}
            />
          ))}

          {/* Animated Typing Indicator in Message area */}
          {otherTypingUsers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex justify-start items-center gap-3 mt-4"
            >
              <div className="shrink-0">
                {participant.avatar ? (
                  <img
                    src={participant.avatar}
                    alt="typing"
                    className="w-8 h-8 rounded-lg object-cover border border-border/40"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-xs text-primary border border-border/40">
                    {participant.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="bg-background border border-border/60 p-3 px-5 rounded-2xl rounded-tl-none flex gap-1.5 shadow-sm">
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                  className="w-1.5 h-1.5 bg-primary/40 rounded-full"
                />
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                  className="w-1.5 h-1.5 bg-primary/60 rounded-full"
                />
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                  className="w-1.5 h-1.5 bg-primary/80 rounded-full"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 bg-card border-t border-border/40 z-10 shrink-0">
        {!isMutual ? (
          <div className="flex flex-col items-center justify-center py-4 bg-primary/5 rounded-2xl border border-primary/10 border-dashed animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <ShieldAlert className="w-5 h-5 text-primary" />
            </div>
            <p className="text-sm font-black text-primary uppercase tracking-widest">Mutual Connection Required</p>
            <p className="text-[10px] font-bold text-muted-foreground mt-1 px-8 text-center">
              You can only send messages to users you follow and who follow you back.
            </p>
          </div>
        ) : (
          <>
            {/* File Previews */}
            <AnimatePresence>
              {filePreviews.length > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="flex gap-3 mb-4 overflow-x-auto py-2 scrollbar-hide"
                >
                  {filePreviews.map((preview, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="relative group shrink-0"
                    >
                      <div className="w-20 h-20 rounded-xl overflow-hidden border border-border/50 bg-primary/5 flex items-center justify-center">
                        {preview.url ? (
                          <img src={preview.url} alt="preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex flex-col items-center gap-1 p-2">
                            <FileIcon className="w-8 h-8 text-primary/40" />
                            <span className="text-[10px] font-bold text-muted-foreground truncate w-full text-center">
                              {preview.name}
                            </span>
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="absolute -top-2 -right-2 p-1 bg-rose-500 text-white rounded-full shadow-lg hover:bg-rose-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <form
              onSubmit={handleSend}
              className="flex items-end gap-2 max-w-4xl mx-auto"
            >
              <div className="flex-1 flex items-end gap-2 bg-primary/5 border border-primary/10 rounded-[2rem] p-2 focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-card transition-all relative">
                <div className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className={cn(
                      "p-3 transition-colors",
                      showEmojiPicker ? "text-primary" : "text-muted-foreground hover:text-primary"
                    )}
                  >
                    <Smile className="w-5 h-5" />
                  </button>

                  <AnimatePresence>
                    {showEmojiPicker && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-16 left-0 z-[60]"
                      >
                        <div className="fixed inset-0 z-[-1]" onClick={() => setShowEmojiPicker(false)} />
                        <EmojiPicker
                          onEmojiClick={onEmojiClick}
                          theme={Theme.AUTO}
                          lazyLoadEmojis={true}
                          searchDisabled={false}
                          skinTonesDisabled={true}
                          width={320}
                          height={400}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <textarea
                  value={inputText}
                  onChange={handleInputChange}
                  placeholder="Type a message..."
                  rows={1}
                  onFocus={() => setShowEmojiPicker(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e);
                    }
                  }}
                  className="flex-1 bg-transparent border-none py-3 px-2 text-sm focus:outline-none resize-none max-h-32 min-h-[44px] font-semibold text-foreground placeholder:text-muted-foreground/70"
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "p-3 transition-colors shrink-0",
                    selectedFiles.length > 0 ? "text-primary" : "text-muted-foreground hover:text-primary"
                  )}
                >
                  <Paperclip className="w-5 h-5" />
                </button>
              </div>

              <button
                type="submit"
                disabled={!inputText.trim() && selectedFiles.length === 0}
                className={cn(
                  "p-4 rounded-full flex items-center justify-center transition-all duration-300 shrink-0",
                  (inputText.trim() || selectedFiles.length > 0)
                    ? "bg-primary text-white shadow-lg shadow-primary/30 hover:scale-105 active:scale-95"
                    : "bg-primary/10 text-primary/40 cursor-not-allowed"
                )}
              >
                <Send className="w-5 h-5 ml-0.5" />
              </button>
            </form>
          </>
        )}
      </div>

      <CallOverlay
        isOpen={isCallOverlayOpen}
        onClose={() => {
          setIsCallOverlayOpen(false);
          setIsIncomingCall(false);
          setIncomingCall(null);
        }}
        participants={participant ? [participant] : []}
        initialType={activeCallType}
        isIncoming={isIncomingCall}
        incomingSignal={incomingCall?.signal}
        callerId={incomingCall?.from}
      />
    </div>
  );
};
