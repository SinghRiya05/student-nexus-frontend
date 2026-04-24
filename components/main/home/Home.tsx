"use client"

import React from 'react'
import MainContent from './MainContent'
import RightSection from './RightSection'
import { motion } from "motion/react"
import { useAppSelector } from '@/utils/hook'

const Home = () => {
  const user = useAppSelector((state) => state.auth.user);
  console.log(user);
  return (
    <div className="flex flex-col xl:flex-row gap-8">
      {/* Main Content Area */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex-1 min-w-0"
      >
        <MainContent />
      </motion.div>

      {/* Right Sidebar - Hidden on small/medium, visible on large */}
      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="hidden xl:block w-64 shrink-0"
      >
        <div className="sticky top-24">
          <RightSection />
        </div>
      </motion.div>
    </div>
  )
}

export default Home