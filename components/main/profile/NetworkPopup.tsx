"use client";

import { Settings, X, Users, Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/utils/hook";
import { accessChat } from "@/features/chat/chatThunk";
import toast from "react-hot-toast";

export interface NetworkUser {
  id: string;
  name: string;
  role: string;
  avatar: string;
  isFollowing?: boolean;
  isRequested?: boolean;
}

interface NetworkPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  users: NetworkUser[];
  onAction?: (userId: string, isFollowing: boolean) => Promise<void>;
}

export default function NetworkPopup({ isOpen, onClose, title, users, onAction }: NetworkPopupProps) {
  const [rowLoading, setRowLoading] = useState<Record<string, boolean>>({});
  const [messageLoading, setMessageLoading] = useState<Record<string, boolean>>({});
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 🛡️ Prevent any render if not mounted or not open to avoid z-index ghost layers
  if (!isMounted || !isOpen) return null;

  const handleAction = async (e: React.MouseEvent, user: NetworkUser) => {
    e.stopPropagation();
    if (!onAction) return;

    setRowLoading(prev => ({ ...prev, [user.id]: true }));
    try {
      await onAction(user.id, !!user.isFollowing);
    } finally {
      setRowLoading(prev => ({ ...prev, [user.id]: false }));
    }
  };

  const handleMessage = async (e: React.MouseEvent, user: NetworkUser) => {
    e.stopPropagation();
    setMessageLoading(prev => ({ ...prev, [user.id]: true }));
    try {
      const resultAction = await dispatch(accessChat({ userId: user.id }));
      if (accessChat.fulfilled.match(resultAction)) {
        router.push("/chat");
      } else {
        toast.error("Failed to initiate chat");
      }
    } catch (error) {
      toast.error("An error occurred while starting chat");
    } finally {
      setMessageLoading(prev => ({ ...prev, [user.id]: false }));
    }
  };

  const modalContent = (
    <AnimatePresence mode="wait">
      <div className="fixed inset-0 z-[10] flex items-center justify-center p-4">
        {/* Backdrop - Stronger isolation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        />

        {/* Modal container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative bg-white flex flex-col rounded-3xl shadow-[0_20px_70px_-10px_rgba(0,0,0,0.3)] w-full max-w-sm sm:max-w-[600px] max-h-[85vh] border border-gray-100 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-white z-10 px-8 py-6 border-b border-gray-50 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-[1.25rem] bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner">
                <Users size={20} />
              </div>
              <div>
                <h2 className="text-xl font-black text-[#1a1a3b]">{title}</h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{users.length} Total</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="h-10 w-10 rounded-2xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors group"
            >
              <X size={18} className="text-gray-400 group-hover:text-rose-500 transition-colors" />
            </button>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-[#fcfaff]">
            {users.length > 0 ? (
              <div className="space-y-2">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 rounded-[1.5rem] bg-white border border-transparent hover:border-indigo-100 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="h-12 w-12 rounded-[1rem] overflow-hidden bg-indigo-50 border-2 border-white shadow-sm shrink-0">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-black text-[#1a1a3b] text-sm group-hover:text-indigo-600 transition-colors truncate">{user.name}</h4>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider truncate">{user.role}</p>
                      </div>
                    </div>
                    <div className="shrink-0 ml-3 flex items-center gap-2">
                      <Button
                        onClick={(e) => handleMessage(e, user)}
                        disabled={messageLoading[user.id]}
                        variant="outline"
                        size="sm"
                        className="h-9 w-9 p-0 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-transparent transition-all"
                        title="Message"
                      >
                        {messageLoading[user.id] ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <MessageSquare size={16} />
                        )}
                      </Button>
                      {user.isFollowing ? (
                        <Button
                          onClick={(e) => handleAction(e, user)}
                          disabled={rowLoading[user.id]}
                          variant="outline"
                          size="sm"
                          className="h-9 px-6 rounded-xl font-black text-[10px] uppercase tracking-wider text-gray-500 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-all gap-2"
                        >
                          {rowLoading[user.id] && <Loader2 className="w-3 h-3 animate-spin" />}
                          Following
                        </Button>
                      ) : user.isRequested ? (
                        <Button
                          disabled
                          variant="outline"
                          size="sm"
                          className="h-9 px-6 rounded-xl font-black text-[10px] uppercase tracking-wider bg-gray-50 text-gray-400 border-gray-100"
                        >
                          Requested
                        </Button>
                      ) : (
                        <Button
                          onClick={(e) => handleAction(e, user)}
                          disabled={rowLoading[user.id]}
                          size="sm"
                          className="h-9 px-6 rounded-xl font-black text-[10px] uppercase tracking-wider bg-[#2949ef] text-white hover:bg-indigo-600 shadow-lg shadow-indigo-100 transition-all gap-2"
                        >
                          {rowLoading[user.id] && <Loader2 className="w-3 h-3 animate-spin" />}
                          Follow
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 flex flex-col items-center justify-center text-center">
                <div className="h-20 w-20 bg-white rounded-[2rem] flex items-center justify-center mb-6 shadow-sm border border-gray-50">
                  <Users className="w-10 h-10 text-indigo-100" />
                </div>
                <p className="font-black text-[#1a1a3b] text-xl mb-2">No {title.toLowerCase()} yet</p>
                <p className="font-bold text-gray-400 text-sm max-w-[200px]">When users join your network, they will appear here.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
}
