"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

interface UserCardProps {
    name: string;
    role: string;
    variant?: 'primary' | 'secondary';
    image?: string;
    className?: string;
}

export const UserCard = ({
    name,
    role,
    variant = 'primary',
    image = "/user.jpg",
    className
}: UserCardProps) => {
    if (variant === 'secondary') {
        return (
            <motion.div
                whileHover={{ y: -5 }}
                className={cn(
                    "min-w-[180px] snap-start bg-[#f0eaff] p-4 rounded-2xl flex flex-col items-center",
                    className
                )}
            >
                <div className="w-12 h-12 rounded-full mb-2 overflow-hidden bg-gray-100">
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover"
                    />
                </div>
                <span className="text-xs font-bold mb-3 text-[#302e56]">{name}</span>
                <button className="px-4 py-1.5 bg-white text-[#2949ef] border border-[#2949ef]/20 rounded-full text-[10px] font-bold hover:bg-[#2949ef] hover:text-white transition-all">
                    Follow
                </button>
            </motion.div>
        )
    }

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={cn(
                "min-w-[240px] snap-start bg-white p-5 rounded-2xl shadow-sm border border-[#b1addd]/10 hover:shadow-md transition-shadow flex flex-col items-center text-center",
                className
            )}
        >
            <div className="w-16 h-16 rounded-full mb-3 overflow-hidden bg-gray-100 border-2 border-[#f0ebff]">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover"
                />
            </div>
            <h4 className="font-bold text-[#302e56]">{name}</h4>
            <p className="text-xs text-[#5d5a86] mb-4">{role}</p>
            <button className="w-full bg-[#2949ef] text-white py-2 rounded-xl text-xs font-bold hover:bg-[#1339e3] transition-colors">
                Follow
            </button>
        </motion.div>
    )
}

export default UserCard
