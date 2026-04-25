"use client"

import React from 'react'
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Users, ChevronRight, Building2, Globe, GraduationCap } from "lucide-react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import { ASSET_URL } from "@/services/apiEndpoints"

interface UniversityCardProps {
    variant?: "featured" | "grid"
    university: {
        name: string
        shortName?: string
        location: string
        students: string | number
        type: string
        domain?: string
        image?: string
        logo?: string
        id: string
    }
}

// Shared logo component — handles ASSET_URL prefix, broken images, and fallback initials
const UniversityLogo = ({ logo, name, size = "md" }: { logo?: string; name: string; size?: "sm" | "md" | "lg" }) => {
    const [imgError, setImgError] = React.useState(false);

    const sizeMap = {
        sm: "w-12 h-12 text-sm",
        md: "w-16 h-16 text-base",
        lg: "w-20 h-20 text-xl",
    };

    const logoUrl = logo
        ? logo.startsWith("http") ? logo : `${ASSET_URL}${logo}`
        : null;

    if (logoUrl && !imgError) {
        return (
            <img
                src={logoUrl}
                alt={`${name} logo`}
                className={cn("rounded-xl object-contain bg-white p-1", sizeMap[size])}
                onError={() => setImgError(true)}
            />
        );
    }

    // Fallback: initials
    const initials = name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase();

    return (
        <div className={cn(
            "rounded-xl bg-white flex items-center justify-center font-black text-primary border border-slate-100",
            sizeMap[size]
        )}>
            {initials || <Building2 className="w-5 h-5 text-primary/40" />}
        </div>
    );
};

const UniversityCard = ({ variant = "grid", university }: UniversityCardProps) => {
    if (variant === "featured") {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className="group relative"
            >
                <Card className="glass-card relative border-none rounded-2xl overflow-hidden shadow-2xl p-0">
                    <CardContent className="p-0 flex flex-col md:flex-row">
                        <div className="w-full md:w-2/5 h-64 md:h-auto relative overflow-hidden bg-slate-100">
                            {university.image ? (
                                <img
                                    src={university.image.startsWith("http") ? university.image : `${ASSET_URL}${university.image}`}
                                    className="w-full h-full object-cover"
                                    alt={university.name}
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
                                    <Building2 className="w-20 h-20 text-primary/10" />
                                </div>
                            )}
                            {/* Logo overlay */}
                            <div className="absolute top-4 left-4 p-2 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/60">
                                <UniversityLogo logo={university.logo} name={university.name} size="md" />
                            </div>
                        </div>

                        <div className="w-full md:w-3/5 p-8 flex flex-col justify-between">
                            <div className="space-y-4">
                                {university.shortName && (
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary/60 bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                                        {university.shortName}
                                    </span>
                                )}
                                <h3 className="text-2xl md:text-3xl font-extrabold text-slate-800 leading-tight group-hover:text-primary transition-colors">
                                    {university.name}
                                </h3>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                                        <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                                        {university.location}
                                    </div>
                                    {university.domain && (
                                        <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                                            <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                                            {university.domain}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                                        <Users className="w-4 h-4 text-slate-400 shrink-0" />
                                        {university.students} Students
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between border-t border-slate-100 pt-6 mt-6">
                                <span className="text-[11px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
                                    {university.type}
                                </span>
                                <Link
                                    href={`/university/${university.id}`}
                                    className="h-11 px-5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 transition-all gap-2 flex items-center text-sm"
                                >
                                    View Details <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -4 }}
            className="group"
        >
            <Card className="glass-card border border-slate-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 p-0 bg-white">
                <CardContent className="p-0">
                    {/* Top image banner */}
                    <div className="h-32 relative overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/10">
                        {university.image ? (
                            <>
                                <img
                                    src={university.image.startsWith("http") ? university.image : `${ASSET_URL}${university.image}`}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 "
                                    alt={university.name}
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
                            </>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center opacity-10">
                                <GraduationCap className="w-16 h-16 text-primary" />
                            </div>
                        )}
                    </div>

                    {/* Logo — pulled up from banner */}
                    <div className="px-5 -mt-8 mb-3 relative z-10">
                        <div className="w-16 h-16 rounded-xl bg-white shadow-lg border border-slate-100 flex items-center justify-center overflow-hidden p-1">
                            <UniversityLogo logo={university.logo} name={university.name} size="md" />
                        </div>
                    </div>

                    {/* Info */}
                    <div className="px-5 pb-5">
                        {university.shortName && (
                            <span className="text-[9px] font-black uppercase tracking-widest text-primary/50 mb-1 block">
                                {university.shortName}
                            </span>
                        )}
                        <h4 className="text-[15px] font-extrabold text-slate-800 leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {university.name}
                        </h4>

                        <div className="flex flex-col gap-1.5 mb-4">
                            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                                <MapPin className="w-3.5 h-3.5 shrink-0" />
                                <span className="truncate">{university.location}</span>
                            </div>
                            {university.domain && (
                                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                                    <Globe className="w-3.5 h-3.5 shrink-0" />
                                    <span className="truncate">{university.domain}</span>
                                </div>
                            )}
                        </div>

                        {/* Stats strip — compact inline row */}
                        <div className="flex items-center gap-2 mb-4 py-2 border-y border-slate-100">
                            <div className="flex items-center gap-1 text-slate-500">
                                <Users className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="text-[11px] font-extrabold text-slate-700">{university.students}</span>
                                <span className="text-[10px] font-semibold text-slate-400">students</span>
                            </div>
                            <span className="text-slate-200 select-none">•</span>
                            <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 truncate">
                                {university.type}
                            </span>
                        </div>

                        <Link
                            href={`/university/${university.id}`}
                            className="flex items-center justify-center w-full h-10 rounded-xl border-2 border-slate-100 text-slate-600 font-bold text-sm hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                        >
                            View Details
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}

export default UniversityCard