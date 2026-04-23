"use client"
import React, { useEffect } from 'react'
import { UniversityProfile } from '@/components/main/university/UniversityProfile'
import { useAppDispatch, useAppSelector } from '@/utils/hook'
import { getUniversityById } from '@/features/university/universityThunk'
import { useParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
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
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
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
