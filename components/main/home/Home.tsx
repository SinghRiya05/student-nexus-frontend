"use client"

import React from 'react'
import LeftSection from './LeftSection'
import MainContent from './MainContent'
import RightSection from './RightSection'
import { motion } from "motion/react"

const Home = () => {
  return (
    <div className="min-h-screen w-full bg-slate-50/50 light-mesh-bg selection:bg-primary/10  ">
      <main className="w-full max-w-[90rem] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
          {/* Left Sidebar - Hidden on small/medium, visible on large */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className=" lg:block lg:col-span-2  top-10 h-fit"
          >
            <LeftSection />
          </motion.div>

          {/* Main Content Area - Full width on small/medium, 6 columns on large */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="col-span-1 lg:col-span-6 scrollbar-hide"
          >
            <MainContent />
          </motion.div>

          {/* Right Sidebar - Hidden on small/medium, visible on large */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className=" lg:block lg:col-span-2 top-10 h-fit"
          >
            <RightSection />
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default Home