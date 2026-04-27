import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check, CheckCheck, FileIcon, Download } from 'lucide-react';
import { Attachment } from './types';
import { ASSET_URL } from '@/services/apiEndpoints';

interface MessageBubbleProps {
  text: string;
  timestamp: string;
  isOwn: boolean;
  isRead?: boolean;
  senderAvatar?: string | null;
  senderName?: string;
  attachments?: Attachment[];
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ text, timestamp, isOwn, isRead, senderAvatar, senderName, attachments }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "flex w-full mt-1.5 px-2",
        isOwn ? "justify-end" : "justify-start"
      )}
    >
      {!isOwn && (
        <div className="shrink-0 mr-2 mt-auto">
          {senderAvatar ? (
            <img src={senderAvatar} alt="" className="w-8 h-8 rounded-lg object-cover border border-border/40" />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-xs text-primary border border-border/40">
              {senderName?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
        </div>
      )}
      <div className={cn(
        "relative group p-1.5 px-2.5 shadow-sm transition-all duration-300 max-w-[85%] w-fit",
        isOwn
          ? "bg-primary text-white rounded-xl rounded-tr-none"
          : "bg-muted text-foreground rounded-xl rounded-tl-none border border-border/40"
      )}>
        {attachments && attachments.length > 0 && (
          <div className="flex flex-col gap-1 mb-1">
            {attachments.map((file, idx) => {
              const isImage = file.fileType.startsWith('image/');
              return (
                <div key={idx} className="rounded-lg overflow-hidden border border-black/5">
                  {isImage ? (
                    <img
                      src={`${ASSET_URL}${file.url}`}
                      alt="attachment"
                      className="max-w-full rounded-lg cursor-pointer"
                      onClick={() => window.open(`${ASSET_URL}${file.url}`, '_blank')}
                    />
                  ) : (
                    <a
                      href={`${ASSET_URL}${file.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "flex items-center gap-2 p-1.5 rounded-lg border",
                        isOwn ? "bg-white/10 border-white/10" : "bg-primary/5 border-primary/5"
                      )}
                    >
                      <FileIcon className="w-3.5 h-3.5 shrink-0" />
                      <span className="font-bold truncate text-[10px] flex-1">
                        {file.url.split('-').pop()}
                      </span>
                      <Download className="w-3 h-3 opacity-50 shrink-0" />
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-end justify-end gap-2 flex-wrap">
          {text && (
            <p className="leading-[1.2] text-[13px] font-medium whitespace-pre-wrap break-words flex-1 min-w-0">
              {text}
            </p>
          )}

          <div className={cn(
            "flex items-center gap-0.5 text-[9px] font-bold select-none mb-[-2px] shrink-0 opacity-70",
            isOwn ? "text-primary-foreground/90" : "text-muted-foreground"
          )}>
            <span>{timestamp}</span>
            {isOwn && (
              <span className="ml-0.5">
                {isRead ? (
                  <CheckCheck className="w-3 h-3 text-blue-300" />
                ) : (
                  <Check className="w-3 h-3" />
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div >
  );
};
