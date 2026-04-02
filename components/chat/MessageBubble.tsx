import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check, CheckCheck } from 'lucide-react';

interface MessageBubbleProps {
  text: string;
  timestamp: string;
  isOwn: boolean;
  isRead?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ text, timestamp, isOwn, isRead }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={cn(
        "flex w-full mt-4 space-x-3 max-w-2xl",
        isOwn ? "ml-auto justify-end" : "justify-start"
      )}
    >
      <div className={cn(
        "relative group flex flex-col gap-1 p-4 text-sm shadow-sm",
        isOwn 
          ? "bg-primary text-white rounded-2xl rounded-tr-sm" 
          : "bg-white border border-border/40 text-foreground rounded-2xl rounded-tl-sm"
      )}>
        <p className="leading-relaxed">{text}</p>
        
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
    </motion.div>
  );
};
