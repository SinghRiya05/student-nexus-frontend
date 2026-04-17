"use client";

import React from "react";
import { Settings, X, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";

export interface NetworkUser {
  id: string;
  name: string;
  role: string;
  avatar: string;
  isFollowing?: boolean;
}

interface NetworkPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  users: NetworkUser[];
}

export default function NetworkPopup({ isOpen, onClose, title, users }: NetworkPopupProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-white flex flex-col rounded-lg shadow-2xl shadow-indigo-100/50 w-full max-w-sm sm:max-w-[600px] max-h-[85vh] border border-gray-100 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-white z-10 px-6 py-5 border-b border-gray-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Users size={16} />
                </div>
                <h2 className="text-base font-black text-[#1a1a3b]">{title}</h2>
              </div>
              <button
                onClick={onClose}
                className="h-10 w-10 rounded-2xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto p-2 sm:p-4 custom-scrollbar bg-[#fcf8ff]">
              {users.length > 0 ? (
                <div className="space-y-1">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-2 rounded-2xl hover:bg-white border border-transparent hover:border-indigo-50 transition-all group cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-2xl overflow-hidden bg-indigo-50 border-2 border-white shadow-sm shrink-0">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div>
                          <h4 className="font-black text-[#1a1a3b] text-sm group-hover:text-indigo-600 transition-colors">{user.name}</h4>
                          <p className="text-xs font-bold text-gray-400">{user.role}</p>
                        </div>
                      </div>
                      <div>
                        {title === "Following" || user.isFollowing ? (
                          <Button variant="outline" size="xs" className="h-8 px-5 rounded-xl font-bold text-xs uppercase tracking-wider text-gray-500 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-100 transition-colors">
                            Following
                          </Button>
                        ) : (
                          <Button size="xs" className="h-8 px-5 rounded-xl font-bold text-xs uppercase tracking-wider bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white shadow-none transition-colors">
                            Follow
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 pb-16 flex flex-col items-center justify-center text-center opacity-50">
                  <div className="h-16 w-16 bg-white rounded-3xl flex items-center justify-center mb-4 shadow-sm">
                    <Settings className="w-8 h-8 text-gray-400 animate-spin-slow" />
                  </div>
                  <p className="font-black text-[#1a1a3b] text-lg">Nothing to see here</p>
                  <p className="font-bold text-gray-400 text-sm">No users found for {title.toLowerCase()}.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
