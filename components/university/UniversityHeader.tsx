"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { MapPin, UserPlus } from 'lucide-react'

interface UniversityHeaderProps {
  name: string
  location: string
  bannerImage?: string
  logoImage?: string
}

export const UniversityHeader: React.FC<UniversityHeaderProps> = ({
  name,
  location,
  bannerImage
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full rounded-3xl overflow-hidden border border-border/40 bg-card shadow-sm"
    >
      {/* Banner Image with location overlay */}
      <div className="relative h-52 md:h-64 lg:h-72 w-full overflow-hidden">
        {bannerImage ? (
          <img
            src={bannerImage}
            alt="University Banner"
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-primary/5 grid-overlay" />
        )}
        {/* Bottom gradient for readability */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/50 to-transparent" />
        {/* Location pill overlaid on image */}
        <div className="absolute bottom-4 left-5 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 shadow-lg">
          <MapPin className="w-3.5 h-3.5 text-white" />
          <span className="text-white text-xs font-bold tracking-tight">{location}</span>
        </div>
      </div>

      {/* Info Row — below image */}
      <div className="px-6 md:px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-border/40">
        <h1 className="text-xl md:text-2xl font-black text-primary tracking-tight leading-snug">
          {name}
        </h1>

        <Button className="rounded-xl font-bold px-6 h-10 text-sm shadow-md shadow-primary/20 hover:shadow-primary/30 hover:scale-105 active:scale-95 transition-all duration-300 self-start sm:self-auto">
          <UserPlus className="w-4 h-4 mr-2" />
          Follow
        </Button>
      </div>
    </motion.div>
  )
}
