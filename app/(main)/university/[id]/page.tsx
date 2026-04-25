"use client"
import React, { useEffect } from 'react'
import { UniversityProfile } from '@/components/main/university/UniversityProfile'
import { useAppDispatch, useAppSelector } from '@/utils/hook'
import { getUniversityById } from '@/features/university/universityThunk'
import { useParams } from 'next/navigation'
import { Loader2, Building2 } from 'lucide-react'
import { IUniversity } from '@/features/university/universityModel'

const universityData = {
    name: "University of Lucknow",
    location: "Lucknow, Uttar Pradesh",
    description: "The University of Lucknow is a public state university located in Lucknow, Uttar Pradesh. Founded in 1867, it is one of the oldest government-owned institutions of higher education in India. ",
    bannerImage: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80"
}

export default function UniversityPage() {
    const params = useParams();
    const dispatch = useAppDispatch();
    const { universityLoading, singleUniversity } = useAppSelector((state) => state.university);
    const universityId = params.id as string;
    useEffect(() => {
        if (universityId) {
            dispatch(getUniversityById(universityId));
        }
    }, [dispatch, universityId]);

    if (universityLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 space-y-8 min-h-screen animate-pulse">
                {/* Header Skeleton */}
                <div className="relative h-64 md:h-80 w-full rounded-2xl bg-slate-100 border border-slate-200 overflow-visible mb-16">
                    <div className="absolute -bottom-12 left-8 flex items-end space-x-6">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-slate-200 border-4 border-white shadow-sm shrink-0"></div>
                        <div className="pb-14 space-y-3 w-full">
                            <div className="h-8 w-64 bg-slate-200 rounded-lg"></div>
                            <div className="h-4 w-48 bg-slate-200 rounded-md"></div>
                        </div>
                    </div>
                </div>

                {/* Main Content Skeleton */}
                <div className="flex flex-col lg:flex-row gap-8 items-start pt-8">
                    <div className="flex-1 w-full space-y-8 pb-20">
                        {/* Description Skeleton */}
                        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
                            <div className="h-6 w-48 bg-slate-200 rounded-lg"></div>
                            <div className="space-y-2">
                                <div className="h-4 w-full bg-slate-100 rounded"></div>
                                <div className="h-4 w-full bg-slate-100 rounded"></div>
                                <div className="h-4 w-3/4 bg-slate-100 rounded"></div>
                            </div>
                        </div>

                        {/* Stats Skeleton */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col items-center justify-center space-y-4">
                                    <div className="w-12 h-12 bg-slate-100 rounded-2xl"></div>
                                    <div className="h-8 w-16 bg-slate-200 rounded-lg"></div>
                                    <div className="h-4 w-24 bg-slate-100 rounded-md"></div>
                                </div>
                            ))}
                        </div>

                        {/* Courses Skeleton */}
                        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
                            <div className="h-6 w-48 bg-slate-200 rounded-lg"></div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="h-24 bg-slate-50 rounded-2xl border border-slate-100 flex items-center p-4 gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-slate-200"></div>
                                        <div className="space-y-2 flex-1">
                                            <div className="h-4 w-full bg-slate-200 rounded"></div>
                                            <div className="h-3 w-2/3 bg-slate-100 rounded"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (!singleUniversity && !universityLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
                <div className="w-24 h-24 bg-rose-50 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-rose-100">
                    <Building2 className="w-10 h-10 text-rose-500" />
                </div>
                <h1 className="text-2xl font-black text-slate-800 mb-3 text-center">University Not Found</h1>
                <p className="text-slate-500 text-[15px] font-medium max-w-md text-center leading-relaxed">
                    We couldn't find the university profile you're looking for. It may have been removed or the link might be broken.
                </p>
            </div>
        )
    }

    console.log(singleUniversity)
    return (
        <main className="min-h-screen text-sm">
            <UniversityProfile data={singleUniversity! as IUniversity} />
        </main>
    )
}
