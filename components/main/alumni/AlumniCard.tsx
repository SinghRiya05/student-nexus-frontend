"use client"
import React, { useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { AlertCircle, Loader2, Send, Building2, Briefcase, GraduationCap, CheckCircle2, MoreVertical, Star, Clock } from "lucide-react"
import { IAlumni } from '@/features/alumni/alumniModel'
import { motion } from "framer-motion"
import { useAppDispatch, useAppSelector } from '@/utils/hook'
import { sendFollowRequest, unfollow } from '@/features/follow/followThunk'
import { emitFollowUser, emitUnfollowUser } from '@/services/socket'
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

    const userId = String(member._id)
    const [isUnfollowDialogOpen, setIsUnfollowDialogOpen] = useState(false)
    const [isUnfollowing, setIsUnfollowing] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const isFollowingObj = following.find((f: any) =>
        String(f.following?._id || f.following) === userId
    )
    const isFollowing = !!isFollowingObj
    const isRequestedObj = sentRequests.find((r: any) =>
        String(r.following?._id || r.following) === userId
    )
    const isRequested = !!isRequestedObj

    // Debug log to see why it might not be updating
    React.useEffect(() => {
        if (isFollowing || isRequested) {
            console.log(`AlumniCard [${member.firstName}]: State updated`, { isFollowing, isRequested });
        }
    }, [isFollowing, isRequested, member.firstName]);

    const handleNetworkAction = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (isFollowing || isRequested) {
            setIsUnfollowDialogOpen(true)
            return
        }
        console.log("AlumniCard: handleNetworkAction (follow) called for:", userId);
        emitFollowUser(userId);
    }

    const handleUnfollow = async () => {
        setIsUnfollowing(true)
        try {
            emitUnfollowUser(userId)
            setIsUnfollowDialogOpen(false)
        } catch (err) {
            console.error("Failed to unfollow:", err)
        } finally {
            setIsUnfollowing(false)
        }
    }

    return (
        <>
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5 }}
            onClick={() => router.push(`/alumni/${userId}`)}
            className="group relative min-w-[240px] bg-white border border-[#b1addd]/15 p-6 rounded-2xl flex flex-col items-center text-center gap-4 hover:shadow-xl transition-all duration-300 cursor-pointer"
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
                                    console.log("AlumniCard: Unfollow clicked for:", userId);
                                    emitUnfollowUser(userId);
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
                <div className="w-20 h-20 rounded-full overflow-hidden bg-primary/10 border-2 border-primary/50 flex items-center justify-center text-primary font-bold shadow-sm">
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
                    <GraduationCap size={12} className="text-primary" />
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
                        <div className="px-2 py-0.5 bg-[#f0ebff] text-primary text-[9px] font-black rounded-full uppercase">
                            {member.aluminiProfile.skills[0]}
                        </div>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full space-y-2">
                <button
                    onClick={handleNetworkAction}
                    disabled={loading || isUnfollowing}
                    className={cn(
                        "w-full py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2",
                        isFollowing
                            ? "bg-primary/10 text-primary border border-primary-100"
                            : isRequested
                                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                : "bg-primary text-white hover:bg-primary/90 shadow-md shadow-[#2949ef]/10"
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

        {/* Unfollow Confirmation Dialog */}
        <Dialog open={isUnfollowDialogOpen} onOpenChange={setIsUnfollowDialogOpen}>
            <DialogContent className="sm:max-w-[400px] rounded-3xl p-8 border-none shadow-2xl fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] bg-white">
                <DialogHeader className="space-y-4">
                    <div className="mx-auto w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mb-2">
                        <AlertCircle className="w-8 h-8" />
                    </div>
                    <DialogTitle className="text-2xl font-black text-center text-slate-900">
                        Unfollow {member.firstName}?
                    </DialogTitle>
                    <DialogDescription className="text-center text-slate-500 font-bold leading-relaxed">
                        Are you sure you want to disconnect? You'll stop seeing their updates in your feed.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsUnfollowDialogOpen(false);
                        }}
                        className="flex-1 rounded-2xl h-12 font-black border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleUnfollow();
                        }}
                        disabled={isUnfollowing}
                        className="flex-1 rounded-2xl h-12 font-black bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {isUnfollowing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Yes, Unfollow"}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>
    )
}
