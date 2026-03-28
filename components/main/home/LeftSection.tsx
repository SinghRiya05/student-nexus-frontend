"use client"

import React from 'react'
import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import Link from 'next/link'
import { Rss, School, UserRound, Bookmark, Settings, Calendar } from "lucide-react"

export default function LeftSection() {
    const navLinks = [
        { label: "My Feed", icon: Rss, href: "#", active: true },
        { label: "Universities", icon: School, href: "/university" },
        { label: "Professors", icon: UserRound, href: "#" },
        { label: "Saved Events", icon: Bookmark, href: "#" },
    ]

    return (
        <aside className="flex flex-col gap-2 w-full">
            {/* Profile Info in Sidebar */}
            <div className="p-4 mb-6 bg-white rounded-2xl shadow-sm border border-[#b1addd]/10">
                <div className="flex items-center gap-3 mb-2">
                    <div className="h-14 w-14 rounded-xl overflow-hidden shadow-md">
                        <img
                            className="w-full h-full object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2ouios_lhgXqc2jp7Mq-OcL_Utm9--mcX154rRS0412JQKRZkcX78lXb4rJyYrGQ89EUiBnSKbmjTbTizXd_rLbMDgx_iDfMYqxsAVJCpaaZzIiL2pGubDVFUoOU2IzFNEjdPJ8efhIjopDqX67xS-pGZjdgdBM2kTpG-VYO65j3PRjfdmusUe5V7nY4F83Uxir3MKiO0uXimenU1ScyWKf34s19hoLZ3y6hB5JwAz1_l_YIJxaxr5rKBQR7ExC31lw6gsgcSg2w"
                            alt="Riya Singh"
                        />
                    </div>
                    <div>
                        <h3 className="font-bold text-[#302e56] text-sm">Riya Singh</h3>
                        <p className="text-xs text-[#5d5a86]">BCA Student</p>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[12px] text-[#5d5a86]/80">
                        <School className="w-4 h-4" />
                        BBD University
                    </div>
                    <div className="flex items-center gap-2 text-[12px] text-[#5d5a86]/80">
                        <Calendar className="w-4 h-4" />
                        2025-2026
                    </div>
                </div>
            </div>

            <nav className="space-y-1">
                {navLinks.map((link, idx) => (
                    <Link
                        key={idx}
                        href={link.href}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm",
                            link.active
                                ? "text-[#3D5AFE] bg-white shadow-sm"
                                : "text-[#302e56] opacity-80 hover:bg-[#e3dfff]"
                        )}
                    >
                        <link.icon className="w-5 h-5" />
                        {link.label}
                    </Link>
                ))}

                <div className="pt-4 mt-4 border-t border-[#b1addd]/20">
                    <Link
                        href="#"
                        className="flex items-center gap-3 px-4 py-3 text-[#302e56] opacity-80 hover:bg-[#e3dfff] rounded-xl transition-all font-medium text-sm"
                    >
                        <Settings className="w-5 h-5" />
                        Settings
                    </Link>
                </div>
            </nav>
        </aside>
    )
}
