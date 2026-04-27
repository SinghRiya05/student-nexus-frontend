"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { Plus, MoveRight, Building2, Terminal, Globe, Landmark, Home, Send, LogOut } from "lucide-react"
import { UserCard } from "./UserCard"
import { cn } from "@/lib/utils"
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from "@/utils/hook"
import { getStudentsByMatchedCourseAndSameUniversity, getStudentsByMatchedSemesterWithCourseAndSameUniversity } from "@/features/student/studentThunk"
import { useEffect, useState } from "react"
import { getTeachersFromSameUniversity } from '@/features/teacher/teacherThunk'
import { fetchAlumniByMyUniversity } from '@/features/alumni/alumniThunk'
import { getFollowing, getSentRequests } from '@/features/follow/followThunk'
import { emitFollowUser, emitUnfollowUser } from '@/services/socket'
import toast from 'react-hot-toast'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

// --- Skeleton Components ---
const UserCardSkeletonPrimary = () => (
    <div className="min-w-[200px] sm:min-w-[240px] snap-start bg-card p-5 rounded-2xl shadow-sm border border-border/10 flex flex-col items-center text-center animate-pulse">
        <div className="w-16 h-16 rounded-full mb-3 bg-secondary/10 mt-2"></div>
        <div className="h-4 w-24 bg-secondary/10 rounded mb-2"></div>
        <div className="h-3 w-16 bg-secondary/10 rounded mb-4"></div>
        <div className="w-full py-2 h-8 rounded-xl bg-secondary/10 mt-auto"></div>
    </div>
);

const UserCardSkeletonSecondary = () => (
    <div className="min-w-[150px] sm:min-w-[180px] snap-start bg-secondary/5 p-4 rounded-2xl flex flex-col items-center animate-pulse border border-border/10">
        <div className="w-12 h-12 rounded-full mb-3 bg-secondary/10 mt-2"></div>
        <div className="h-3 w-20 bg-secondary/10 rounded mb-4"></div>
        <div className="h-6 w-20 rounded-full bg-secondary/10"></div>
    </div>
);

