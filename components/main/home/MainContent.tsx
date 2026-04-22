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

// --- Skeleton Components ---
const UserCardSkeletonPrimary = () => (
    <div className="min-w-[240px] snap-start bg-card p-5 rounded-2xl shadow-sm border border-border/10 flex flex-col items-center text-center animate-pulse">
        <div className="w-16 h-16 rounded-full mb-3 bg-secondary/10 mt-2"></div>
        <div className="h-4 w-24 bg-secondary/10 rounded mb-2"></div>
        <div className="h-3 w-16 bg-secondary/10 rounded mb-4"></div>
        <div className="w-full py-2 h-8 rounded-xl bg-secondary/10 mt-auto"></div>
    </div>
);

const UserCardSkeletonSecondary = () => (
    <div className="min-w-[180px] snap-start bg-secondary/5 p-4 rounded-2xl flex flex-col items-center animate-pulse border border-border/10">
        <div className="w-12 h-12 rounded-full mb-3 bg-secondary/10 mt-2"></div>
        <div className="h-3 w-20 bg-secondary/10 rounded mb-4"></div>
        <div className="h-6 w-20 rounded-full bg-secondary/10"></div>
    </div>
);

const ProfessorSkeleton = () => (
    <div className="min-w-[362px] bg-card p-5 rounded-2xl shadow-sm border border-border/10 flex gap-4 snap-start mb-1 animate-pulse">
        <div className="w-20 h-20 rounded-xl bg-secondary/10 flex-shrink-0"></div>
        <div className="flex-1">
            <div className="flex justify-between items-start">
                <div className="w-full">
                    <div className="h-4 w-32 bg-secondary/10 rounded mb-2"></div>
                    <div className="flex flex-col gap-1.5">
                        <div className="h-3 w-24 bg-secondary/10 rounded"></div>
                        <div className="h-2 w-16 bg-secondary/10 rounded"></div>
                    </div>
                </div>
            </div>
            <div className="mt-4 h-3 w-20 bg-secondary/10 rounded"></div>
        </div>
    </div>
);

const AlumniSkeleton = () => (
    <div className="min-w-[240px] bg-card border border-border/10 p-5 rounded-3xl flex flex-col gap-4 animate-pulse">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex-shrink-0"></div>
            <div className="flex-1">
                <div className="h-4 w-24 bg-secondary/10 rounded mb-1.5"></div>
                <div className="h-3 w-20 bg-secondary/10 rounded"></div>
            </div>
        </div>
        <div className="w-full h-8 rounded-xl bg-secondary/10"></div>
    </div>
);

