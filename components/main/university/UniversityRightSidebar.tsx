"use client"

import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Users, GraduationCap, Globe, ArrowUpRight } from "lucide-react"
import { motion } from "motion/react"

const DiscoverGroups = [
    { name: "AI Research Lab", members: "2.4K", icon: Globe, color: "text-blue-500", bg: "bg-blue-500/10" },
    { name: "Global Alumni", members: "15.8K", icon: GraduationCap, color: "text-purple-500", bg: "bg-purple-500/10" },
    { name: "Startup Foundry", members: "5.1K", icon: ArrowUpRight, color: "text-orange-500", bg: "bg-orange-500/10" },
]

const Certifications = [
    { title: "Data science course by IIT Kanpur", category: "ACADEMICS", students: "852", color: "border-blue-500/30" },
    { title: "Blockchain Fundamentals", category: "TECHNOLOGY", students: "1.2K", color: "border-purple-500/30" },
    { title: "Business Management", category: "MANAGEMENT", students: "440", color: "border-orange-500/30" },
]

const UniversityRight = () => {
    return (
        <aside className="w-full space-y-6">
            {/* Discover Groups */}
            <Card className="glass-card border-none rounded-3xl overflow-hidden shadow-xl">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="text-sm font-black uppercase tracking-widest text-slate-800">Discover Groups</h4>
                    </div>

                    <div className="space-y-4">
                        {DiscoverGroups.map((group, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ x: 5 }}
                                className="flex items-center justify-between p-3 rounded-2xl bg-white/50 border border-slate-100/50 hover:bg-white hover:shadow-md transition-all cursor-pointer group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl ${group.bg} flex items-center justify-center`}>
                                        <group.icon className={`w-5 h-5 ${group.color}`} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[13px] font-bold text-slate-700 leading-tight group-hover:text-primary transition-colors">{group.name}</span>
                                        <span className="text-[10px] font-bold text-slate-400 italic">{group.members} Members</span>
                                    </div>
                                </div>
                                <Button size="icon" className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-primary transition-all shadow-md">
                                    <Plus className="w-4 h-4 text-white" />
                                </Button>
                            </motion.div>
                        ))}
                    </div>

                    <Button variant="ghost" className="w-full mt-6 h-12 rounded-xl border border-slate-100 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-primary hover:bg-slate-50 transition-all">
                        See All Groups
                    </Button>
                </CardContent>
            </Card>

            {/* Certification Programs */}
            <Card className="glass-card border-none rounded-3xl overflow-hidden shadow-xl relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl -mr-10 -mt-10" />
                <CardContent className="p-6 relative z-10">
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-800 mb-2 leading-relaxed">Universities Free Certification Programs</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-100 pb-2">Upcoming Batch</p>

                    <div className="space-y-6">
                        {Certifications.map((cert, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ x: 5 }}
                                className={`relative pl-4 border-l-4 ${cert.color} group cursor-pointer`}
                            >
                                <span className="text-[10px] font-black text-primary/70 uppercase tracking-widest group-hover:text-primary transition-colors">{cert.category}</span>
                                <h5 className="text-[13px] font-extrabold text-slate-700 leading-snug my-1 group-hover:text-primary transition-colors">
                                    {cert.title}
                                </h5>
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                                    <Users className="w-3 h-3" />
                                    <span>{cert.students} students registered</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <Button className="w-full mt-8 h-12 rounded-2xl bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold shadow-lg shadow-yellow-100 transition-all gap-2 group">
                        Explore Courses <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                </CardContent>
            </Card>
        </aside>
    )
}

export default UniversityRight
