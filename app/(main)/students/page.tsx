import React from 'react'
import Studentlist from '@/components/main/students/Studentlist'

export default function page() {
    return (
        <div className="flex w-full max-w-[1400px] mx-auto  min-h-screen">
            {/* Main Listing Area */}
            <div className="flex-1 w-full relative">
                <Studentlist />
            </div>
        </div>
    )
}
