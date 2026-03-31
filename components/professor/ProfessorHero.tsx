"use client";

import React from "react";
import { MessageSquare, Video, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "motion/react";

interface ProfessorHeroProps {
  name?: string;
  qualifications?: string;
}

export default function ProfessorHero({
  name = "Pro. Rachhor Das Chachhar",
  qualifications = "Phd. | MBA | Finance",
}: ProfessorHeroProps) {
  return (
    <Card className="overflow-hidden  p-0 rounded-3xl border-none shadow-2xl shadow-primary/5 bg-white group">
      {/* Decorative Header Banner */}
      <div className="h-24 bg-linear-to-br from-primary via-primary/80 to-[#7387ff] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 grid-overlay" />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute -right-8 -top-8 w-32 h-32 bg-white/20 rounded-full blur-3xl"
        />
      </div>

      <CardContent className="px-8 pb-8 -mt-12 relative z-10">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-end">
          {/* Profile Image with Ring */}
          <div className="relative group/avatar">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="h-32 w-32 rounded-3xl p-1.5 bg-white shadow-2xl overflow-hidden border border-primary/5"
            >
              <div className="h-full w-full rounded-2xl bg-primary/5 flex items-center justify-center overflow-hidden">
                {/* This would be an img tag in a real app */}
                <span className="text-5xl font-black text-primary/20">{name.charAt(5)}</span>
              </div>
            </motion.div>
            <span className="absolute bottom-2 right-2 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full shadow-lg" />
          </div>

          {/* User Info & Actions */}
          <div className="flex-1 space-y-5 text-center sm:text-left sm:pb-2">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-white/90">
                {name}
              </h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1">
                <span className="bg-primary/10 text-primary text-[11px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider">
                  {qualifications.split('|')[0].trim()}
                </span>
                <span className="text-on-surface-variant/60 text-sm font-medium">
                  {qualifications.split('|').slice(1).join(' | ')}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <Button
                variant="outline"
                className="h-10 rounded-xl border-emerald-500/20 bg-emerald-50/50 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition-all font-bold px-5"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Message
              </Button>
              <Button
                variant="outline"
                className="h-10 rounded-xl border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 hover:text-primary transition-all font-bold px-5"
              >
                <Video className="mr-2 h-4 w-4" />
                Video Call
              </Button>
              <Button
                className="h-10 rounded-xl bg-primary text-white hover:bg-primary-dim font-bold px-8 shadow-lg shadow-primary/25 transition-all"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Follow
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
