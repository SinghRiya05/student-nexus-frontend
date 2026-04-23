"use client"
import React from 'react'
import { Send, Building2, Briefcase, GraduationCap, CheckCircle2, MoreVertical, Star, Clock } from "lucide-react"
import { IAlumni } from '@/features/alumni/alumniModel'
import { motion } from "framer-motion"
import { useAppDispatch, useAppSelector } from '@/utils/hook'
import { sendFollowRequest, unfollow } from '@/features/follow/followThunk'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useRouter } from 'next/navigation'

interface AlumniCardProps {
    member: IAlumni
}

export default function AlumniCard({ member }: AlumniCardProps) {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const { following, sentRequests, loading } = useAppSelector(state => state.follow)

    const userId = member._id
    const isFollowingObj = following.find((f: any) => f.following?._id === userId || f.following === userId)
    const isFollowing = !!isFollowingObj
    const isRequestedObj = sentRequests.find((r: any) => r.following?._id === userId || r.following === userId)
    const isRequested = !!isRequestedObj

    const handleNetworkAction = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!isFollowing && !isRequested) {
            dispatch(sendFollowRequest(userId))
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5 }}
            onClick={() => router.push(`/alumni/${userId}`)}
            className="group relative min-w-[240px] bg-white border border-[#b1addd]/15 p-6 rounded-[2rem] flex flex-col items-center text-center gap-4 hover:shadow-xl transition-all duration-300 cursor-pointer"
        >
            {/* Top Right Menu */}
            {isFollowing && (
                <div className="absolute top-4 right-4">
                    <Popover>
                        <PopoverTrigger asChild>
                            <button className="text-gray-400 hover:text-gray-700 transition"><MoreVertical size={16} /></button>
                        </PopoverTrigger>
                        <PopoverContent className="w-32 p-1.5 rounded-xl border border-gray-100 shadow-lg" align="end">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(unfollow(isFollowingObj._id));
                                }}
                                className="w-full text-left px-3 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 rounded-lg transition"
                            >
                                Unfollow
                            </button>
                        </PopoverContent>
                    </Popover>
                </div>
            )}

            {/* Profile Picture */}
            <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-indigo-50 border-2 border-indigo-100 flex items-center justify-center text-indigo-600 font-bold shadow-sm">
                    {member.avatar ? (
                        <img
                            src={member.avatar}
                            alt={member.firstName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-2xl uppercase">{member.firstName?.[0]}{member.lastName?.[0]}</span>
                    )}
                </div>
                {member.verificationStatus && (
                    <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-sm">
                        <CheckCircle2 size={14} className="text-[#6bfde0] fill-[#6bfde0]" />
                    </div>
                )}
            </div>

            {/* Basic Info */}
            <div className="space-y-1">
                <h4 className="font-bold text-[#302e56] text-base">{member.firstName} {member.lastName}</h4>
                <div className="flex flex-col items-center">
                    <p className="text-xs font-bold text-[#5d5a86]">{member.aluminiProfile?.jobTitle || "Alumni"}</p>
                    <p className="text-[10px] text-[#5d5a86]/70 font-medium">{member.aluminiProfile?.currentCompany || "Freelance"}</p>
                </div>
            </div>

            {/* Secondary Details */}
            <div className="w-full pt-2 border-t border-gray-50 space-y-3">
                <div className="flex items-center justify-center gap-2 text-[#5d5a86]">
                    <GraduationCap size={12} className="text-[#2949ef]" />
                    <span className="text-[10px] font-semibold truncate max-w-[150px]">
                        {member.courseIds?.length > 0 ? member.courseIds[0].course_short_name : member.universityId.name}
                    </span>
                </div>

                {/* Simplified Skills/Exp label */}
                <div className="flex items-center justify-center gap-3">
                    <div className="flex items-center gap-1 text-[10px] text-[#5d5a86]/60 font-medium">
                        <Clock size={10} />
                        <span>{member.aluminiProfile?.experienceYears || 0}y Exp.</span>
                    </div>
                    {member.aluminiProfile?.skills?.[0] && (
                        <div className="px-2 py-0.5 bg-[#f0ebff] text-[#2949ef] text-[9px] font-black rounded-full uppercase">
                            {member.aluminiProfile.skills[0]}
                        </div>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full space-y-2">
                <button
                    onClick={() => router.push(`/alumni/${userId}`)}
                    className="w-full py-2.5 rounded-2xl text-xs font-black bg-indigo-50 text-indigo-600 border border-indigo-100/50 hover:bg-indigo-100 transition-all flex items-center justify-center gap-2"
                >
                    View Profile
                </button>
                <button
                    onClick={handleNetworkAction}
                    disabled={isRequested || loading}
                    className={cn(
                        "w-full py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2",
                        isFollowing
                            ? "bg-indigo-50 text-indigo-600 border border-indigo-100"
                            : isRequested
                                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                : "bg-[#2949ef] text-white hover:bg-[#1339e3] shadow-md shadow-[#2949ef]/10"
                    )}
                >
                    {isFollowing ? (
                        "Connected"
                    ) : isRequested ? (
                        "Requested"
                    ) : (
                        <>
                            <Send size={12} />
                            Network
                        </>
                    )}
                </button>
            </div>
        </motion.div>
    )
}
