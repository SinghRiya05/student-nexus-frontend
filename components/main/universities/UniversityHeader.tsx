"use client"

import React from 'react'
import { motion } from "motion/react"

const UniversityHeader = () => {
    return (
        <div className="mb-8 p-4">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[12px] font-bold text-blue-600 uppercase tracking-widest">Institutional Directory</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">
                    Universities
                </h1>
                
                <p className="text-sm md:text-base text-slate-500 font-medium max-w-2xl leading-relaxed">
                    The Universities Directory is a structured list of verified institutions that helps users find and connect with students, seniors, and alumni within specific universities, enabling trusted academic networking.
                </p>
            </motion.div>
        </div>
    )
}

export default UniversityHeader
