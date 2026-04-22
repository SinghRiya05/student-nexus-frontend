import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, User as UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MutualFollower } from '@/features/users/userModel';
import { ASSET_URL } from '@/services/apiEndpoints';

interface NewChatListProps {
  followers: MutualFollower[];
  onSelect: (user: MutualFollower) => void;
  onBack: () => void;
  loading?: boolean;
}

export const NewChatList: React.FC<NewChatListProps> = ({ followers, onSelect, onBack, loading }) => {
  const [search, setSearch] = useState('');

  const filtered = followers.filter(f =>
    `${f.firstName} ${f.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col h-full bg-card overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border/40 shrink-0 bg-primary/5">
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-primary/10 rounded-full transition-colors text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-black text-primary tracking-tight">New Message</h2>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search followers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-background border border-primary/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground font-semibold"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-40 space-y-3">
             <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
             <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Finding mutuals...</p>
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((user) => (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              key={user._id}
              onClick={() => onSelect(user)}
              className="w-full flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-primary/5 group"
            >
              <div className="relative shrink-0">
                <img
                  src={user.avatar ? `${ASSET_URL}${user.avatar}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.firstName}`}
                  alt={user.firstName}
                  className="w-12 h-12 object-cover rounded-xl shadow-sm border border-border/40 group-hover:border-primary/30 transition-all"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm text-foreground truncate">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-tighter opacity-60">
                   Mutual Follower
                </p>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-center px-6">
            <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mb-4">
              <UserIcon className="w-8 h-8 text-primary/20" />
            </div>
            <h4 className="text-sm font-black text-[#1a1a3b] mb-1">No mutual followers</h4>
            <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
              Connect with more people to start new conversations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
