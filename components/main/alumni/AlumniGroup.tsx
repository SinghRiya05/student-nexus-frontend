"use client"
import React from 'react'
import AlumniCard from './AlumniCard'
import { IAlumni } from '@/features/alumni/alumniModel'
import { ChevronRight, LayoutGrid } from 'lucide-react'
import { motion } from 'framer-motion'

interface AlumniGroupProps {
    title: string
    alumni: IAlumni[]
    icon?: React.ReactNode
}

export default function AlumniGroup({ title, alumni, icon }: AlumniGroupProps) {
    if (!alumni || alumni.length === 0) return null;

    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white border border-[#b1addd]/15 flex items-center justify-center shadow-sm">
                        {icon || <LayoutGrid className="w-5 h-5 text-[#2949ef]" />}
                    </div>
                    <div>
                        <h2 className="text-xl font-extrabold text-[#302e56]">{title}</h2>
                        <p className="text-xs text-[#5d5a86] font-medium">{alumni.length} {alumni.length === 1 ? 'Alumni' : 'Alumni'} Found</p>
                    </div>
                </div>
                <button className="flex items-center gap-2 text-[#2949ef] text-sm font-bold hover:gap-3 transition-all">
                    View All <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {alumni.map((member) => (
                    <AlumniCard key={member._id} member={member} />
                ))}
            </div>
        </section>
    )
}
