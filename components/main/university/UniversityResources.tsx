"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { Download, Calendar, FileText, BookOpen, Library, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const data = [
  { name: 'University Prospectus 2024-25', date: '12-02-2025', type: 'Prospectus', icon: BookOpen, size: '2.4 MB' },
  { name: 'Academic Calendar Spring 2025', date: '20-01-2025', type: 'Calendar', icon: Calendar, size: '1.1 MB' },
  { name: 'Hostel Accommodation Guide', date: '05-01-2025', type: 'Guide', icon: Library, size: '3.7 MB' },
  { name: 'Research Paper Formatting Rules', date: '15-12-2024', type: 'Document', icon: FileText, size: '0.8 MB' },
]

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0 }
}

export const UniversityResources = () => {
  const [downloaded, setDownloaded] = useState<number[]>([])
  const [hovered, setHovered] = useState<number | null>(null)

  const handleDownload = (index: number) => {
    setDownloaded(prev => [...prev, index])
    setTimeout(() => setDownloaded(prev => prev.filter(i => i !== index)), 2500)
  }

  return (
    <Card className="rounded-3xl border border-emerald-100 bg-card shadow-sm overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-3 border-b border-emerald-100 bg-emerald-50/60 py-4 px-6">
        <motion.div
          whileHover={{ rotate: 15, scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="p-1.5 bg-emerald-100 rounded-lg text-emerald-600"
        >
          <Library className="w-4 h-4" />
        </motion.div>
        <CardTitle className="text-base font-black text-emerald-700 tracking-tight">
          Resources & Downloads
        </CardTitle>
        <span className="ml-auto text-[10px] font-black text-emerald-400 uppercase tracking-widest">
          {data.length} files
        </span>
      </CardHeader>

      <CardContent className="p-5">
        <motion.div
          className="flex flex-col gap-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {data.map((resource, index) => {
            const isHovered = hovered === index
            const isDone = downloaded.includes(index)
            const Icon = resource.icon

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                transition={{ type: 'spring', stiffness: 240, damping: 20 }}
                onHoverStart={() => setHovered(index)}
                onHoverEnd={() => setHovered(null)}
                animate={{
                  backgroundColor: isHovered ? 'rgb(240 253 244)' : 'rgb(250 254 252)',
                  borderColor: isHovered ? 'rgb(110 231 183)' : 'rgb(209 250 229)',
                }}
                className="relative flex items-center gap-4 p-4 rounded-2xl border border-emerald-100 overflow-hidden"
                style={{ boxShadow: isHovered ? '0 8px 28px rgba(16,185,129,0.14)' : 'none' }}
              >
                {/* Icon badge */}
                <motion.div
                  animate={{ rotate: isHovered ? 8 : 0, scale: isHovered ? 1.12 : 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="shrink-0 p-3 rounded-xl bg-emerald-100 text-emerald-600"
                >
                  <Icon className="w-5 h-5" />
                </motion.div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{resource.name}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-wider">{resource.date}</span>
                    <span className="text-[10px] font-black text-emerald-300">•</span>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-wider">{resource.size}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600">
                      {resource.type}
                    </span>
                  </div>
                </div>

                {/* Download button */}
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handleDownload(index)}
                  className={cn(
                    "shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all duration-300",
                    isDone
                      ? "bg-green-100 text-green-600 cursor-default"
                      : "bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/25 hover:shadow-emerald-500/40"
                  )}
                  disabled={isDone}
                >
                  <AnimatePresence mode="wait">
                    {isDone ? (
                      <motion.span
                        key="done"
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.7 }}
                        className="flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Done
                      </motion.span>
                    ) : (
                      <motion.span
                        key="download"
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.7 }}
                        className="flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

                {/* Hover glow blob */}
                <motion.div
                  animate={{ opacity: isHovered ? 0.2 : 0, scale: isHovered ? 1.3 : 1 }}
                  transition={{ duration: 0.4 }}
                  className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-emerald-300 blur-2xl pointer-events-none"
                />
              </motion.div>
            )
          })}
        </motion.div>
      </CardContent>
    </Card>
  )
}
