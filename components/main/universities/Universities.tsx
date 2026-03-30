"use client"

import React from 'react'
import LeftSection from '@/components/main/home/LeftSection'
import UniversityMain from './UniversityMain'
import UniversityRight from './UniversityRight'
import { motion } from "motion/react"

const Universities = () => {
  return (
    <div className="min-h-screen w-full bg-slate-50/50 light-mesh-bg selection:bg-primary/10">
      <main className="w-full max-w-[90rem] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar - Navigation (Reused from Home) */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="hidden lg:block lg:col-span-2 sticky top-8 h-fit"
          >
            <LeftSection />
          </motion.div>

          {/* Main Content Area */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="col-span-1 lg:col-span-7 scrollbar-hide"
          >
            <UniversityMain />
          </motion.div>

          {/* Right Sidebar - University Specific */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="hidden lg:block lg:col-span-3 sticky top-8 h-fit"
          >
            <UniversityRight />
          </motion.div>
          
          {/* Mobile View - Right sidebar sections at bottom */}
          <div className="lg:hidden col-span-1 space-y-8 mt-12">
             <UniversityRight />
          </div>

        </div>
      </main>
    </div>
  )
}

export default Universities
