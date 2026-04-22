"use client"

import React from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, SlidersHorizontal, ArrowRight } from "lucide-react"
import { motion } from "motion/react"

const QuickPicks = [
    { label: "Engineering", color: "bg-orange-500", border: "border-orange-500/20", text: "text-orange-600" },
    { label: "Medical", color: "bg-red-500", border: "border-red-500/20", text: "text-red-600" },
    { label: "Top 50 Rank", color: "bg-purple-500", border: "border-purple-500/20", text: "text-purple-600" },
    { label: "Government", color: "bg-green-500", border: "border-green-500/20", text: "text-green-600" },
    { label: "Private", color: "bg-blue-500", border: "border-blue-500/20", text: "text-blue-600" },
    { label: "International", color: "bg-yellow-500", border: "border-yellow-500/20", text: "text-yellow-600" },
]

const UniversitySearch = () => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3 rounded-2xl space-y-8"
        >
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                    <Input
                        placeholder="Search by name, city, or major..."
                        className="h-14 pl-12 pr-4 rounded-2xl text-slate-700 font-medium placeholder:text-slate-400 transition-all"
                    />
                </div>
                <Button variant="outline" className="h-14 px-8 rounded-2xl border-2  font-bold text-slate-600 hover:bg-primary hover:text-white transition-all flex gap-3 group">
                    <SlidersHorizontal className="w-4 h-4  group-hover:rotate-180 transition-transform duration-500" />
                    Filters
                </Button>
            </div>
        </motion.div>
    )
}

export default UniversitySearch