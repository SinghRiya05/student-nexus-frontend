"use client"

import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { User, GraduationCap, Building2, Calendar, Settings, LayoutGrid, School, UserRound, Bookmark, ChevronRight } from "lucide-react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

import Link from 'next/link'

export default function LeftSection() {
    const menuItems = [
        { label: "My Feed", icon: LayoutGrid, href: "/", color: "text-purple-500", bg: "bg-purple-500/10" },
        { label: "Universities", icon: School, href: "/universities", color: "text-amber-500", bg: "bg-amber-500/10" },
        { label: "Professors", icon: UserRound, href: "/professors", color: "text-primary", bg: "bg-primary/10" },
        { label: "Saved Event", icon: Bookmark, href: "/events/saved", color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Settings", icon: Settings, href: "/settings", color: "text-rose-500", bg: "bg-rose-500/10" },
    ]

    return (
        <aside className="w-full space-y-6">
            {/* User Profile Card */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="glass-card border-none rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 group">
                    <CardContent className="p-0">
                        {/* Premium Gradient Header */}
                        <div className="h-24 bg-gradient-to-br from-primary via-primary/80 to-primary/40 relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                        </div>
                        
                        <div className="px-6 -mt-12 flex flex-col items-center text-center pb-6">
                            <div className="relative">
                                <motion.div 
                                    whileHover={{ scale: 1.05 }}
                                    className="w-24 h-24 rounded-3xl bg-white p-1.5 shadow-2xl ring-4 ring-white/50 backdrop-blur-sm"
                                >
                                    <div className="w-full h-full rounded-2xl bg-gray-50 flex items-center justify-center overflow-hidden">
                                        <img
                                            src="/user.jpg"
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </motion.div>
                                <motion.div 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    delay={0.5}
                                    className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full shadow-lg"
                                />
                            </div>

                            <div className="mt-4">
                                <h2 className="text-xl font-black text-gray-900 tracking-tight">Riya Singh</h2>
                                <p className="text-primary font-bold text-sm tracking-wide mt-0.5">BCA Student</p>
                            </div>

                            <div className="w-full mt-6 pt-6 border-t border-gray-100/50 flex flex-col gap-4">
                                <div className="flex items-center gap-4 group/item">
                                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover/item:bg-primary group-hover/item:text-white transition-all duration-300">
                                        <Building2 className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">University</p>
                                        <p className="text-sm font-bold text-gray-700">BBD University</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 group/item">
                                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover/item:bg-primary group-hover/item:text-white transition-all duration-300">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Session</p>
                                        <p className="text-sm font-bold text-gray-700 tracking-tight">2025 - 2026</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Navigation Menu */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <Card className="glass-card border-none rounded-3xl overflow-hidden p-3 shadow-xl">
                    <div className="px-3 py-2">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Main Menu</p>
                        <div className="space-y-1">
                            {menuItems.map((item, idx) => (
                                <Link
                                    key={idx}
                                    href={item.href}
                                    className="group flex items-center justify-between p-2 rounded-2xl transition-all duration-300 hover:bg-white/80 hover:shadow-md active:scale-95"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:shadow-lg",
                                            item.bg,
                                            item.color,
                                            "group-hover:scale-110"
                                        )}>
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <span className="font-bold text-sm text-gray-500 group-hover:text-gray-900 transition-colors">
                                            {item.label}
                                        </span>
                                    </div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-all duration-300 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Quick Stats or Promo */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-primary rounded-3xl p-6 text-white text-center relative overflow-hidden group cursor-pointer"
            >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                    <GraduationCap className="w-16 h-16" />
                </div>
                <h3 className="font-black text-lg leading-tight relative z-10">Premium Member</h3>
                <p className="text-white/70 text-xs mt-2 relative z-10 leading-relaxed">Unlock all exclusive features and university insights.</p>
                <button className="mt-4 w-full bg-white text-primary font-black py-2.5 rounded-2xl text-xs hover:bg-opacity-90 transition-all active:scale-95 shadow-lg">
                    Upgrade Now
                </button>
            </motion.div>
        </aside>
    )
}
