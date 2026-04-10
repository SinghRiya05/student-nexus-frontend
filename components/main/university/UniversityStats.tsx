"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { GraduationCap, Trophy, Users, BookOpen, Layers, BarChart2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const stats = [
  { label: 'Courses', value: '1,254', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50', border: 'hover:border-blue-200', glow: 'shadow-blue-500/10' },
  { label: 'Rank', value: '#12', icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50', border: 'hover:border-amber-200', glow: 'shadow-amber-500/10' },
  { label: 'Students', value: '1.2M', icon: Users, color: 'text-rose-600', bg: 'bg-rose-50', border: 'hover:border-rose-200', glow: 'shadow-rose-500/10' },
  { label: 'Faculties', value: '250', icon: GraduationCap, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'hover:border-emerald-200', glow: 'shadow-emerald-500/10' },
  { label: 'Departments', value: '85', icon: Layers, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'hover:border-indigo-200', glow: 'shadow-indigo-500/10' },
]

export const UniversityStats = () => {
  return (
    <Card className="rounded-3xl border border-border/40 bg-card shadow-sm overflow-hidden mb-10">
      <CardHeader className="flex flex-row items-center gap-3 border-b border-border/40 bg-primary/5 py-4 px-6">
        <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
          <BarChart2 className="w-4 h-4" />
        </div>
        <CardTitle className="text-base font-black text-primary tracking-tight">
          University at a Glance
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 300 }}
              className={cn(
                "relative bg-background border border-border/40 rounded-2xl p-5 flex flex-col items-center justify-center text-center overflow-hidden transition-all duration-500",
                "hover:shadow-xl",
                stat.border,
                stat.glow
              )}
            >
              <div className={cn("absolute -inset-1 opacity-0 hover:opacity-10 transition-opacity blur-2xl", stat.bg)} />

              <div className={cn(
                "p-3 rounded-xl mb-3 transition-all duration-500",
                stat.bg,
                stat.color
              )}>
                <stat.icon className="w-5 h-5" />
              </div>

              <span className={cn("text-2xl font-black mb-0.5 tracking-tighter", stat.color)}>
                {stat.value}
              </span>

              <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.15em] px-2 py-0.5 rounded-full bg-muted/30">
                {stat.label}
              </span>

              <motion.div
                initial={{ width: 0 }}
                whileHover={{ width: "40%" }}
                className={cn("absolute bottom-0 h-1 rounded-full", stat.color.replace('text', 'bg'))}
              />
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