export default function MainContent() {
    const router = useRouter()
    const dispatch = useAppDispatch()

    const { classmates, batchmates } = useAppSelector((state) => state.student);
    const { sameUniversityTeachers } = useAppSelector((state) => state.teacher);
    const { universityAlumni: alumni } = useAppSelector((state) => state.alumni);

    const [fetching, setFetching] = useState({
        classmates: classmates.length === 0,
        batchmates: batchmates.length === 0,
        teachers: sameUniversityTeachers.length === 0,
        alumni: alumni.length === 0
    });

    useEffect(() => {
        let mounted = true;

        const fetchData = async () => {
            // Classmates
            if (classmates.length === 0) {
                await dispatch(getStudentsByMatchedSemesterWithCourseAndSameUniversity());
            }
            if (mounted) setFetching(prev => ({ ...prev, classmates: false }));

            // Batchmates
            if (batchmates.length === 0) {
                await dispatch(getStudentsByMatchedCourseAndSameUniversity());
            }
            if (mounted) setFetching(prev => ({ ...prev, batchmates: false }));

            // Teachers
            if (sameUniversityTeachers.length === 0) {
                await dispatch(getTeachersFromSameUniversity());
            }
            if (mounted) setFetching(prev => ({ ...prev, teachers: false }));

            // Alumni
            if (alumni.length === 0) {
                await dispatch(fetchAlumniByMyUniversity());
            }
            if (mounted) setFetching(prev => ({ ...prev, alumni: false }));
        };

        fetchData();

        return () => { mounted = false; };
    }, [dispatch]);



    const departments = [
        { name: "IT Department", category: "Academic", students: "1.2k Students", icon: Terminal, bg: "bg-accent/10", text: "text-accent" },
        { name: "Social Science", category: "Social", students: "800 Students", icon: Globe, bg: "bg-secondary/10", text: "text-secondary" },
        { name: "Political Dept", category: "Political", students: "450 Students", icon: Landmark, bg: "bg-primary/10", text: "text-primary" },
        { name: "Home Science", category: "Applied", students: "320 Students", icon: Home, bg: "bg-accent/5", text: "text-accent/70" },
    ]

    return (
        <div className="flex-1 space-y-10">
            {/* Welcome Hero */}
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold tracking-tight text-black mb-2"> Welcome to Student Nexus</h1>
                <p className="text-black">  Connect, collaborate, and grow with students from your university.</p>
            </div>

            {/* Class Mates */}
            <section>
                <div className="flex items-center justify-between mb-4 px-2">
                    <h2 className="text-xl font-bold">BBD University - Class Mates</h2>
                    <button onClick={() => router.push("/students")} className="text-black cursor-pointer text-sm font-semibold hover:underline">Directory</button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                    {fetching.classmates ? (
                        [1, 2, 3, 4, 5].map((i) => <UserCardSkeletonPrimary key={i} />)
                    ) : (
                        <>
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
                                <p className="text-sm px-3 text-gray-400 italic py-5">No classmates discovered yet.</p>
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* Batch Mates */}
            <section>
                <div className="flex items-center justify-between mb-4 px-2">
                    <h2 className="text-xl font-bold">BBD University - Batch Mates</h2>
                    <button onClick={() => router.push("/students")} className="text-black cursor-pointer text-sm font-semibold hover:underline">Directory</button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                    {fetching.batchmates ? (
                        [1, 2, 3, 4, 5].map((i) => <UserCardSkeletonSecondary key={i} />)
                    ) : (
                        <>
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
                                <p className="text-sm px-3 text-gray-400 italic py-5">No batchmates discovered yet.</p>
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* Professors */}
            <section>
                <div className="flex items-center justify-between mb-4 px-2">
                    <h2 className="text-xl font-bold">BBD University - Professors</h2>
                    <button onClick={() => router.push("/professors")} className="text-black cursor-pointer text-sm font-semibold hover:underline">Directory</button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x px-2">
                    {fetching.teachers ? (
                        [1, 2, 3, 4].map((i) => <ProfessorSkeleton key={i} />)
                    ) : (
                        <>
                            {sameUniversityTeachers.slice(0, 5).map((prof, idx) => (
                                <div key={idx} onClick={() => router.push(`/professors/${prof._id}`)} className="min-w-[362px] bg-white p-5 rounded-2xl shadow-sm border border-border/10 flex gap-4 snap-start mb-1 hover:shadow-md transition-shadow">
                                    {prof.avatar ? (
                                        <img className="w-20 h-20 rounded-xl object-cover" src={prof.avatar} alt={`${prof.firstName} ${prof.lastName}`} />
                                    ) : (
                                        <div className="w-20 h-20 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary font-bold text-2xl border border-secondary/20 uppercase flex-shrink-0">
                                            {prof.firstName?.[0]}
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div className="overflow-hidden">
                                                <h4 className="font-bold text-base text-black truncate">{prof.firstName} {prof.lastName}</h4>
                                                <div className="flex flex-col">
                                                    <p className="text-xs text-black/70 truncate">{prof.teacherProfile.designation}</p>
                                                    <p className="text-[10px] text-black/50">Exp: {prof.teacherProfile.experienceYears} years</p>
                                                </div>
                                            </div>
                                            <button className="h-7 w-7 rounded-full cursor-pointer bg-accent text-primary flex items-center justify-center hover:scale-105 transition-transform flex-shrink-0">
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
                        </>
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
                                <h4 className="font-bold text-primary text-sm">{dept.name}</h4>
                            </div>
                            <div className="flex items-center justify-between z-10">
                                <span className="text-xs font-medium text-primary/70">{dept.students}</span>
                                <button className="h-6 w-6 rounded-full bg-white flex items-center justify-center shadow-sm">
                                    <Plus className="w-4 h-4 text-primary" />
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
                    <button onClick={() => router.push("/alumni")} className="text-black text-sm font-semibold hover:underline">Career Network</button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {fetching.alumni ? (
                        [1, 2, 3, 4, 5].map((i) => <AlumniSkeleton key={i} />)
                    ) : (
                        <>
                            {alumni.slice(0, 5).map((member, idx) => (
                                <div key={idx} onClick={() => router.push(`/alumni/${member._id}`)} className="min-w-[240px] bg-white border border-border/10 p-5 rounded-3xl flex flex-col gap-4 cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        {member.avatar ? (
                                            <img className="w-12 h-12 rounded-full object-cover" src={member.avatar} alt={member.firstName} />
                                        ) : (
                                            <div className="w-20 h-20 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary font-bold text-2xl border border-secondary/20 uppercase flex-shrink-0">
                                                {member.firstName?.[0]}
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="font-bold text-sm text-black">{member.firstName} {member.lastName}</h4>
                                            <p className="text-[10px] text-black/70">{member.aluminiProfile?.jobTitle} • {member.aluminiProfile?.currentCompany}</p>
                                        </div>
                                    </div>
                                    <button className="w-full py-2 cursor-pointer bg-secondary/10 text-black rounded-xl text-xs font-bold hover:bg-secondary/30 transition-colors flex items-center justify-center gap-2">
                                        <Send className="w-3 h-3" />
                                        Send Request
                                    </button>
                                </div>
                            ))}
                            {alumni.length === 0 && (
                                <p className="text-sm px-3 text-black/50 italic py-5">No alumni discovered yet.</p>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    )
}
