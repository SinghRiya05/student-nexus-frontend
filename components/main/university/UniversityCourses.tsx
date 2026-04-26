"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  GraduationCap,
  Building2,
  Cpu,
  Database,
  BarChart3,
  Briefcase,
  Code2,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const getCourseStyle = (name: string) => {
  const lowerName = (name || "").toLowerCase();

  if (
    lowerName.includes("computer") ||
    lowerName.includes("tech") ||
    lowerName.includes("software") ||
    lowerName.includes("mca") ||
    lowerName.includes("bca")
  ) {
    return {
      icon: Code2,
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      ring: "ring-emerald-200",
      glow: "shadow-emerald-500/15",
    };
  }
  if (
    lowerName.includes("business") ||
    lowerName.includes("management") ||
    lowerName.includes("mba") ||
    lowerName.includes("bba")
  ) {
    return {
      icon: Briefcase,
      bg: "bg-amber-50",
      text: "text-amber-600",
      ring: "ring-amber-200",
      glow: "shadow-amber-500/15",
    };
  }
  if (
    lowerName.includes("finance") ||
    lowerName.includes("account") ||
    lowerName.includes("commerce") ||
    lowerName.includes("b.com")
  ) {
    return {
      icon: BarChart3,
      bg: "bg-blue-50",
      text: "text-blue-600",
      ring: "ring-blue-200",
      glow: "shadow-blue-500/15",
    };
  }
  if (
    lowerName.includes("science") ||
    lowerName.includes("physic") ||
    lowerName.includes("chemist") ||
    lowerName.includes("bsc")
  ) {
    return {
      icon: Database,
      bg: "bg-indigo-50",
      text: "text-indigo-600",
      ring: "ring-indigo-200",
      glow: "shadow-indigo-500/15",
    };
  }
  if (
    lowerName.includes("art") ||
    lowerName.includes("humanit") ||
    lowerName.includes("design") ||
    lowerName.includes("ba")
  ) {
    return {
      icon: Building2,
      bg: "bg-rose-50",
      text: "text-rose-600",
      ring: "ring-rose-200",
      glow: "shadow-rose-500/15",
    };
  }
  if (
    lowerName.includes("engineer") ||
    lowerName.includes("mech") ||
    lowerName.includes("civil") ||
    lowerName.includes("b.e")
  ) {
    return {
      icon: Cpu,
      bg: "bg-purple-50",
      text: "text-purple-600",
      ring: "ring-purple-200",
      glow: "shadow-purple-500/15",
    };
  }

  const styles = [
    {
      icon: GraduationCap,
      bg: "bg-slate-50",
      text: "text-slate-600",
      ring: "ring-slate-200",
      glow: "shadow-slate-500/15",
    },
    {
      icon: Code2,
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      ring: "ring-emerald-200",
      glow: "shadow-emerald-500/15",
    },
  ];
  const hash = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return styles[hash % styles.length];
};

const getCourseShortName = (name: string) => {
  const ignoreWords = [
    "of",
    "and",
    "in",
    "the",
    "for",
    "with",
    "on",
    "at",
    "by",
  ];
  if (!name || name.length <= 12) return name || ""; // If it's already reasonably short, don't acronymize
  const words = name.split(" ");
  if (words.length > 1) {
    const acronym = words
      .filter((w) => !ignoreWords.includes(w.toLowerCase()))
      .map((w) => w[0])
      .join(".")
      .toUpperCase();
    if (acronym.length >= 2) return acronym + ".";
  }
  return name.substring(0, 12);
};

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

interface UniversityCoursesProps {
  courses: string[];
}

export const UniversityCourses = ({ courses }: UniversityCoursesProps) => {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <Card className="rounded-3xl border border-border/40 bg-white shadow-sm overflow-hidden mb-10">
      <CardHeader className="flex flex-row items-center gap-3 border-b border-border/40 bg-primary/20 py-4 px-6">
        <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
          <GraduationCap className="w-4 h-4" />
        </div>
        <CardTitle className="text-base font-black text-primary tracking-tight">
          Programs Offered
        </CardTitle>
        <span className="ml-auto text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest">
          {courses.length} courses
        </span>
      </CardHeader>

      <CardContent className="p-6">
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {courses.map((courseName, idx) => {
            const style = getCourseStyle(courseName);
            const shortName = getCourseShortName(courseName);
            const isHovered = hovered === courseName;

            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                whileHover={{ y: -6 }}
                onHoverStart={() => setHovered(courseName)}
                onHoverEnd={() => setHovered(null)}
                className={cn(
                  "relative group cursor-pointer rounded-2xl p-5 border-2 border-transparent transition-all duration-300 overflow-hidden",
                  style.bg,
                  isHovered && `ring-2 ${style.ring} shadow-xl ${style.glow}`,
                )}
              >
                <motion.div
                  animate={{
                    rotate: isHovered ? 8 : 0,
                    scale: isHovered ? 1.15 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={cn(
                    "inline-flex p-3 rounded-xl mb-4 shadow-sm",
                    style.bg,
                    style.text,
                  )}
                >
                  <style.icon className="w-6 h-6" />
                </motion.div>

                <h3
                  className={cn(
                    "text-lg font-black tracking-tight mb-1",
                    style.text,
                  )}
                >
                  {shortName}
                </h3>

                <p className="text-[10px] font-bold text-muted-foreground/70 leading-tight mb-4 min-h-[2.5em] line-clamp-2">
                  {courseName}
                </p>

                <motion.div
                  animate={{
                    x: isHovered ? 4 : 0,
                    opacity: isHovered ? 1 : 0.4,
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={cn(
                    "flex items-center gap-1 text-[10px] font-black uppercase tracking-widest mt-1",
                    style.text,
                  )}
                >
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3" />
                </motion.div>

                <motion.div
                  animate={{
                    scale: isHovered ? 1.4 : 1,
                    opacity: isHovered ? 0.25 : 0,
                  }}
                  transition={{ duration: 0.5 }}
                  className={cn(
                    "absolute -bottom-6 -right-6 w-20 h-20 rounded-full blur-2xl",
                    style.bg,
                  )}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </CardContent>
    </Card>
  );
};
