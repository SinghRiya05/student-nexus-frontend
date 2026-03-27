"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { User, Plus, Star } from "lucide-react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

interface UserCardProps {
    name: string;
    role: string;
    isWide?: boolean;
    info?: string;
    image?: string;
}

export const UserCard = ({ name, role, isWide = false, info = "", image = "/user.jpg" }: UserCardProps) => (
    <motion.div
        whileHover={{ y: -5 }}
        className={cn(
            "w-full h-full glass-card p-5 rounded-2xl flex flex-col items-center text-center gap-3 transition-all hover:shadow-xl",
            isWide ? "" : ""
        )}
    >
        <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center ring-2 ring-primary/10 overflow-hidden">
                <img 
                    src={image} 
                    alt={name} 
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full border-4 border-white flex items-center justify-center">
                <Star className="w-3 h-3 text-white fill-white" />
            </div>
        </div>
        <div>
            <h4 className="font-bold text-gray-900">{name}</h4>
            <p className="text-xs font-semibold text-primary/80 uppercase tracking-wider">{role}</p>
            {info && <p className="text-xs text-gray-400 mt-1">{info}</p>}
        </div>
        {isWide ? (
            <Button size="sm" className="w-full rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                <Plus className="w-4 h-4 mr-1" /> Follow
            </Button>
        ) : (
            <Button size="sm" className="w-full rounded-xl border-primary/20 hover:bg-primary text-white transition-all">
                Follow
            </Button>
        )}
    </motion.div>
)

export default UserCard
