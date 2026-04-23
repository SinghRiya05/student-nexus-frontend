"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { UniversityHeader } from './UniversityHeader'
import { UniversitySidebar } from './UniversitySidebar'
import { UniversityDescription } from './UniversityDescription'
import { UniversityStats } from './UniversityStats'
import { UniversityCourses } from './UniversityCourses'
import { UniversityResources } from './UniversityResources'
import { IUniversity } from '@/features/university/universityModel'

interface UniversityProfileProps {
  data: IUniversity
}

export const UniversityProfile: React.FC<UniversityProfileProps> = ({ data }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 space-y-8 min-h-screen">
      {/* 1. Header Section */}
      <UniversityHeader
        name={data?.name?.toUpperCase()}
        location={`${data?.country?.name}, ${data?.state?.name}, ${data?.city?.name}`}
        bannerImage={data?.image}
        logoImage={data?.logo}
      />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* 3. Main Content Section */}
        <div className="flex-1 w-full space-y-8 pb-20">
          <UniversityDescription description={data?.description || ""} />

          <UniversityStats userCount={data?.userCount || 0} courseCount={data?.courseCount || 0} teacherCount={data?.teacherCount || 0} />

          <UniversityCourses courses={data?.courses || []} />

          <UniversityResources />
        </div>
      </div>
    </div>
  )
}
