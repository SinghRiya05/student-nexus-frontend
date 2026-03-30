"use client"

import React from 'react'
import UniversityHeader from './UniversityHeader'
import UniversitySearch from './UniversitySearch'
import UniversityCard from './UniversityCard'
import { motion } from "motion/react"
import { ArrowRight } from "lucide-react"

const featuredUniversity = {
    name: "Babu Banarasi Das University",
    location: "Fairzdabad Road, Lucknow",
    students: "18,000+",
    type: "Private",
}

const universities = [
    { name: "Lucknow University", location: "University Road, Lucknow", students: "22000+", type: "Government", color: "bg-blue-500/10" },
    { name: "Amity University", location: "Gomti Nagar, Lucknow", students: "12000+", type: "Private", color: "bg-purple-500/10" },
    { name: "Integral University", location: "Kursi Road, Lucknow", students: "10000+", type: "Private", color: "bg-orange-500/10" },
    { name: "BHU Varanasi", location: "Varanasi, UP", students: "35000+", type: "Government", color: "bg-red-500/10" },
    { name: "IIT Kanpur", location: "Kalyanpur, Kanpur", students: "8000+", type: "Government", color: "bg-emerald-500/10" },
    { name: "SRM University", location: "Chennai, Tamil Nadu", students: "25000+", type: "Private", color: "bg-yellow-500/10" },
]

const UniversityMain = () => {
    return (
        <div className="space-y-12">
            <UniversityHeader />
            <UniversitySearch />
            
            {/* Featured Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-4">
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-800">Featured Institution</h4>
                    <span className="text-[10px] font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">Most Searched</span>
                </div>
                <UniversityCard variant="featured" university={featuredUniversity} />
            </div>

            {/* Explore Section */}
            <div className="space-y-8">
                <div className="flex items-center justify-between px-4">
                    <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Explore Universities</h2>
                    <div className="flex items-center gap-4">
                        <span className="hidden md:block text-[11px] font-bold text-slate-400 uppercase tracking-widest">Showing 148 results</span>
                        <button className="text-[11px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-all flex items-center gap-1 group">
                            Advanced Search <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {universities.map((uni, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * idx }}
                        >
                            <UniversityCard university={uni} />
                        </motion.div>
                    ))}
                </div>

                <div className="pt-8 flex justify-center">
                    <button className="group px-8 py-4 rounded-2xl bg-white border-2 border-slate-100 text-slate-600 font-bold hover:bg-slate-50 hover:border-primary/20 hover:text-primary transition-all flex items-center gap-3">
                        Load More Institutions
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                            <ArrowRight className="w-3 h-3" />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default UniversityMain
