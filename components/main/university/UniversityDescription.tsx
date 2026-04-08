"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Info, ChevronDown } from 'lucide-react'

export const UniversityDescription = ({ description }: { description: string }) => {
  const [expanded, setExpanded] = useState(false)

  const isLong = description.length > 200
  const preview = isLong ? description.slice(0, 200) + '…' : description

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="rounded-3xl border border-border/40 bg-card shadow-sm overflow-hidden group hover:shadow-md hover:border-primary/20 transition-all duration-500">
        <CardHeader className="flex flex-row items-center gap-3 border-b border-border/40 bg-primary/5 py-4 px-6">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="p-1.5 bg-primary/10 rounded-lg text-primary"
          >
            <Info className="w-4 h-4" />
          </motion.div>
          <CardTitle className="text-base font-black text-primary tracking-tight">
            About the University
          </CardTitle>
          {/* Decorative animated dot */}
          <motion.span
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="ml-auto w-2 h-2 rounded-full bg-primary/40"
          />
        </CardHeader>

        <CardContent className="p-6 relative">
          {/* Animated text block */}
          <AnimatePresence mode="wait">
            {expanded ? (
              <motion.p
                key="full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-muted-foreground text-sm leading-relaxed font-semibold"
              >
                {description}
              </motion.p>
            ) : (
              <motion.p
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-muted-foreground text-sm leading-relaxed font-semibold"
              >
                {preview}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Read More / Less toggle */}
          {isLong && (
            <motion.button
              onClick={() => setExpanded(!expanded)}
              whileTap={{ scale: 0.96 }}
              className="mt-4 flex items-center gap-1.5 text-primary text-xs font-black uppercase tracking-widest hover:underline underline-offset-2 transition-all duration-200"
            >
              <span>{expanded ? 'Show Less' : 'Read More'}</span>
              <motion.div
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </motion.button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
