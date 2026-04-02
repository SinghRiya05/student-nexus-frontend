import React from 'react'
import { UniversityProfile } from '@/components/university'

const universityData = {
    name: "University of Lucknow",
    location: "Lucknow, Uttar Pradesh",
    description: "The University of Lucknow is a public state university located in Lucknow, Uttar Pradesh. Founded in 1867, it is one of the oldest government-owned institutions of higher education in India. ",
    bannerImage: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80"
}

export default function UniversityPage({ params }: { params: { id: string } }) {
    return (
        <main className="min-h-screen text-sm">
            <UniversityProfile data={universityData} />
        </main>
    )
}
