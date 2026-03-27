"use client"

import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { User, GraduationCap, Building2, Calendar, Settings, LayoutGrid, School, UserRound, Bookmark, ChevronRight } from "lucide-react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

import Link from 'next/link'

export default function LeftSection() {
    const menuItems = [
        { label: "My Feed", icon: LayoutGrid, href: "/", color: "text-purple-500" },
        { label: "Universities", icon: School, href: "/universities", color: "text-yellow-500" },
        { label: "Professors", icon: UserRound, href: "/professors", color: "text-primary" },
        { label: "Saved Event", icon: Bookmark, href: "/events/saved", color: "text-green-500" },
        { label: "Settings", icon: Settings, href: "/settings", color: "text-red-500" },
    ]

    return (
        <aside className="w-full space-y-4">
            {/* User Profile Card */}
            <Card className="glass-card border-none rounded-none overflow-hidden hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-0">
                    <div className="h-15 bg-gradient-to-r from-primary/20 to-blue-400/20" />
                    <div className="px-6 -mt-10 flex flex-col items-center text-center">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg ring-2 ring-primary/20">
                                <div className="w-full h-full rounded-full bg-gray-50 flex items-center justify-center overflow-hidden">
                                    <User className="w-15 h-15 text-primary/40" />
                                </div>
                            </div>
                            <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></div>
                        </div>

                        <div className="mt-2">
                            <h2 className="text-lg font-bold text-gray-800">Riya Singh</h2>
                            <p className="text-primary text-xs font-semibold">BCA Student</p>
                        </div>

                        <div className="w-full mt-2 pt-2 border-t border-gray-100 flex flex-col gap-3">
                            <div className="flex items-center gap-3 text-gray-600">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Building2 className="w-4 h-4 text-primary" />
                                </div>
                                <span className="text-xs font-semibold">BBD University</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Calendar className="w-4 h-4 text-primary" />
                                </div>
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">2025 - 2026</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Navigation Menu */}
            <Card className="glass-card border-none rounded-none overflow-hidden hover:shadow-2xl transition-all duration-300">
                <CardContent className=" space-y-0.5">
                    {menuItems.map((item, idx) => (
                        <Link
                            key={idx}
                            href={item.href}
                            className="group flex items-center justify-between p-1 rounded-xl hover:bg-white/50 transition-all duration-300"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-xl bg-secondary shadow-sm ring-1 ring-blue-500 text-gray-500 flex items-center justify-center transition-all duration-300 group-hover:ring-primary/50 group-hover:text-primary group-hover:shadow-[0_0_15px_rgba(var(--primary),0.3)] ${item.color}`}>
                                    <item.icon className="w-4 h-4" />
                                </div>
                                <span className="font-bold text-[12px] text-gray-500 group-hover:text-primary">
                                    {item.label}
                                </span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-300 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-primary" />
                        </Link>
                    ))}
                </CardContent>
            </Card>

        </aside>
    )
}
