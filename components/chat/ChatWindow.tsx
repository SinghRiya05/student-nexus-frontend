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
  ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppSelector, useAppDispatch } from '@/utils/hook';
import { clearChatMessages, deleteChatConversation } from '@/features/chat/chatThunk';
import { useRouter } from 'next/navigation';
import { ASSET_URL } from '@/services/apiEndpoints';
import { toast } from 'react-hot-toast';
import { emitTyping, emitStopTyping, emitMessageSeen } from '@/services/socket';
import { Conversation, Message } from './types';
import { MessageBubble } from './MessageBubble';
import { CallOverlay } from './CallOverlay';
import { Button } from '../ui/button';

interface ChatWindowProps {
  conversation: Conversation | null;
  messages: Message[];
  currentUserId: string;
  onSendMessage: (text: string) => void;
  onBack?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  messages,
  currentUserId,
  onSendMessage,
  onBack
}) => {
  const [inputText, setInputText] = useState('');
  const [isCallOverlayOpen, setIsCallOverlayOpen] = useState(false);
  const [activeCallType, setActiveCallType] = useState<'audio' | 'video'>('audio');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [showConfirm, setShowConfirm] = useState<'clear' | 'delete' | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { me } = useAppSelector(state => state.user);
  const { typingUsers } = useAppSelector(state => state.chat);

  const chatTypingUsers = conversation ? (typingUsers[conversation.id] || []) : [];
  const otherTypingUsers = chatTypingUsers.filter(id => id !== me?._id);

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

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
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

          <div className="relative">
            <img
              src={participant.avatar}
              alt={participant.name}
              className="w-12 h-12 rounded-xl object-cover shadow-sm border border-border/50"
            />
            {participant.status === 'online' && (
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-card rounded-full" />
            )}
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight text-foreground">{participant.name}</h2>
            <p className="text-xs font-bold text-muted-foreground">
              {participant.status === 'online' ? (
                <span className="text-green-500">Active Now</span>
              ) : (
                `Role: ${participant.role}`
              )}
            </p>
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

      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-2 z-10 scrollbar-hide">
        {/* --- INTEGRATION: Date Dividers ---
          Render dynamic date dividers based on message timestamps.
        */}

        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              text={msg.text}
              timestamp={msg.timestamp}
              isOwn={msg.isOwn}
              isRead={msg.isRead}
              senderAvatar={msg.isOwn
                ? (me?.avatar ? `${ASSET_URL}${me.avatar}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${me?.firstName || 'Me'}`)
                : participant.avatar
              }
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
                <img
                  src={participant.avatar}
                  alt="typing"
                  className="w-8 h-8 rounded-lg object-cover border border-border/40"
                />
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
        <form
          onSubmit={handleSend}
          className="flex items-end gap-2 max-w-4xl mx-auto"
        >
          <div className="flex-1 flex items-end gap-2 bg-primary/5 border border-primary/10 rounded-[2rem] p-2 focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-card transition-all">
            <button type="button" className="p-3 text-muted-foreground hover:text-primary transition-colors shrink-0">
              <Smile className="w-5 h-5" />
            </button>
            <textarea
              value={inputText}
              onChange={handleInputChange}
              placeholder="Type a message..."
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              className="flex-1 bg-transparent border-none py-3 px-2 text-sm focus:outline-none resize-none max-h-32 min-h-[44px] font-semibold text-foreground placeholder:text-muted-foreground/70"
            />
            <button type="button" className="p-3 text-muted-foreground hover:text-primary transition-colors shrink-0">
              <Paperclip className="w-5 h-5" />
            </button>
          </div>

          <button
            type="submit"
            disabled={!inputText.trim()}
            className={cn(
              "p-4 rounded-full flex items-center justify-center transition-all duration-300 shrink-0",
              inputText.trim()
                ? "bg-primary text-white shadow-lg shadow-primary/30 hover:scale-105 active:scale-95"
                : "bg-primary/10 text-primary/40 cursor-not-allowed"
            )}
          >
            <Send className="w-5 h-5 ml-0.5" />
          </button>
        </form>
      </div>

      <CallOverlay
        isOpen={isCallOverlayOpen}
        onClose={() => setIsCallOverlayOpen(false)}
        participants={participant ? [participant] : []}
        initialType={activeCallType}
      />
    </div>
  );
};
