"use client"

import React from 'react'
import { Plus, Globe, Users, BookOpen, GraduationCap } from "lucide-react"

export default function UniversitySidebar() {
    const groups = [
        { name: "AI Research Lab", members: "2.4k Members", icon: Globe },
        { name: "Design Collective", members: "1.8k Members", icon: Users },
        { name: "Data Science Squad", members: "3.2k Members", icon: Globe },
        { name: "Student Council", members: "5.1k Members", icon: Users },
    ]

    const certifications = [
        { title: "Data science course by IIT Kanpur", category: "ACADEMICS", students: "852 students registered" },
        { title: "AI & ML Masterclass by BITS", category: "ACADEMICS", students: "1,240 students registered" },
        { title: "Cloud Computing by AWS", category: "PROFESSIONAL", students: "2,100 students registered" },
    ]

    return (
        <aside className="space-y-8 sticky top-20">
            {/* 1. Discover Groups */}
            <div className="bg-white p-7 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-[#1a1a3b] text-[16px] mb-7">Discover Groups</h3>
                <div className="space-y-6">
                    {groups.map((group, idx) => (
                        <div key={idx} className="flex items-center justify-between group cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-[#1a1a3b] border border-gray-100 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                                    <group.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h5 className="font-bold text-sm text-[#1a1a3b] leading-tight mb-1 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{group.name}</h5>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{group.members}</p>
                                </div>
                            </div>
                            <button className="h-8 w-8 rounded-full border border-gray-200 flex items-center justify-center text-indigo-500 hover:bg-indigo-500 hover:text-white hover:border-indigo-500 transition-all">
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    <button className="w-full mt-4 py-4 rounded-xl bg-primary text-white text-sm font-black hover:bg-primary-foreground hover:text-primary transition-all">
                        See All Groups
                    </button>
                </div>
            </div>

            {/* 2. Free Certification Programs */}
            <div className="bg-white p-7 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-[#1a1a3b] text-base mb-7 leading-tight">Universities Free Certification Programs</h3>
                <div className="space-y-8">
                    {certifications.map((item, idx) => (
                        <div key={idx} className="space-y-2 group cursor-pointer">
                            <span className="text-[10px] font-black text-blue-500 tracking-widest uppercase">{item.category}</span>
                            <h4 className="font-bold text-[14px] text-[#1a1a3b] leading-snug group-hover:text-blue-600 transition-colors">
                                {item.title}
                            </h4>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wide">{item.students}</p>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    )
}
