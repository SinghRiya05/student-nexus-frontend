"use client";

import React from "react";
import { Search, Upload, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "motion/react";

const NOTES_DATA = [
  { id: 1, title: "Maths notes", description: "Essential differential equations", isFree: true, date: "12-02-2025" },
  { id: 2, title: "Web development resources", description: "React context and hooks", isFree: true, date: "10-02-2025" },
  { id: 3, title: "Android development", description: "Kotlin coroutines guide", isFree: true, date: "08-02-2025" },
  { id: 4, title: "Android development", description: "Kotlin coroutines guide", isFree: true, date: "08-02-2025" },
  { id: 5, title: "System design", description: "Scalability patterns", isFree: false, date: "05-02-2025" },
  { id: 6, title: "Database optimization", description: "Indexing strategies", isFree: false, date: "01-02-2025" },
  { id: 7, title: "Database optimization", description: "Indexing strategies", isFree: false, date: "01-02-2025" },
];

export default function StudyResources() {
  return (
    <div className="space-y-4">
      {/* Class Notes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <h3 className="text-xs font-black uppercase tracking-widest text-[#302e56]/60">
              CLASS NOTES
            </h3>
          </div>
          <span className="text-[10px] font-bold text-primary/60 bg-primary/5 px-2 py-0.5 rounded-full uppercase tracking-tighter">
            {NOTES_DATA.length} Total items
          </span>
        </div>

        <Card className="rounded-2xl border-none py-3  bg-white/50 overflow-hidden divide-y divide-primary/5">
          {NOTES_DATA.map((note, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group relative flex items-center justify-between px-5 py-3 transition-all hover:bg-white"
            >
              <div className="flex items-center gap-5">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all group-hover:scale-110 shadow-sm ${note.isFree ? "bg-emerald-50 text-emerald-500" : "bg-amber-50 text-amber-600"
                  }`}>
                  <FileText className="h-6 w-6" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-bold text-[#302e56] group-hover:text-primary transition-colors">
                    {note.title}
                  </h4>
                  <p className="text-[12px] font-medium text-on-surface-variant/60">{note.description}</p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg ${note.isFree ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    }`}>
                    {note.isFree ? "Free" : "Premium"}
                  </span>
                  <span className="text-[10px] font-bold text-on-surface-variant/40">{note.date}</span>
                </div>
                <Button variant="ghost" size="sm" className="h-8 rounded-xl text-primary font-bold text-xs hover:bg-primary/10 transition-all">
                  <Download className="mr-2 h-3.5 w-3.5" />
                  Download
                </Button>
              </div>

              {/* Status bar */}
              <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-10 w-1 rounded-r-full transition-all group-hover:h-12 ${note.isFree ? "bg-emerald-500" : "bg-amber-500"
                }`} />
            </motion.div>
          ))}
        </Card>
      </div>
    </div>
  );
}
