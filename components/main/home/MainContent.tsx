"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { Plus, MoveRight, Building2, Terminal, Globe, Landmark, Home, Send } from "lucide-react"
import { UserCard } from "./UserCard"
import { cn } from "@/lib/utils"
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from "@/utils/hook"
import { getStudentsByMatchedCourseAndSameUniversity, getStudentsByMatchedSemesterWithCourseAndSameUniversity } from "@/features/student/studentThunk"
import { useEffect, useState } from "react"
import { getTeachersFromSameUniversity } from '@/features/teacher/teacherThunk'
import { fetchAlumniByMyUniversity } from '@/features/alumni/alumniThunk'

export default function MainContent() {
    const router = useRouter()
    const dispatch = useAppDispatch()

    const { classmates, batchmates, loading: studentLoading } = useAppSelector((state) => state.student);
    const { sameUniversityTeachers, loading: teacherLoading } = useAppSelector((state) => state.teacher);
    const { universityAlumni: alumni, loading: alumniLoading } = useAppSelector((state) => state.alumni);

    useEffect(() => {
        // Only fetch if data is not already present in Redux to prevent unnecessary calls
        if (classmates.length === 0) dispatch(getStudentsByMatchedSemesterWithCourseAndSameUniversity());
        if (batchmates.length === 0) dispatch(getStudentsByMatchedCourseAndSameUniversity());
        if (sameUniversityTeachers.length === 0) dispatch(getTeachersFromSameUniversity());
        if (alumni.length === 0) dispatch(fetchAlumniByMyUniversity());
    }, [dispatch, classmates.length, batchmates.length, sameUniversityTeachers.length, alumni.length]);




    const departments = [
        { name: "IT Department", category: "Academic", students: "1.2k Students", icon: Terminal, bg: "bg-[#6bfde0]/20", text: "text-[#006c5c]" },
        { name: "Social Science", category: "Social", students: "800 Students", icon: Globe, bg: "bg-[#ffa184]/20", text: "text-[#ad3407]" },
        { name: "Political Dept", category: "Political", students: "450 Students", icon: Landmark, bg: "bg-[#b4bdff]/20", text: "text-[#2949ef]" },
        { name: "Home Science", category: "Applied", students: "320 Students", icon: Home, bg: "bg-[#dad6ff]/40", text: "text-[#5d5a86]" },
    ]

    return (
        <div className="flex-1 space-y-10">
            {/* Welcome Hero */}
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold tracking-tight text-[#302e56] mb-2"> Welcome to Student Nexus</h1>
                <p className="text-[#5d5a86]">  Connect, collaborate, and grow with students from your university.</p>
            </div>

            {/* Class Mates */}
            <section>
                <div className="flex items-center justify-between mb-4 px-2">
                    <h2 className="text-xl font-bold">BBD University - Class Mates</h2>
                    <button onClick={() => router.push("/students")} className="text-[#2949ef] text-sm font-semibold hover:underline">Directory</button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                    {classmates.slice(0, 5).map((user: any, idx: number) => (
                        <UserCard
                            key={idx}
                            userId={user._id}
                            name={`${user.firstName} ${user.lastName}`}
                            role={user.courseIds?.length > 0 ? user.courseIds.map((c: any) => c.course_short_name).join(", ") : "Student"}
                            image={user.avatar || user.profilePicture || undefined}
                            variant="primary"
                        />
                    ))}
                    {classmates.length === 0 && (
                        <p className="text-sm text-gray-400 italic py-5">No classmates discovered yet.</p>
                    )}
                </div>
            </section>

            {/* Batch Mates */}
            <section>
                <div className="flex items-center justify-between mb-4 px-2">
                    <h2 className="text-xl font-bold">BBD University - Batch Mates</h2>
                    <button onClick={() => router.push("/students")} className="text-[#2949ef] text-sm font-semibold hover:underline">Directory</button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                    {batchmates.slice(0, 5).map((user: any, idx: number) => (
                        <UserCard
                            key={idx}
                            userId={user._id}
                            name={`${user.firstName} ${user.lastName}`}
                            role={user.courseIds?.length > 0 ? user.courseIds.map((c: any) => c.course_short_name).join(", ") : "Student"}
                            image={user.avatar || user.profilePicture || undefined}
                            variant="secondary"
                        />
                    ))}
                    {batchmates.length === 0 && (
                        <p className="text-sm text-gray-400 italic py-5">No batchmates discovered yet.</p>
                    )}
                </div>
            </section>

            {/* Professors */}
            <section>
                <div className="flex items-center justify-between mb-4 px-2">
                    <h2 className="text-xl font-bold">BBD University - Professors</h2>
                    <button onClick={() => router.push("/professors")} className="text-[#2949ef] text-sm font-semibold hover:underline">Directory</button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x px-2">
                    {sameUniversityTeachers.slice(0, 5).map((prof, idx) => (
                        <div key={idx} onClick={() => router.push(`/professors/${prof._id}`)} className="min-w-[362px] bg-white p-5 rounded-2xl shadow-sm border border-[#b1addd]/10 flex gap-4 snap-start mb-1 hover:shadow-md transition-shadow">
                            {prof.avatar ? (
                                <img className="w-20 h-20 rounded-xl object-cover" src={prof.avatar} alt={`${prof.firstName} ${prof.lastName}`} />
                            ) : (
                                <div className="w-20 h-20 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-2xl border border-indigo-100 uppercase flex-shrink-0">
                                    {prof.firstName?.[0]}
                                </div>
                            )}
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div className="overflow-hidden">
                                        <h4 className="font-bold text-base text-[#302e56] truncate">{prof.firstName} {prof.lastName}</h4>
                                        <div className="flex flex-col">
                                            <p className="text-xs text-[#5d5a86] truncate">{prof.teacherProfile.designation}</p>
                                            <p className="text-[10px] text-[#5d5a86]/70">Exp: {prof.teacherProfile.experienceYears} years</p>
                                        </div>
                                    </div>
                                    <button className="h-7 w-7 rounded-full bg-[#6bfde0] text-[#005f51] flex items-center justify-center hover:scale-105 transition-transform flex-shrink-0">
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="mt-3 text-xs text-gray-500 font-medium">
                                    {prof.courseIds?.length > 0 ? (
                                        <span className="truncate block">
                                            {prof.courseIds.map((c: any) => c.course_short_name).join(", ")}
                                        </span>
                                    ) : (
                                        "Faculty"
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {sameUniversityTeachers.length === 0 && (
                        <p className="text-sm text-gray-400 italic py-5">No professors found.</p>
                    )}
                </div>
            </section>

            {/* Departments */}
            <section>
                <div className="mb-4 px-2">
                    <h2 className="text-xl font-bold">BBD University - Departments</h2>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {departments.map((dept, idx) => (
                        <div key={idx} className={cn("p-4 rounded-3xl border border-black/5 flex flex-col justify-between h-36 relative overflow-hidden", dept.bg)}>
                            <div className="z-10">
                                <p className={cn("text-[10px] uppercase tracking-wider font-bold mb-1", dept.text)}>{dept.category}</p>
                                <h4 className="font-bold text-[#302e56] text-sm">{dept.name}</h4>
                            </div>
                            <div className="flex items-center justify-between z-10">
                                <span className="text-xs font-medium text-[#5d5a86]">{dept.students}</span>
                                <button className="h-6 w-6 rounded-full bg-white flex items-center justify-center shadow-sm">
                                    <Plus className="w-4 h-4 text-[#302e56]" />
                                </button>
                            </div>
                            <dept.icon className={cn("absolute -right-4 -top-4 w-20 h-20 opacity-10 pointer-events-none", dept.text)} />
                        </div>
                    ))}
                </div>
            </section>

            {/* Alumni */}
            <section>
                <div className="flex items-center justify-between mb-4 px-2">
                    <h2 className="text-xl font-bold">BBD University - Alumni</h2>
                    <button onClick={() => router.push("/alumni")} className="text-[#2949ef] text-sm font-semibold hover:underline">Career Network</button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {alumni.slice(0, 5).map((member, idx) => (
                        <div key={idx} onClick={() => router.push(`/alumni/${member._id}`)} className="min-w-[240px] bg-white border border-[#b1addd]/10 p-5 rounded-3xl flex flex-col gap-4 hover:cursor-pointer">
                            <div className="flex items-center gap-4">
                                {member.avatar ? (
                                    <img className="w-12 h-12 rounded-full object-cover" src={member.avatar} alt={member.firstName} />

                                ) : (
                                    <div className="w-20 h-20 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-2xl border border-indigo-100 uppercase flex-shrink-0">
                                        {member.firstName?.[0]}
                                    </div>
                                )

                                }
                                <div>
                                    <h4 className="font-bold text-sm text-[#302e56]">{member.firstName} {member.lastName}</h4>
                                    <p className="text-[10px] text-[#5d5a86]">{member.aluminiProfile?.jobTitle} • {member.aluminiProfile?.currentCompany}</p>
                                </div>
                            </div>
                            <button className="w-full py-2 bg-[#f0ebff] text-[#2949ef] rounded-xl text-xs font-bold hover:bg-[#e3dfff] transition-colors flex items-center justify-center gap-2">
                                <Send className="w-3 h-3" />
                                Send Request
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
