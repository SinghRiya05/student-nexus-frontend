"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { User, Users, GraduationCap, Star, BookOpen, UserCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'About', icon: User, id: 'about' },
  { label: 'Reviews', icon: Star, id: 'reviews' },
  { label: 'Students', icon: Users, id: 'students' },
  { label: 'Alumni', icon: GraduationCap, id: 'alumni' },
  { label: 'Teachers', icon: UserCheck, id: 'teachers' },
]

export const UniversitySidebar = () => {
  const [active, setActive] = React.useState('about')

  return (
    <div className="flex overflow-x-auto md:flex-col gap-2 w-full md:w-56 md:sticky md:top-24 pb-4 md:pb-0 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
      {navItems.map((item, index) => {
        const isActive = active === item.id;
        return (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setActive(item.id)}
            className={cn(
              "relative flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold transition-all duration-300 whitespace-nowrap min-w-max group",
              isActive 
                ? "text-primary-foreground shadow-lg shadow-primary/20" 
                : "text-muted-foreground hover:text-primary active:scale-95"
            )}
          >
            {/* Active Background Pill */}
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-primary rounded-xl -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}

            {/* Hover Background (Visual feedback) */}
            <div className={cn(
              "absolute inset-0 rounded-xl bg-primary/5 opacity-0 transition-opacity duration-300 -z-20",
              !isActive && "group-hover:opacity-100"
            )} />

            <motion.div
              animate={{ 
                scale: isActive ? 1.1 : 1,
                rotate: isActive ? 5 : 0
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <item.icon className={cn(
                "w-4 h-4 shrink-0 transition-colors duration-300",
                isActive ? "text-primary-foreground" : "group-hover:text-primary"
              )} />
            </motion.div>

            <span className={cn(
              "text-xs uppercase tracking-wider font-extrabold transition-colors duration-300",
              isActive ? "text-primary-foreground" : "group-hover:text-primary"
            )}>
              {item.label}
            </span>

            {/* Indicator Dot (Desktop only style) */}
            {isActive && (
              <motion.div 
                layoutId="activeDot"
                className="hidden md:block absolute left-2 w-1 h-1 bg-primary-foreground rounded-full"
              />
            )}
          </motion.button>
        );
      })}
    </div>
  )
}
