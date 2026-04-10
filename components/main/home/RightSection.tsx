"use client"

import React from 'react'
import { Hash, Code, LayoutGrid, Layers, Send, Calendar as CalendarIcon, Users } from "lucide-react"
import { cn } from "@/lib/utils"

export default function RightSection() {
    const events = [
        { title: "Cricket Match", date: "12", month: "SEP", time: "2:00 PM", location: "Sports Ground", color: "primary" },
        { title: "IT Competition", date: "15", month: "SEP", time: "10:00 AM", location: "Lab 4", color: "secondary" },
        { title: "Quiz Competition", date: "18", month: "SEP", time: "1:30 PM", location: "Main Hall", color: "tertiary" },
    ]

    const groups = [
        { name: "Web Development", members: "2.4k Members", icon: Code, color: "text-[#2949ef]" },
        { name: "DSA Experts", members: "1.8k Members", icon: Users, color: "text-[#006c5c]" },
        { name: "System Design", members: "950 Members", icon: Layers, color: "text-[#ad3407]" },
    ]

    const trending = [
        { tag: "#AIAdoption", posts: "24.5k posts" },
        { tag: "#GalgotiaUniversity", posts: "12.2k posts" },
        { tag: "#GalgotiaKutta", posts: "8.9k posts" },
        { tag: "#SumitKumar", posts: "5.4k posts" },
    ]

    return (
        <aside className="w-full space-y-6">
            {/* Upcoming Events */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#b1addd]/10">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-[#302e56] font-headline">Upcoming Events</h3>
                    <CalendarIcon className="text-[#5d5a86] w-5 h-5" />
                </div>
                <div className="space-y-4">
                    {events.map((event, idx) => (
                        <div key={idx} className="group cursor-pointer">
                            <div className="flex gap-4">
                                <div className={cn(
                                    "h-10 w-10 min-w-[40px] rounded-xl flex flex-col items-center justify-center",
                                    event.color === 'primary' ? "bg-[#2949ef]/10 text-[#2949ef]" :
                                    event.color === 'secondary' ? "bg-[#006c5c]/10 text-[#006c5c]" :
                                    "bg-[#ad3407]/10 text-[#ad3407]"
                                )}>
                                    <span className="text-[10px] font-bold">{event.month}</span>
                                    <span className="text-sm font-black">{event.date}</span>
                                </div>
                                <div>
                                    <h5 className={cn(
                                        "text-xs font-bold transition-colors",
                                        event.color === 'primary' ? "group-hover:text-[#2949ef]" :
                                        event.color === 'secondary' ? "group-hover:text-[#006c5c]" :
                                        "group-hover:text-[#ad3407]"
                                    )}>{event.title}</h5>
                                    <p className="text-[10px] text-[#5d5a86]">{event.location} • {event.time}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Discover Groups */}
            <div className="bg-[#f6f2ff] rounded-3xl p-6 border border-[#b1addd]/5">
                <h3 className="font-bold text-[#302e56] font-headline mb-4">Discover Groups</h3>
                <div className="space-y-4">
                    {groups.map((group, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center">
                                    <group.icon className={cn("w-4 h-4", group.color)} />
                                </div>
                                <div>
                                    <h5 className="text-xs font-bold">{group.name}</h5>
                                    <p className="text-[9px] text-[#5d5a86]">{group.members}</p>
                                </div>
                            </div>
                            <button className="text-[10px] font-bold text-[#2949ef] px-3 py-1 rounded-full border border-[#2949ef]/20 hover:bg-[#2949ef] hover:text-white transition-colors">Join</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Trending Globally */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#b1addd]/10">
                <h3 className="font-bold text-[#302e56] font-headline mb-4">Trending Globally</h3>
                <div className="space-y-3">
                    {trending.map((item, idx) => (
                        <a key={idx} className="block group" href="#">
                            <p className="text-xs font-bold group-hover:text-[#2949ef] transition-colors">{item.tag}</p>
                            <p className="text-[9px] text-[#5d5a86]">{item.posts}</p>
                        </a>
                    ))}
                </div>
            </div>
        </aside>
    )
}
