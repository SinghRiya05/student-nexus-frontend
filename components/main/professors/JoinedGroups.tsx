"use client";

import React from "react";
import { Users, LayoutGrid, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

const GROUPS_DATA = [
  { id: 1, name: "Maths Group", members: "12M" },
  { id: 2, name: "Web Development", members: "12M" },
  { id: 3, name: "App Development", members: "12K" },
];

export default function JoinedGroups() {
  return (
    <div className="space-y-4 bg-white border p-5 rounded-2xl">
      <div className="flex items-center justify-between px-2">
        <h3 className="flex items-center gap-2 text-xs font-black tracking-widest uppercase text-primary/70">
          <LayoutGrid className="h-4 w-4" />
          Joined Groups
        </h3>
        <button className="text-[10px] font-bold text-primary hover:underline transition-all">Explore</button>
      </div>

      <div className="space-y-3">
        {GROUPS_DATA.map((group, idx) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="group relative flex items-center justify-between overflow-hidden rounded-2xl border border-emerald-500/5 bg-emerald-50/20 p-4 transition-all hover:bg-emerald-50 hover:border-emerald-500/20 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-black text-xs transition-all group-hover:bg-emerald-500 group-hover:text-white">
                {group.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-[14px] font-black text-primary group-hover:text-emerald-700 transition-colors">
                  {group.name}
                </h4>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-tighter">
                  <Users className="h-3 w-3" />
                  {group.members} Students
                </div>
              </div>
            </div>

            <button className="p-1.5 rounded-xl bg-white border border-emerald-500/10 transition-all opacity-0 group-hover:opacity-100 hover:bg-emerald-500 hover:text-white">
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
