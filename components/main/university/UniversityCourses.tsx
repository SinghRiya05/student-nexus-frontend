"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { cn } from '@/lib/utils'
import { GraduationCap, Building2, Cpu, Database, BarChart3, Briefcase, Code2, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const courses = [
  { name: 'MBA', full: 'Master of Business Administration', icon: BarChart3, bg: 'bg-blue-50', text: 'text-blue-600', ring: 'ring-blue-200', glow: 'shadow-blue-500/15' },
  { name: 'B.Tech', full: 'Bachelor of Technology', icon: Cpu, bg: 'bg-purple-50', text: 'text-purple-600', ring: 'ring-purple-200', glow: 'shadow-purple-500/15' },
  { name: 'BCA', full: 'Bachelor of Computer Applications', icon: Code2, bg: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-200', glow: 'shadow-emerald-500/15' },
  { name: 'BBA', full: 'Bachelor of Business Administration', icon: Briefcase, bg: 'bg-amber-50', text: 'text-amber-600', ring: 'ring-amber-200', glow: 'shadow-amber-500/15' },
  { name: 'BA', full: 'Bachelor of Arts', icon: Building2, bg: 'bg-rose-50', text: 'text-rose-600', ring: 'ring-rose-200', glow: 'shadow-rose-500/15' },
  { name: 'BSC', full: 'Bachelor of Science', icon: Database, bg: 'bg-indigo-50', text: 'text-indigo-600', ring: 'ring-indigo-200', glow: 'shadow-indigo-500/15' },
]

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } }
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 }
}

export const UniversityCourses = () => {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <Card className="rounded-3xl border border-border/40 bg-card shadow-sm overflow-hidden mb-10">
      <CardHeader className="flex flex-row items-center gap-3 border-b border-border/40 bg-primary/5 py-4 px-6">
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
          {courses.map((course) => {
            const isHovered = hovered === course.name
            return (
              <motion.div
                key={course.name}
                variants={cardVariants}
                whileHover={{ y: -6 }}
                onHoverStart={() => setHovered(course.name)}
                onHoverEnd={() => setHovered(null)}
                className={cn(
                  "relative group cursor-pointer rounded-2xl p-5 border-2 border-transparent transition-all duration-300 overflow-hidden",
                  course.bg,
                  isHovered && `ring-2 ${course.ring} shadow-xl ${course.glow}`
                )}
              >
                {/* Animated icon */}
                <motion.div
                  animate={{ rotate: isHovered ? 8 : 0, scale: isHovered ? 1.15 : 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={cn("inline-flex p-3 rounded-xl mb-4 shadow-sm", course.bg, course.text)}
                >
                  <course.icon className="w-6 h-6" />
                </motion.div>

                <h3 className={cn("text-lg font-black tracking-tight mb-0.5", course.text)}>
                  {course.name}
                </h3>

                {/* Full course name slides in on hover */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-[10px] font-bold text-muted-foreground/70 leading-tight mb-3"
                    >
                      {course.full}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* View arrow */}
                <motion.div
                  animate={{ x: isHovered ? 4 : 0, opacity: isHovered ? 1 : 0.4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={cn("flex items-center gap-1 text-[10px] font-black uppercase tracking-widest mt-1", course.text)}
                >
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3" />
                </motion.div>

                {/* Background blob */}
                <motion.div
                  animate={{ scale: isHovered ? 1.4 : 1, opacity: isHovered ? 0.25 : 0 }}
                  transition={{ duration: 0.5 }}
                  className={cn("absolute -bottom-6 -right-6 w-20 h-20 rounded-full blur-2xl", course.bg)}
                />
              </motion.div>
            )
          })}
        </motion.div>
      </CardContent>
    </Card>
  )
}
