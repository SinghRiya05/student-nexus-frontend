"use client"

import React, { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Search, MapPin, Users, Award, ArrowRight, Loader2 } from "lucide-react"
import UniversitySidebar from "./UniversityRightSidebar"
import UniversityCard from "./UniversityCard"
import { useRouter } from 'next/navigation'
import { motion } from "motion/react"
import UniversitySearch from "./UniversitySearch"
import { useAppDispatch, useAppSelector } from "@/utils/hook"
import { getAllUniversities } from "@/features/university/universityThunk"
import { getMe } from "@/features/users/userThunk"

export default function University() {

    const dispatch = useAppDispatch();
    const router = useRouter();

    const { universities, universityLoading } = useAppSelector((state) => state.university);
    const { singleUser: user } = useAppSelector((state) => state.user);
    const { user: authUser } = useAppSelector((state) => state.auth);

    const userUniversityId = typeof user?.universityId === 'object' ? user?.universityId?._id : user?.universityId;
    const safeUniversities = Array.isArray(universities) ? universities : [];

    useEffect(() => {
        if (safeUniversities.length === 0 && !universityLoading) {
            dispatch(getAllUniversities());
        }
        if (!user && authUser?._id) {
            dispatch(getMe());
        }
    }, [dispatch, safeUniversities.length, user, authUser?._id, universityLoading]);

    const featuredUniData = safeUniversities.find((u: any) => u._id === userUniversityId) || safeUniversities[0];

    const mapUniversityToCard = (uni: any) => {
        if (!uni) return null;
        return {
            id: uni._id,
            name: uni.name || "Unknown University",
            location: `${uni.city?.name || uni.city || 'Unknown City'}, ${uni.state?.name || uni.state || 'Unknown State'}`.trim(),
            students: uni.userCount || 0,
            type: uni.universityType || "Verified",
            image: uni.image,
            logo: uni.logo,
            color: "bg-secondary/10"
        }
    };

    const remainingUniversities = safeUniversities.filter((u: any) => u._id !== featuredUniData?._id);
    console.log(remainingUniversities)

    return (
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-10">
            {/* Main Content (Left 70%) */}
            <div className="lg:col-span-7 space-y-12">

                {/* 1. Header Section */}
                <section className="space-y-6">
                    <div>
                        <span className="text-black font-bold text-sm mb-1 block">Institutional Directory</span>
                        <h1 className="text-[44px] font-black  leading-tight mb-4">Universities</h1>
                        <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-2xl">
                            The Universities Directory is a structured list of verified institutions that helps users find and connect with students, seniors, and alumni within specific universities, enabling trusted academic networking.
                        </p>
                    </div>

                    {/* Search & Filters */}
                    <UniversitySearch />
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h5 className="text-[15px] font-black uppercase tracking-widest text-slate-800">Top Universities</h5>
                        </div>
                    </div>
                </section>

                {/* 2. Featured Institution Card (Full Overlay) */}
                {universityLoading && safeUniversities.length === 0 ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <span className="ml-3 text-sm font-medium text-slate-500 animate-pulse">Loading institutions...</span>
                    </div>
                ) : (
                    <>
                        {featuredUniData && (
                            <section className="relative h-[400px] rounded-2xl overflow-hidden border-2 border-primary/10 shadow-2xl group cursor-pointer">
                                <img
                                    src={"http://localhost:5000/" + featuredUniData.image || "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80"}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    alt="Featured University"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent p-10 flex flex-col justify-end">
                                    <div className="space-y-6">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                                            <div className="space-y-4">
                                                <h2 className="text-[35px] font-black text-white leading-tight drop-shadow-lg">{featuredUniData.name?.toUpperCase()}</h2>
                                                <div className="flex flex-wrap items-center gap-8 text-[14px] text-white/90 font-bold">
                                                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                                                        <MapPin className="w-4 h-4 text-orange-400" />
                                                        {`${featuredUniData.city?.name || featuredUniData.city || 'Unknown City'}, ${featuredUniData.state?.name || featuredUniData.state || 'Unknown State'}`.trim()}
                                                    </div>
                                                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                                                        <Users className="w-4 h-4 text-orange-400" />
                                                        {featuredUniData.userCount || 0} Students
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center p-2 shadow-2xl overflow-hidden">
                                                {featuredUniData.logo ? (
                                                    <img src={featuredUniData.logo} alt="Logo" className="w-full h-full object-contain bg-white rounded-xl" />
                                                ) : (
                                                    <div className="w-full h-full bg-white rounded-xl flex items-center justify-center font-black text-xs text-primary">
                                                        {featuredUniData.name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="h-px bg-white/20 w-full" />

                                        <div className="flex justify-between items-center">
                                            <button onClick={() => { router.push(`/university/${featuredUniData._id}`) }} className="px-6 py-3 rounded-xl bg-secondary cursor-pointer text-white font-black text-sm flex items-center gap-3 hover:bg-secondary/90 hover:translate-x-2 transition-all shadow-xl shadow-secondary/20">
                                                View Details
                                                <ArrowRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* 3. Explore Universities (Grid Overlay) */}
                        <section className="space-y-8">
                            <h2 className="text-[30px] font-black text-black">Explore Universities</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {remainingUniversities.map((uni: any, idx: number) => (
                                    <motion.div
                                        key={uni._id || idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 * idx }}
                                    >
                                        <UniversityCard university={mapUniversityToCard(uni)!} />
                                    </motion.div>
                                ))}
                            </div>

                            {remainingUniversities.length === 0 && (
                                <div className="text-center py-10 text-slate-500 font-medium">
                                    No other universities found.
                                </div>
                            )}

                            {remainingUniversities.length > 0 && (
                                <div className="pt-8 flex justify-center">
                                    <button className="group px-8 py-4 rounded-2xl bg-card border-2 border-border text-primary/50 font-bold hover:bg-background hover:border-secondary/20 hover:text-secondary transition-all flex items-center gap-3">
                                        Load More Institutions
                                        <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all">
                                            <ArrowRight className="w-3 h-3" />
                                        </div>
                                    </button>
                                </div>
                            )}
                        </section>
                    </>
                )}
            </div>

            {/* Sidebar (Right 30% on lg, Bottom on others) */}
            <div className="lg:col-span-3 sticky top-12 h-fit">
                <UniversitySidebar />
            </div>
        </div>
    )
}
