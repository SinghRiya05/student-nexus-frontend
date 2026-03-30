"use client"

import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, ChevronRight, Building2 } from "lucide-react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

interface UniversityCardProps {
    variant?: "featured" | "grid"
    university: {
        name: string
        location: string
        students: string
        type: string
        rank?: string
        major?: string
        image?: string
        logo?: string
        color?: string
    }
}

const UniversityCard = ({ variant = "grid", university }: UniversityCardProps) => {
    if (variant === "featured") {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className="group relative"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-50" />
                <Card className="glass-card relative border-none rounded-sm overflow-hidden shadow-2xl p-0">
                    <CardContent className="p-0 flex flex-col md:flex-row">
                        {/* Image/Logo Section */}
                        <div className="w-full md:w-2/5 h-64 md:h-auto relative overflow-hidden bg-slate-900/5">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Building2 className="w-20 h-20 text-primary/10" />
                            </div>
                            {/* Placeholder for University Image */}
                            <div className="w-24 h-24 absolute top-6 left-6 bg-white rounded-2xl shadow-xl flex items-center justify-center p-4 border border-slate-100">
                                <span className="font-bold text-primary">LOGO</span>
                            </div>
                            <div className="absolute bottom-6 left-6 text-primary font-semibold drop-shadow-sm">
                                University Image
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="w-full md:w-3/5 p-8 flex flex-col justify-between">
                            <div>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <Badge className="bg-green-500/10 text-green-600 border-none px-3 py-1 font-bold text-[10px] tracking-wider uppercase">
                                        Global Rank #1
                                    </Badge>
                                    <Badge className="bg-red-500/10 text-red-600 border-none px-3 py-1 font-bold text-[10px] tracking-wider uppercase">
                                        Private
                                    </Badge>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-4 tracking-tight group-hover:text-primary transition-colors">
                                    {university.name}
                                </h3>
                                
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                                            <MapPin className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <span className="text-sm font-medium">{university.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                                            <Users className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <span className="text-sm font-medium">{university.students}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Top Major</span>
                                    <span className="text-[12px] font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 uppercase">
                                        Computer Science
                                    </span>
                                </div>
                                <Button className="h-12 px-6 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all gap-2">
                                    View Details <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5 }}
            className="group"
        >
            <Card className="glass-card border-none rounded-sm overflow-hidden hover:shadow-2xl transition-all duration-300 p-0">
                <CardContent className="p-0">
                    <div className={cn("h-32 relative overflow-hidden bg-slate-100", university.color || "bg-slate-100")}>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="w-20 h-20 rounded-full bg-white shadow-xl flex items-center justify-center p-4 border-4 border-white">
                                <Building2 className="w-10 h-10 text-primary/20" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="px-6 pb-6 pt-12 flex flex-col items-center text-center -mt-10 overflow-visible relative z-10">
                        <h4 className="text-lg font-extrabold text-slate-800 leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-1">
                            {university.name}
                        </h4>
                        <div className="flex items-center gap-1.5 text-slate-400 mb-4">
                            <MapPin className="w-3.5 h-3.5" />
                            <span className="text-xs font-semibold capitalize">{university.location}</span>
                        </div>

                        <div className="w-full grid grid-cols-2 gap-2 mb-6 border-y border-slate-100 py-4">
                            <div className="flex flex-col items-center gap-1 border-r border-slate-100">
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Students</span>
                                <span className="text-[13px] font-extrabold text-slate-700">{university.students}</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Type</span>
                                <span className="text-[13px] font-extrabold text-green-600 bg-green-500/10 px-2 rounded-lg">{university.type}</span>
                            </div>
                        </div>

                        <Button variant="outline" className="w-full h-11 rounded-xl border-2 border-slate-100 text-slate-600 font-bold hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 group/btn">
                            View Details
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}

export default UniversityCard
