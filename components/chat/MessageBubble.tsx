import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check, CheckCheck } from 'lucide-react';

interface MessageBubbleProps {
  text: string;
  timestamp: string;
  isOwn: boolean;
  isRead?: boolean;
  senderAvatar?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ text, timestamp, isOwn, isRead, senderAvatar }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={cn(
        "flex w-full mt-4 gap-3",
        isOwn ? "justify-end" : "justify-start"
      )}
    >
      {/* Avatar */}
      <div className="shrink-0 mt-auto mb-1">
        <img
          src={senderAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${isOwn ? 'Me' : 'User'}`}
          alt="avatar"
          className="w-8 h-8 rounded-lg object-cover border border-border/40 shadow-sm"
        />
      </div>

      <div className={cn(
        "relative group flex flex-col gap-1 p-4 text-sm shadow-md transition-all duration-300 max-w-[75%]",
        isOwn
          ? "bg-primary text-white rounded-2xl rounded-tr-none"
          : "bg-background border border-border/60 text-foreground rounded-2xl rounded-tl-none"
      )}>
        <p className="leading-relaxed font-medium whitespace-pre-wrap">{text}</p>

        <div className={cn(
          "flex items-center gap-1.5 mt-1 text-[10px] uppercase tracking-wider font-bold select-none",
          isOwn ? "text-primary-foreground/70 justify-end" : "text-muted-foreground justify-end"
        )}>
          <span>{timestamp}</span>

          {isOwn && (
            <span className="ml-0.5">
              {isRead ? (
                <CheckCheck className="w-3.5 h-3.5 text-blue-300" />
              ) : (
                <Check className="w-3.5 h-3.5 opacity-70" />
              )}
            </span>
          )}
        </div>
      </div>
    </motion.div >
  );
};
