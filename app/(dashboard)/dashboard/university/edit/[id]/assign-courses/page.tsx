"use client"

import AssignCourses from '@/components/dashboard/university/AssignCourses'
import { useParams } from 'next/navigation'

export default function Page() {
    const params = useParams()
    return (
        <div className="bg-linear-to-tr from-slate-50/30 to-slate-100/30 min-h-screen">
            <AssignCourses universityId={params.id as string} />
        </div>
    )
}
