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
}

export const UserCard = ({ name, role, isWide = false, info = "" }: UserCardProps) => (
    <motion.div
        whileHover={{ y: -5 }}
        className={cn(
            "snap-start shrink-0 glass-card p-5  flex flex-col items-center text-center gap-3 transition-all hover:shadow-xl",
            isWide ? "w-64" : "w-48"
        )}
    >
        <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center ring-2 ring-primary/10">
                <User className="w-8 h-8 text-primary/40" />
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
            <Button variant="outline" size="sm" className="w-full rounded-xl border-primary/20 text-primary hover:bg-primary hover:text-white transition-all">
                Follow
            </Button>
        )}
    </motion.div>
)

export default UserCard
