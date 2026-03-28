"use client"

import React from 'react'
import { MapPin } from "lucide-react"

interface UniversityCardProps {
    name: string
    location: string
    students: string
    type: string
    image: string
}

export default function UniversityCard({ name, location, students, type, image }: UniversityCardProps) {
    return (
        <div className="relative h-[420px] rounded-2xl overflow-hidden group border-2 border-orange-500/10 shadow-lg cursor-pointer">
            <img
                src={image}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                alt={name}
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#1a1a3b] via-[#1a1a3b]/20 to-transparent flex flex-col justify-end p-8 text-center items-center">
                {/* Logo removed as requested */}

                <h4 className="text-xl font-black text-white mb-1 leading-tight drop-shadow-md group-hover:text-orange-400 transition-colors uppercase">{name}</h4>
                <div className="flex items-center justify-center gap-1 text-xs text-green-400 font-bold mb-6 drop-shadow-md">
                    <MapPin className="w-3 h-3" />
                    {location}
                </div>

                <div className="grid grid-cols-2 w-full gap-4 pt-4 border-t border-white/20 mb-6">
                    <div className="text-left">
                        <span className="text-[10px] font-black text-white/60 uppercase block">Students</span>
                        <span className="text-white font-black text-[13px]">{students}</span>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] font-black text-white/60 uppercase block">Type</span>
                        <span className="text-green-400 font-black text-[13px]">{type}</span>
                    </div>
                </div>

                <button className="w-full py-4 rounded-2xl bg-white/10 backdrop-blur-md text-white text-sm font-black border border-white/20 hover:bg-white hover:text-[#1a1a3b] transition-all">
                    View Details
                </button>
            </div>
        </div>
    )
}