const ProfessorSkeleton = () => (
    <div className="min-w-[280px] sm:min-w-[362px] bg-card p-5 rounded-2xl shadow-sm border border-border/10 flex gap-4 snap-start mb-1 animate-pulse">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-secondary/10 flex-shrink-0"></div>
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
    <div className="min-w-[200px] sm:min-w-[240px] bg-card border border-border/10 p-5 rounded-3xl flex flex-col gap-4 animate-pulse">
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
    const { following, sentRequests } = useAppSelector((state) => state.follow);

    const { user } = useAppSelector((state) => state.auth);
    const { me } = useAppSelector((state) => state.user);

    // Use me (populated by getMe() on every load) as source of truth for role
    // auth.user is no longer persisted, but me is always fetched fresh on mount
    const currentUser = me || user;

    const [fetching, setFetching] = useState({
        classmates: classmates.length === 0,
        batchmates: batchmates.length === 0,
        teachers: sameUniversityTeachers.length === 0,
        alumni: alumni.length === 0,
    });

    const [isUnfollowDialogOpen, setIsUnfollowDialogOpen] = useState(false);
    const [userToUnfollow, setUserToUnfollow] = useState<{ id: string; name: string } | null>(null);
    const [isUnfollowing, setIsUnfollowing] = useState(false);

    useEffect(() => {
        let mounted = true;

        const isStudent = currentUser?.roleId?.name === "STUDENT";
        const isAlumini = currentUser?.roleId?.name === "ALUMINI";
        const isTeacher = currentUser?.roleId?.name === "TEACHER";

        const fetchData = async () => {
            // Classmates (STUDENT only — alumni don't have semesters)
            if (isStudent && classmates.length === 0) {
                await dispatch(getStudentsByMatchedSemesterWithCourseAndSameUniversity());
            }
            if (mounted) setFetching(prev => ({ ...prev, classmates: false }));

            // Batchmates (STUDENT + ALUMINI + TEACHER)
            if ((isStudent || isAlumini || isTeacher) && batchmates.length === 0) {
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

            // Follow States
            await dispatch(getFollowing());
            await dispatch(getSentRequests());
        };

        fetchData();

        return () => { mounted = false; };
    }, [dispatch, currentUser?._id]);



    const handleUnfollow = async () => {
        if (!userToUnfollow) return;
        setIsUnfollowing(true);
        try {
            emitUnfollowUser(userToUnfollow.id);
            setIsUnfollowDialogOpen(false);
            setUserToUnfollow(null);
        } catch (err: any) {
            toast.error(err || "Failed to unfollow");
        } finally {
            setIsUnfollowing(false);
        }
    };



    const departments = [
        { name: "IT Department", category: "Academic", students: "1.2k Students", icon: Terminal, bg: "bg-accent/10", text: "text-accent" },
        { name: "Social Science", category: "Social", students: "800 Students", icon: Globe, bg: "bg-secondary/10", text: "text-secondary" },
        { name: "Political Dept", category: "Political", students: "450 Students", icon: Landmark, bg: "bg-primary/10", text: "text-primary" },
        { name: "Home Science", category: "Applied", students: "320 Students", icon: Home, bg: "bg-accent/5", text: "text-accent/70" },
    ]

    return (
        <div className="flex-1 space-y-10">
            {/* Welcome Hero */}
            <div className="mb-6 sm:mb-10 text-center sm:text-left px-2">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-black mb-3"> Welcome to Student Nexus</h1>
                <p className="text-black text-sm sm:text-base max-w-2xl">  Connect, collaborate, and grow with students from your university.</p>
            </div>


            {/* Class Mates */}
            {currentUser?.roleId?.name === "STUDENT" && <section>
                <div className="flex py-8 sm:py-0 items-center justify-between gap-5 mb-4 px-4">
                    <h2 className="text-sm sm:text-xl font-bold">{currentUser?.universityId?.short_name} University - Class Mates</h2>
                    <button onClick={() => router.push("/students")} className="text-secondary cursor-pointer text-xs sm:text-sm font-semibold hover:underline">Directory</button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-hide mx-2">

                    {fetching.classmates ? (
                        [1, 2, 3, 4, 5].map((i) => (
                            <div
                                key={i}
                                className="
                    snap-start
                    flex-none
                    w-full
                    md:w-[calc(50%-8px)]
                    lg:w-[calc(33.333%-11px)]
                "
                            >
                                <UserCardSkeletonPrimary />
                            </div>
                        ))
                    ) : (
                        <>
                            {classmates.slice(0, 5).map((user: any, idx: number) => (
                                <div
                                    key={idx}
                                    className="
                        snap-start
                        flex-none
                        w-full
                        sm:w-[calc(50%-8px)]
                        md:w-[calc(33%-8px)]
                        lg:w-[calc(33.333%-11px)]
                    "
                                >
                                    <UserCard
                                        userId={user._id}
                                        name={`${user.firstName} ${user.lastName}`}
                                        role={
                                            user.courseIds?.length > 0
                                                ? user.courseIds.map((c: any) => c.course_short_name).join(", ")
                                                : "Student"
                                        }
                                        university={
                                            user.universityId?.short_name ||
                                            user.universityId?.name
                                        }
                                        image={user.avatar}
                                        variant="primary"
                                    />
                                </div>
                            ))}

                            {classmates.length === 0 && (
                                <p className="text-sm text-gray-400 italic py-5">
                                    No classmates discovered yet.
                                </p>
                            )}
                        </>
                    )}

                </div>
            </section>}

            {/* Batch Mates */}
            {(currentUser?.roleId?.name === "STUDENT" || currentUser?.roleId?.name === "ALUMINI") && <section>
                <div className="flex items-center justify-between gap-5 mb-4 px-3">
                    <h2 className="text-sm sm:text-xl font-bold">{currentUser?.universityId?.short_name} University - Batch Mates</h2>
                    <button onClick={() => router.push("/students")} className="text-secondary cursor-pointer text-xs sm:text-sm font-semibold hover:underline">Directory</button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x mx-2">

                    {fetching.batchmates ? (
                        [1, 2, 3, 4, 5].map((i) => (
                            <div
                                key={i}
                                className="
                    flex-none
                    snap-start
                    w-full
                    md:w-[calc(50%-8px)]
                    lg:w-[calc(33.333%-11px)]
                "
                            >
                                <UserCardSkeletonSecondary />
                            </div>
                        ))
                    ) : (
                        <>
                            {batchmates.slice(0, 5).map((user: any, idx: number) => (
                                <div
                                    key={idx}
                                    className="
                        flex-none
                        snap-start
                        w-full
                        sm:w-[calc(50%-8px)]
                        md:w-[calc(33.333%-11px)]
                        lg:w-[calc(33.333%-11px)]
                    "
                                >
                                    <UserCard
                                        userId={user._id}
                                        name={`${user.firstName} ${user.lastName}`}
                                        role={
                                            user.courseIds?.length > 0
                                                ? user.courseIds
                                                    .map((c: any) => c.course_short_name)
                                                    .join(", ")
                                                : "Student"
                                        }
                                        university={
                                            user.universityId?.short_name ||
                                            user.universityId?.name
                                        }
                                        image={user.avatar}
                                        variant="secondary"
                                    />
                                </div>
                            ))}

                            {batchmates.length === 0 && (
                                <p className="text-sm px-3 text-gray-400 italic py-5">
                                    No batchmates discovered yet.
                                </p>
                            )}
                        </>
                    )}

                </div>
            </section>}

            {user?.roleId?.name === "TEACHER" && <section>
                <div className="flex items-center justify-between mb-4 px-3">
                    <h2 className="text-sm sm:text-xl font-bold">Your Student - Community</h2>
                    <button onClick={() => router.push("/students")} className="text-secondary cursor-pointer text-xs sm:text-sm font-semibold hover:underline">Directory</button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x mx-2">

                    {fetching.batchmates ? (
                        [1, 2, 3, 4, 5].map((i) => (
                            <div
                                key={i}
                                className="
                    flex-none
                    snap-start
                    w-full
                    md:w-[calc(50%-8px)]
                    lg:w-[calc(33.333%-11px)]
                "
                            >
                                <UserCardSkeletonPrimary />
                            </div>
                        ))
                    ) : (
                        <>
                            {batchmates.slice(0, 5).map((user: any, idx: number) => (
                                <div
                                    key={idx}
                                    className="
                        flex-none
                        snap-start
                        w-full
                        md:w-[calc(50%-8px)]
                        lg:w-[calc(33.333%-11px)]
                    "
                                >
                                    <UserCard
                                        userId={user._id}
                                        name={`${user.firstName} ${user.lastName}`}
                                        role={
                                            user.courseIds?.length > 0
                                                ? user.courseIds
                                                    .map((c: any) => c.course_short_name)
                                                    .join(", ")
                                                : "Student"
                                        }
                                        university={
                                            user.universityId?.short_name ||
                                            user.universityId?.name
                                        }
                                        image={user.avatar}
                                        variant="primary"
                                    />
                                </div>
                            ))}

                            {batchmates.length === 0 && (
                                <p className="text-sm px-3 text-gray-400 italic py-5">
                                    No teacher students discovered yet.
                                </p>
                            )}
                        </>
                    )}

                </div>
            </section>}



            {/* Professors */}
            <section>
                <div className="flex items-center justify-between mb-4 px-3">
                    <h2 className="text-sm sm:text-xl font-bold">{user?.universityId?.short_name} University - Professors</h2>
                    <button onClick={() => router.push("/professors")} className="text-secondary cursor-pointer text-xs sm:text-sm font-semibold hover:underline">Directory</button>
                </div>
                <div className="grid grid-rows-1 sm:grid-rows-2 grid-flow-col gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x mx-2">
                    {fetching.teachers ? (
                        [1, 2, 3, 4].map((i) => <ProfessorSkeleton key={i} />)
                    ) : (
                        <>
                            {sameUniversityTeachers.slice(0, 10).map((prof, idx) => (
                                <div key={idx} onClick={() => router.push(`/professors/${prof._id}`)} className="min-w-[320px] sm:min-w-[362px] bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-border/10 flex gap-3 sm:gap-4 snap-start mb-1 hover:shadow-md transition-shadow">
                                    {prof.avatar ? (
                                        <img className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover" src={prof.avatar} alt={`${prof.firstName} ${prof.lastName}`} />
                                    ) : (
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary font-bold text-xl sm:text-2xl border border-secondary/20 uppercase flex-shrink-0">
                                            {prof.firstName?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div className="overflow-hidden">
                                                <h4 className="font-bold text-sm sm:text-base text-black truncate">{prof.firstName} {prof.lastName}</h4>
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
                <div className="mb-4 px-3">
                    <h2 className="text-sm sm:text-xl font-bold">{user?.universityId?.short_name} University - Departments</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-3">
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
                <div className="flex items-center justify-between mb-4 px-3">
                    <h2 className="text-sm sm:text-xl font-bold">{user?.universityId?.short_name} University - Alumni</h2>
                    <button onClick={() => router.push("/alumni")} className="text-secondary cursor-pointer text-xs sm:text-sm font-semibold hover:underline">Career Network</button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-3">
                    {fetching.alumni ? (
                        [1, 2, 3, 4, 5].map((i) => <AlumniSkeleton key={i} />)
                    ) : (
                        <>
                            {alumni.slice(0, 5).map((member, idx) => {
                                const memberId = String(member._id);
                                const isFollowing = following.some(f => String(typeof f.following === 'object' ? f.following._id : f.following) === memberId);
                                const isRequested = sentRequests.some(r => String(typeof r.following === 'object' ? r.following._id : r.following) === memberId);

                                return (
                                    <div key={idx} onClick={() => router.push(`/alumni/${member._id}`)} className="min-w-[300px] sm:min-w-[240px] bg-white border border-border/10 p-4 sm:p-5 rounded-3xl flex flex-col gap-4 cursor-pointer">
                                        <div className="flex items-center gap-3 sm:gap-4">
                                            {member.avatar ? (
                                                <img className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover" src={member.avatar} alt={member.firstName} />
                                            ) : (
                                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold text-lg sm:text-2xl border border-secondary/20 uppercase flex-shrink-0">
                                                    {member.firstName?.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <h4 className="font-bold text-sm text-black">{member.firstName} {member.lastName}</h4>
                                                <p className="text-[10px] text-black/70">{member.aluminiProfile?.jobTitle} • {member.aluminiProfile?.currentCompany}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                if (isFollowing || isRequested) {
                                                    setUserToUnfollow({ id: memberId, name: `${member.firstName} ${member.lastName}` });
                                                    setIsUnfollowDialogOpen(true);
                                                    return;
                                                }
                                                emitFollowUser(memberId);
                                            }}
                                            disabled={false}
                                            className={cn(
                                                "w-full py-2 cursor-pointer rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2",
                                                isFollowing ? "bg-green-100 text-green-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 border border-transparent" :
                                                    isRequested ? "bg-blue-50 text-blue-500" :
                                                        "bg-secondary/10 text-black hover:bg-secondary/30"
                                            )}
                                        >
                                            {isFollowing ? (
                                                <>Following</>
                                            ) : isRequested ? (
                                                <>Requested</>
                                            ) : (
                                                <>
                                                    <Send className="w-3 h-3" />
                                                    Send Request
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )
                            })}
                            {alumni.length === 0 && (
                                <p className="text-sm px-3 text-black/50 italic py-5">No alumni discovered yet.</p>
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* Unfollow Confirmation Dialog */}
            <Dialog open={isUnfollowDialogOpen} onOpenChange={setIsUnfollowDialogOpen}>
                <DialogContent className="sm:max-w-[400px] rounded-3xl p-8 border-none shadow-2xl">
                    <DialogHeader className="space-y-4">
                        <div className="mx-auto w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mb-2">
                            <LogOut className="w-8 h-8" />
                        </div>
                        <DialogTitle className="text-2xl font-black text-center text-slate-900">
                            Unfollow {userToUnfollow?.name.split(' ')[0]}?
                        </DialogTitle>
                        <DialogDescription className="text-center text-slate-500 font-bold leading-relaxed">
                            Are you sure you want to disconnect? You'll stop seeing their updates in your feed.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
                        <Button
                            variant="outline"
                            onClick={() => setIsUnfollowDialogOpen(false)}
                            className="flex-1 rounded-2xl h-12 font-black border-slate-200 hover:bg-slate-50 text-slate-600"
                        >
                            Keep Following
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleUnfollow}
                            disabled={isUnfollowing}
                            className="flex-1 rounded-2xl h-12 font-black bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-200"
                        >
                            {isUnfollowing ? "Unfollowing..." : "Yes, Unfollow"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
