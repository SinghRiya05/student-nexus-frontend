"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { Star, Mail } from "lucide-react"
import Link from 'next/link'

interface ProfessorCardProps {
    id: string | number
    name: string
    title: string
    department: string
    universityName?: string
    tags: string[]
    rating: string | number
    reviews: string | number
    isOnline?: boolean
    image?: string
}

export default function ProfessorCard({
    id,
    name,
    title,
    department,
    universityName,
    tags,
    rating,
    isOnline = false,
    image
}: ProfessorCardProps) {
    const router = useRouter();
    return (
        <div className="bg-white border rounded-3xl p-6  hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center text-center">
            <div className="relative mb-4">
                {image ? (
                    <img src={image} alt={name} className="w-24 h-24 rounded-full object-cover border-4 border-surface-container-low shadow-md" />
                ) : (
                    <div className="w-24 h-24 rounded-full border-4 border-surface-container-low shadow-md bg-slate-200 flex items-center justify-center text-4xl font-bold text-slate-400">
                        {name.charAt(4)}
                    </div>
                )}
                {/* Online Status Badge */}
                <div className={`absolute bottom-1 right-1 w-5 h-5 border-2 border-surface-container-lowest rounded-full ${isOnline ? "bg-green-500" : "bg-slate-300"
                    }`} />
            </div>

            <h3 className="text-lg font-bold text-on-surface">{name}</h3>
            <p className="text-primary text-sm font-medium mb-1">{title}</p>
            <div className="flex flex-col gap-0.5 mb-4">
                <p className="text-on-surface-variant text-xs font-semibold">{department}</p>
                {universityName && (
                    <p className="text-[10px] text-on-surface-variant/70 italic">{universityName}</p>
                )}
            </div>

            {/* Tags/Skills Section */}
            <div className="flex gap-2 flex-wrap justify-center mb-2">
                {tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-surface-container-low text-[10px] font-bold rounded-full text-on-surface-variant">
                        {tag}
                    </span>
                ))}
            </div>



            {/* Action Buttons */}
            <div className="w-full grid grid-cols-2 gap-3 mt-auto">
                <Link href={`/professors/${id}`} className="w-full">
                    <Button variant={"outline"} onClick={() => router.push(`/professors/${id}`)} className="w-full py-2 px-4 rounded-xl  text-on-surface text-xs font-bold hover:bg-surface-container-highest transition-colors">
                        Profile
                    </Button>
                </Link>
                <button className="py-2 px-4 text-white rounded-xl bg-primary  text-xs font-bold shadow-md shadow-primary/10 hover:bg-primary-dim transition-all">
                    Message
                </button>
            </div>
        </div>
    )
}
