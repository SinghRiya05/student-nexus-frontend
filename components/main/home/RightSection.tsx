"use client"

import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Users, TrendingUp, Hash } from "lucide-react"

export default function RightSection() {
    const events = [
        { title: "Cricket Match", desc: "Inter-college finals against Delhi University", date: "Oct 12", time: "2:00 PM", dept: "Sports Dept" },
        { title: "IT Competition", desc: "Annual Web Development Hackathon", date: "Oct 15", time: "10:00 AM", dept: "CS Dept" },
        { title: "Quiz Competition", desc: "General Knowledge and Tech Trivia", date: "Oct 18", time: "4:00 PM", dept: "Literature" },
    ]

    const groups = [
        { name: "Code Wizards", members: "450 Members" },
        { name: "Design Enthusiasts", members: "320 Members" },
        { name: "Research Hub", members: "210 Members" },
    ]

    const trending = ["#AIAdoption", "#GalgotiaUniversity", "#SumitKumar", "#BBDUniversity", "#NexusEvents"]

    return (
        <Card className="glass-card overflow-hidden rounded-none sticky top-10">
            <CardContent className="space-y-4 px-4 pb-5">
                {/* Upcoming Events */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary" />
                            Upcoming Events
                        </h3>
                    </div>
                    <div className="space-y-1">
                        {events.map((event, idx) => (
                            <div key={idx} className="p-2 px-4  bg-white/90 border border-white hover:underline transition-all cursor-pointer group lg:flex-col lg:gap-1 flex justify-between">
                                <h4 className="font-bold text-sm text-gray-900 group-hover:text-primary transition-colors">{event.title}</h4>


                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase">{event.dept}</span>
                                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-500">
                                        <span>{event.date}</span>
                                        <span className="text-gray-300">•</span>
                                        <span>{event.time}</span>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Discover Groups */}
                <div className="space-y-4 pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                            <Users className="w-4 h-4 text-blue-500" />
                            Discover Groups
                        </h3>
                    </div>
                    <div className="space-y-2">
                        {groups.map((group, idx) => (
                            <div key={idx} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 font-bold group-hover:bg-blue-500 group-hover:text-white transition-all">
                                        {group.name[0]}
                                    </div>
                                    <div className="text-left">
                                        <h4 className="text-xs font-bold text-gray-900">{group.name}</h4>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-tighter">{group.members}</p>
                                    </div>
                                </div>
                                <button className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50 transition-all">
                                    <PlusIcon className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                        <Button className="w-full rounded-2xl bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/20 py-4 text-xs font-bold">
                            Join Community
                        </Button>
                    </div>
                </div>

                {/* Trending Globally */}
                <div className="space-y-2 pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-primary" />
                            Trending
                        </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {trending.map((tag) => (
                            <button key={tag} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white shadow-sm ring-1 ring-gray-100 hover:ring-primary/50 hover:bg-primary/5 transition-all text-xs font-bold text-gray-600 hover:text-primary">
                                <Hash className="w-3 h-3 text-gray-300 group-hover:text-primary" />
                                {tag.replace('#', '')}
                            </button>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    )
}
