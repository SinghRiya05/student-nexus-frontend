"use client";

import React from "react";
import { Calendar, Clock, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "motion/react";

const CLASSES_DATA = [
  { id: 1, subject: "B.Tech", time: "04:12PM", days: ["M", "T", "W", "TH"] },
  { id: 2, subject: "BCA", time: "12:02AM", days: ["M", "T", "W"] },
  { id: 3, subject: "MBA", time: "04:12PM", days: ["M", "T", "W", "TH"] },
  { id: 4, subject: "B.Tech", time: "04:12PM", days: ["M", "T", "W", "TH"] },
];

export default function ScheduledClasses() {
  return (
    <div className="space-y-4 bg-white border p-5 rounded-2xl">
      <div className="flex items-center justify-between px-2">
        <h3 className="flex items-center gap-2 text-xs font-black tracking-widest uppercase text-primary/70">
          <Calendar className="h-4 w-4" />
          Scheduled classes
        </h3>
        <button className="text-[10px] font-bold text-primary hover:underline transition-all">View All</button>
      </div>

      <div className="space-y-3">
        {CLASSES_DATA.map((cls, idx) => (
          <motion.div
            key={cls.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group relative overflow-hidden rounded-2xl border border-primary/5 bg-white p-4 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-[14px] font-black text-[#302e56] group-hover:text-primary transition-colors">
                {cls.subject}
              </h4>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-on-surface-variant/40">
                <Clock className="h-3.5 w-3.5 text-primary/40" />
                {cls.time}
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-2">
              <div className="flex gap-1">
                {["M", "T", "W", "TH", "F"].map((day) => (
                  <span
                    key={day}
                    className={`flex h-6 w-6 items-center justify-center rounded-lg text-[9px] font-black border transition-all ${cls.days.includes(day)
                      ? "bg-primary text-white border-primary shadow-sm"
                      : "bg-on-surface-variant/5 border-on-surface-variant/10 text-on-surface-variant/40"
                      }`}
                  >
                    {day}
                  </span>
                ))}
              </div>
              <ChevronRight className="h-4 w-4 text-primary/20 group-hover:text-primary transition-all group-hover:translate-x-1" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
