"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Rss,
    School,
    UserRound,
    Bookmark,
    Settings,
    Calendar,
    LogOut,
    Zap,
    ChevronRight,
    MapPin
} from "lucide-react"

export default function LeftSection() {
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
    const pathname = usePathname()

    const navLinks = [
        { id: 1, label: "My Feed", icon: Rss, href: "/" },
        { id: 2, label: "Universities", icon: School, href: "/university" },
        { id: 3, label: "Professors", icon: UserRound, href: "/professors" },
        { id: 4, label: "Saved Events", icon: Bookmark, href: "/saved" },
    ]

    return (
        <aside className="flex flex-col gap-4 w-full max-w-[280px]">
            {/* Premium Profile Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="overflow-hidden rounded-3xl glass-card border-none shadow-2xl shadow-primary/5 group"
            >
                {/* Decorative Header */}
                <div className="h-16 bg-linear-to-br from-primary via-primary/80 to-[#7387ff] relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 grid-overlay" />
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 5, 0]
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute -right-4 -top-4 w-24 h-24 bg-white/20 rounded-full blur-2xl"
                    />
                </div>

                <div className="px-5 pb-5 -mt-8 relative z-10">
                    <div className="flex flex-col items-center text-center">
                        <div className="relative mb-2">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="h-16 w-16 rounded-2xl p-1 bg-white shadow-xl overflow-hidden"
                            >
                                <img
                                    className="w-full h-full object-cover rounded-xl"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2ouios_lhgXqc2jp7Mq-OcL_Utm9--mcX154rRS0412JQKRZkcX78lXb4rJyYrGQ89EUiBnSKbmjTbTizXd_rLbMDgx_iDfMYqxsAVJCpaaZzIiL2pGubDVFUoOU2IzFNEjdPJ8efhIjopDqX67xS-pGZjdgdBM2kTpG-VYO65j3PRjfdmusUe5V7nY4F83Uxir3MKiO0uXimenU1ScyWKf34s19hoLZ3y6hB5JwAz1_l_YIJxaxr5rKBQR7ExC31lw6gsgcSg2w"
                                    alt="Riya Singh"
                                />
                            </motion.div>
                            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
                        </div>

                        <h3 className="font-bold text-[#302e56] text-base leading-tight">Riya Singh</h3>
                        <p className="text-[10px] font-semibold text-primary/70 uppercase tracking-wider mb-3">BCA Student</p>

                        <div className="w-full space-y-1.5 mb-4">
                            <div className="flex items-center gap-2 text-[11px] text-on-surface-variant font-medium">
                                <School className="w-3 h-3 text-primary" />
                                BBD University
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-on-surface-variant font-medium">
                                <MapPin className="w-3 h-3 text-primary" />
                                Lucknow, India
                            </div>
                        </div>

                        {/* Interactive Profile Score */}
                        <div className="w-full p-2.5 rounded-2xl bg-primary/5 border border-primary/10">
                            <div className="flex justify-between items-center mb-1.5">
                                <span className="text-[9px] font-bold text-primary uppercase tracking-tighter">Profile Strength</span>
                                <span className="text-[9px] font-black text-primary">85%</span>
                            </div>
                            <div className="h-1 w-full bg-primary/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "85%" }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="h-full bg-linear-to-r from-primary to-[#7387ff]"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Interactive Navigation */}
            <nav className="flex flex-col gap-0.5">
                {navLinks.map((link, idx) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.id}
                            href={link.href}
                            onMouseEnter={() => setHoveredIdx(idx)}
                            onMouseLeave={() => setHoveredIdx(null)}
                            className={cn(
                                "group relative flex items-center gap-3 px-4 py-2 rounded-2xl transition-all duration-300",
                                isActive
                                    ? "text-primary font-bold bg-white shadow-lg shadow-primary/10 border border-primary/5"
                                    : "text-on-surface-variant hover:text-primary font-medium"
                            )}
                        >
                            {/* Hover Background Link Effect */}
                            {!isActive && hoveredIdx === idx && (
                                <motion.div
                                    layoutId="navHover"
                                    className="absolute inset-0 bg-primary/5 rounded-2xl -z-10"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                />
                            )}

                            <div className={cn(
                                "flex items-center justify-center p-1.5 rounded-xl transition-all duration-300",
                                isActive ? "bg-primary text-white scale-105 shadow-md shadow-primary/20" : "bg-transparent group-hover:bg-primary/10"
                            )}>
                                <link.icon className="w-4 h-4" />
                            </div>

                            <span className="text-[12px] tracking-tight">{link.label}</span>

                            {isActive && (
                                <motion.div
                                    layoutId="activeIndicator"
                                    className="ml-auto"
                                    initial={{ x: -5, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                </motion.div>
                            )}
                        </Link>
                    )
                })}

                <div className="mt-2 pt-2 border-t border-outline-variant/30 flex flex-col gap-0.5">
                    <Link
                        href="#"
                        className="group flex items-center gap-3 px-4 py-2 rounded-2xl text-on-surface-variant hover:text-primary font-medium transition-all"
                    >
                        <div className="p-1.5 rounded-xl group-hover:bg-primary/10 transition-colors">
                            <Settings className="w-4 h-4 group-hover:rotate-45 transition-transform duration-500" />
                        </div>
                        <span className="text-[12px]">Settings</span>
                    </Link>

                    <button
                        className="group flex items-center gap-3 px-4 py-2 rounded-2xl text-rose-500 hover:bg-rose-50 font-medium transition-all text-left"
                    >
                        <div className="p-1.5 rounded-xl group-hover:bg-rose-100 transition-colors">
                            <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        </div>
                        <span className="text-[12px]">Logout</span>
                    </button>
                </div>
            </nav>
        </aside>
    )
}
