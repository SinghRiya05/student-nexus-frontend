"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { UniversityHeader } from './UniversityHeader'
import { UniversitySidebar } from './UniversitySidebar'
import { UniversityDescription } from './UniversityDescription'
import { UniversityStats } from './UniversityStats'
import { UniversityCourses } from './UniversityCourses'
import { UniversityResources } from './UniversityResources'

interface UniversityProfileProps {
  data: {
    name: string
    location: string
    description: string
    bannerImage?: string
  }
}

export const UniversityProfile: React.FC<UniversityProfileProps> = ({ data }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 space-y-8 min-h-screen">
      {/* 1. Header Section */}
      <UniversityHeader
        name={data.name}
        location={data.location}
        bannerImage={data.bannerImage}
      />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* 3. Main Content Section */}
        <div className="flex-1 w-full space-y-8 pb-20">
          <UniversityDescription description={data.description} />

          <UniversityStats />

          <UniversityCourses />

          <UniversityResources />
        </div>
      </div>
    </div>
  )
}
