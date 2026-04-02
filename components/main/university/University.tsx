"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { Search, MapPin, Users, Award, ArrowRight } from "lucide-react"
import UniversitySidebar from "./UniversitySidebar"
import UniversityCard from "./UniversityCard"
import { motion } from "motion/react"
import UniversitySearch from "./UniversitySearch"

export default function University() {

    const quickPicksRow = ["Engineering", "medical", "Top 50 Rank", "Top 50 Rank", "Top 50 Rank", "Top 50 Rank"]

    const universities = [
        { id: 1, name: "Lucknow University", location: "University Road, Lucknow", students: "22000+", type: "Government", color: "bg-blue-500/10" },
        { id: 2, name: "Amity University", location: "Gomti Nagar, Lucknow", students: "12000+", type: "Private", color: "bg-purple-500/10" },
        { id: 3, name: "Integral University", location: "Kursi Road, Lucknow", students: "10000+", type: "Private", color: "bg-orange-500/10" },
        { id: 4, name: "BHU Varanasi", location: "Varanasi, UP", students: "35000+", type: "Government", color: "bg-red-500/10" },
        { id: 5, name: "IIT Kanpur", location: "Kalyanpur, Kanpur", students: "8000+", type: "Government", color: "bg-emerald-500/10" },
        { id: 6, name: "SRM University", location: "Chennai, Tamil Nadu", students: "25000+", type: "Private", color: "bg-yellow-500/10" },
    ]

    return (
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-10">
            {/* Main Content (Left 70%) */}
            <div className="lg:col-span-7 space-y-12">

                {/* 1. Header Section */}
                <section className="space-y-6">
                    <div>
                        <span className="text-blue-600 font-bold text-sm mb-1 block">Institutional Directory</span>
                        <h1 className="text-[44px] font-black text-[#1a1a3b] leading-tight mb-4">Universities</h1>
                        <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-2xl">
                            The Universities Directory is a structured list of verified institutions that helps users find and connect with students, seniors, and alumni within specific universities, enabling trusted academic networking.
                        </p>
                    </div>

                    {/* Search & Filters */}
                    <UniversitySearch />
                </section>

                {/* 2. Featured Institution Card (Full Overlay) */}
                <section className="relative h-[400px] rounded-2xl overflow-hidden border-2 border-purple-500/10 shadow-2xl group cursor-pointer">
                    <img
                        src="https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        alt="Featured University"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent p-10 flex flex-col justify-end">
                        <div className="space-y-6">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                                <div className="space-y-4">
                                    <div className="flex gap-3">
                                        <span className="bg-green-500 text-white text-[10px] font-black px-3 py-1.5 rounded-lg border border-white/20 italic shadow-lg">Global Rank #1</span>
                                        <span className="bg-red-500 text-white text-[10px] font-black px-3 py-1.5 rounded-lg border border-white/20 italic shadow-lg">Private</span>
                                    </div>
                                    <h2 className="text-[42px] font-black text-white leading-tight drop-shadow-lg">Babu Banarasi Das University</h2>
                                    <div className="flex flex-wrap items-center gap-8 text-[14px] text-white/90 font-bold">
                                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                                            <MapPin className="w-4 h-4 text-orange-400" />
                                            Lucknow, Uttar Pradesh
                                        </div>
                                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                                            <Users className="w-4 h-4 text-orange-400" />
                                            15,000+ Students
                                        </div>
                                    </div>
                                </div>
                                <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center p-4 shadow-2xl">
                                    <div className="w-full h-full bg-white rounded-xl flex items-center justify-center font-black text-xs text-[#1a1a3b]">LOGO</div>
                                </div>
                            </div>

                            <div className="h-px bg-white/20 w-full" />

                            <div className="flex justify-between items-center">
                                <button className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 font-black text-sm text-white hover:bg-white hover:text-[#1a1a3b] transition-all">
                                    Computer Science
                                </button>
                                <button className="px-10 py-4 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center gap-3 hover:bg-blue-700 hover:translate-x-2 transition-all shadow-xl shadow-blue-600/40">
                                    View Details
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. Explore Universities (Grid Overlay) */}
                <section className="space-y-8">
                    <h2 className="text-[34px] font-black text-[#1a1a3b]">Explore Universities</h2>

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

                </section>
            </div>

            {/* Sidebar (Right 30% on lg, Bottom on others) */}
            <div className="lg:col-span-3 sticky top-12 h-fit">
                <UniversitySidebar />
            </div>
        </div>
    )
}
