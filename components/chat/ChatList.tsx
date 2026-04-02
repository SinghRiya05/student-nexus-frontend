import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MoreVertical, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Conversation } from './types';

interface ChatListProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

export const ChatList: React.FC<ChatListProps> = ({ conversations, activeId, onSelect }) => {
  const [search, setSearch] = useState('');

  const filtered = conversations.filter(c =>
    c.participant.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full lg:w-full shrink-0 border-r border-border/40 bg-card/50 flex flex-col h-full overflow-hidden relative">
      {/* Search Header */}
      <div className="p-4 border-b border-border/40 shrink-0 bg-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-primary tracking-tight">Messages</h2>
          <div className="p-2 hover:bg-primary/5 rounded-full cursor-pointer transition-colors text-primary">
            <Edit className="w-4 h-4" />
          </div>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-primary/5 border border-primary/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground font-semibold text-foreground"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-1 scrollbar-hide">
        <AnimatePresence>
          {filtered.map((conv) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-300 group relative overflow-hidden",
                activeId === conv.id
                  ? "bg-primary shadow-md shadow-primary/20 scale-[1.02]"
                  : "hover:bg-primary/5 hover:scale-[1.01]"
              )}
            >
              {activeId !== conv.id && (
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}

              {/* Avatar Container */}
              <div className="relative shrink-0 z-10">
                <img
                  src={conv.participant.avatar}
                  alt={conv.participant.name}
                  className={cn(
                    "w-12 h-12 object-cover rounded-xl transition-all shadow-sm",
                    activeId === conv.id ? "ring-2 ring-white/30" : ""
                  )}
                />
                {conv.participant.status === 'online' && (
                  <span className={cn(
                    "absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2",
                    activeId === conv.id ? "bg-green-400 border-primary" : "bg-green-500 border-white"
                  )} />
                )}
              </div>

              {/* Text Info */}
              <div className="flex-1 min-w-0 z-10">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className={cn(
                    "font-bold truncate text-sm",
                    activeId === conv.id ? "text-white" : "text-foreground"
                  )}>
                    {conv.participant.name}
                  </h3>
                  <span className={cn(
                    "text-[10px] uppercase font-black tracking-wider shrink-0 ml-2",
                    activeId === conv.id ? "text-white/70" : "text-muted-foreground"
                  )}>
                    {conv.lastMessageTime}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <p className={cn(
                    "text-xs truncate font-medium",
                    activeId === conv.id ? "text-white/80" : "text-muted-foreground",
                    conv.unreadCount > 0 && activeId !== conv.id ? "text-foreground font-black" : ""
                  )}>
                    {conv.lastMessage}
                  </p>

                  {conv.unreadCount > 0 && activeId !== conv.id && (
                    <span className="shrink-0 w-5 h-5 flex items-center justify-center bg-primary text-white text-[10px] font-black rounded-full shadow-sm shadow-primary/20">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-center px-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
              <Search className="w-5 h-5 text-primary/50" />
            </div>
            <p className="text-sm font-bold text-muted-foreground">No conversations found</p>
          </div>
        )}
      </div>
    </div>
  );
};
