"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import { MoreVertical } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useAppSelector, useAppDispatch } from "@/utils/hook"
import { sendFollowRequest, unfollow } from "@/features/follow/followThunk"

interface UserCardProps {
    userId?: string;
    name: string;
    role: string;
    variant?: 'primary' | 'secondary';
    image?: string;
    className?: string;
}

export const UserCard = ({
    userId,
    name,
    role,
    variant = 'primary',
    image,
    className
}: UserCardProps) => {

    const dispatch = useAppDispatch()
    const { following, sentRequests, loading } = useAppSelector(state => state.follow)

    const isFollowingObj = following.find((f: any) => f.following?._id === userId || f.following === userId)
    const isFollowing = !!isFollowingObj
    const isRequestedObj = sentRequests.find((r: any) => r.following?._id === userId || r.following === userId)
    const isRequested = !!isRequestedObj

    const handleAction = () => {
        if (!userId) return;
        if (!isFollowing && !isRequested) {
            dispatch(sendFollowRequest(userId))
        }
    }

    if (variant === 'secondary') {
        return (
            <motion.div
                whileHover={{ y: -5 }}
                className={cn(
                    "relative min-w-[180px] snap-start bg-[#f0eaff] p-4 rounded-2xl flex flex-col items-center",
                    className
                )}
            >
                {isFollowing && (
                    <div className="absolute top-3 right-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <button className="text-gray-400 hover:text-gray-700 transition"><MoreVertical size={14} /></button>
                            </PopoverTrigger>
                            <PopoverContent className="w-32 p-1.5 rounded-xl border border-gray-100 shadow-lg">
                                <button onClick={() => dispatch(unfollow(isFollowingObj._id))} className="w-full text-left px-3 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 rounded-lg transition">Unfollow</button>
                            </PopoverContent>
                        </Popover>
                    </div>
                )}
                <div className="w-12 h-12 rounded-full mb-2 overflow-hidden bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100 mt-2">
                    {image ? (
                        <img
                            src={image}
                            alt={name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-lg uppercase">{name?.[0]}</span>
                    )}
                </div>
                <span className="text-xs font-bold mb-3 text-[#302e56]">{name}</span>
                <button 
                    onClick={handleAction}
                    disabled={isRequested || loading}
                    className={cn(
                        "px-4 py-1.5 border rounded-full text-[10px] font-bold transition-all",
                        isFollowing ? "bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200" 
                        : isRequested ? "bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed" 
                        : "bg-white text-[#2949ef] border-[#2949ef]/20 hover:bg-[#2949ef] hover:text-white"
                    )}
                >
                    {isFollowing ? "Following" : isRequested ? "Requested" : "Follow"}
                </button>
            </motion.div>
        )
    }

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={cn(
                "relative min-w-[240px] snap-start bg-white p-5 rounded-2xl shadow-sm border border-[#b1addd]/10 hover:shadow-md transition-shadow flex flex-col items-center text-center",
                className
            )}
        >
            {isFollowing && (
                <div className="absolute top-4 right-3">
                    <Popover>
                        <PopoverTrigger asChild>
                            <button className="text-gray-400 hover:text-gray-700 transition"><MoreVertical size={16} /></button>
                        </PopoverTrigger>
                        <PopoverContent className="w-32 p-1.5 rounded-xl border border-gray-100 shadow-lg" align="end">
                            <button onClick={() => dispatch(unfollow(isFollowingObj._id))} className="w-full text-left px-3 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 rounded-lg transition">Unfollow</button>
                        </PopoverContent>
                    </Popover>
                </div>
            )}
            <div className="w-16 h-16 rounded-full mb-3 overflow-hidden bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border-2 border-indigo-100 mt-2">
                {image ? (
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-2xl uppercase">{name?.[0]}</span>
                )}
            </div>
            <h4 className="font-bold text-[#302e56]">{name}</h4>
            <p className="text-xs text-[#5d5a86] mb-4">{role}</p>
            <button 
                onClick={handleAction}
                disabled={isRequested || loading}
                className={cn(
                    "w-full py-2 rounded-xl text-xs font-bold transition-colors",
                    isFollowing ? "bg-indigo-50 text-indigo-600 hover:bg-rose-50 hover:text-rose-600" 
                    : isRequested ? "bg-gray-100 text-gray-500 cursor-not-allowed" 
                    : "bg-[#2949ef] text-white hover:bg-[#1339e3]"
                )}
            >
                {isFollowing ? "Following" : isRequested ? "Requested" : "Follow"}
            </button>
        </motion.div>
    )
}

export default UserCard
