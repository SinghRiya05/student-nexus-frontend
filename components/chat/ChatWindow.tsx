import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Paperclip, 
  Smile, 
  Send, 
  MoreVertical, 
  Phone, 
  Video, 
  ArrowLeft 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Conversation, Message } from './types';
import { MessageBubble } from './MessageBubble';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    <div className="flex-1 flex flex-col h-full bg-card/30 relative">
      {/* Header */}
      <div className="h-[88px] px-4 md:px-8 border-b border-border/40 shrink-0 bg-card blur-background/80 flex items-center justify-between z-10 shadow-sm backdrop-blur-xl">
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
          <button className="p-2.5 rounded-full hover:bg-primary/5 text-muted-foreground transition-colors hidden sm:block">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2.5 rounded-full hover:bg-primary/5 text-muted-foreground transition-colors hidden sm:block">
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2.5 rounded-full hover:bg-primary/5 text-muted-foreground transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area - Background Mesh */}
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay pointer-events-none grid-overlay" />
      
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-2 z-10 scrollbar-hide">
        {/* Simple Date Divider Mock */}
        <div className="flex justify-center my-6">
          <span className="px-3 py-1 bg-primary/5 text-primary text-[10px] uppercase font-black tracking-widest rounded-full">
            Today
          </span>
        </div>

        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <MessageBubble 
              key={msg.id}
              text={msg.text}
              timestamp={msg.timestamp}
              isOwn={msg.senderId === currentUserId}
              isRead={msg.isRead}
            />
          ))}
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
              onChange={(e) => setInputText(e.target.value)}
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
    </div>
  );
};
