"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import { Loader2, MessageSquare, AlertCircle } from "lucide-react"
import { useAppSelector, useAppDispatch } from "@/utils/hook"
import { useRouter } from "next/navigation"
import { sendFollowRequest, unfollow } from "@/features/follow/followThunk"
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { toast } from 'react-hot-toast'

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
    const router = useRouter()
    const dispatch = useAppDispatch()
    const [localLoading, setLocalLoading] = useState(false)
    const [showUnfollowConfirm, setShowUnfollowConfirm] = useState(false)
    const [optimisticStatus, setOptimisticStatus] = useState<'FOLLOWING' | 'REQUESTED' | 'NONE' | null>(null)
    const [isMounted, setIsMounted] = useState(false)
    const { following, followers, sentRequests } = useAppSelector(state => state.follow)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const isFollowingObj = following.find((f: any) => f.following?._id === userId || f.following === userId)
    const isFollowing = optimisticStatus === 'NONE' ? false : (optimisticStatus === 'FOLLOWING' ? true : !!isFollowingObj)

    const isFollower = followers.some((f: any) => f.follower?._id === userId || f.follower === userId)
    const isMutual = isFollowing && isFollower

    const isRequestedObj = sentRequests.find((r: any) => r.following?._id === userId || r.following === userId)
    const isRequested = optimisticStatus === 'NONE' ? false : (optimisticStatus === 'REQUESTED' ? true : !!isRequestedObj)

    const handleAction = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!userId) return;

        if (isMutual) {
            router.push('/chat');
            return;
        }

        if (isFollowing) {
            setShowUnfollowConfirm(true);
            return;
        }

        if (!isFollowing && !isRequested) {
            setOptimisticStatus('REQUESTED')
            setLocalLoading(true)
            try {
                await dispatch(sendFollowRequest(userId)).unwrap()
            } catch (err) {
                setOptimisticStatus(null) // Rollback
                toast.error("Failed to follow")
            } finally {
                setLocalLoading(false)
                setOptimisticStatus(null)
            }
        }
    }

    const handleUnfollow = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isFollowingObj) return;

        setOptimisticStatus('NONE')
        setLocalLoading(true)
        try {
            await dispatch(unfollow(userId)).unwrap()
        } catch (err) {
            setOptimisticStatus(null) // Rollback
            toast.error("Failed to unfollow")
        } finally {
            setLocalLoading(false)
            setOptimisticStatus(null)
        }
    }

    return (
        <>
            {variant === 'secondary' ? (
                <motion.div
                    onClick={() => router.push(`/students/${userId}`)}
                    whileHover={{ y: -5 }}
                    className={cn(
                        "relative min-w-[180px] snap-start bg-secondary/8 p-4 rounded-2xl flex flex-col items-center",
                        className
                    )}
                >
                    <div className="w-12 h-12 rounded-full mb-2 overflow-hidden bg-secondary/10 flex items-center justify-center text-primary font-bold border border-primary/30 mt-2">
                        {image ? (
                            <img src={image} alt={name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-lg uppercase">{name?.[0]}</span>
                        )}
                    </div>
                    <span className="text-xs font-bold mb-3 text-black">{name}</span>
                    <button
                        onClick={handleAction}
                        disabled={localLoading}
                        className={cn(
                            "px-4 py-1.5 border rounded-full text-[10px] font-bold transition-all flex items-center gap-1.5",
                            isMutual ? "bg-primary hover:bg-primary/90 cursor-pointer text-white border-primary hover:bg-primary/90"
                                : isFollowing ? "bg-secondary/10 hover:bg-secondary/20 cursor-pointer text-black border-primary/20"
                                    : "bg-primary/10 cursor-pointer hover:bg-primary/20 text-black border-primary/20 hover:bg-primary hover:text-white"
                        )}
                    >
                        {localLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                        {isMutual ? (
                            <>
                                <MessageSquare className="w-3 h-3" />
                                Message
                            </>
                        ) : (
                            isFollowing ? "Following" : isRequested ? "Requested" : "Follow"
                        )}
                    </button>
                </motion.div>
            ) : (
                <motion.div
                    onClick={() => router.push(`/students/${userId}`)}
                    whileHover={{ y: -5 }}
                    className={cn(
                        "relative min-w-[240px] snap-start bg-white p-5 rounded-2xl shadow-sm border border-[#b1addd]/10 hover:shadow-md transition-shadow flex flex-col items-center text-center",
                        className
                    )}
                >
                    <div className="w-16 h-16 rounded-full mb-3 overflow-hidden bg-primary/10 flex items-center justify-center text-primary font-bold border-2 border-primary/10 mt-2">
                        {image ? (
                            <img src={image} alt={name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-2xl uppercase">{name?.[0]}</span>
                        )}
                    </div>
                    <h4 className="font-bold text-[#302e56]">{name}</h4>
                    <p className="text-xs text-[#5d5a86] mb-4">{role}</p>
                    <button
                        onClick={handleAction}
                        disabled={localLoading}
                        className={cn(
                            "w-full py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2",
                            isMutual ? "bg-primary text-white hover:bg-primary/90"
                                : isFollowing ? "bg-secondary/10 cursor-pointer text-black hover:bg-secondary/20"
                                    : "bg-primary/10 cursor-pointer text-black hover:bg-primary/20"
                        )}
                    >
                        {localLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                        {isMutual ? (
                            <>
                                <MessageSquare className="w-3.5 h-3.5" />
                                Message
                            </>
                        ) : (
                            isFollowing ? "Following" : isRequested ? "Requested" : "Follow"
                        )}
                    </button>
                </motion.div>
            )}

            {/* Global Unfollow Portal */}
            {isMounted && typeof document !== 'undefined' && createPortal(
                <AnimatePresence>
                    {showUnfollowConfirm && (
                        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowUnfollowConfirm(false);
                                }}
                                className="absolute inset-0 bg-black/60 backdrop-blur-[4px]"
                            />
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                                className="relative bg-white  max-w-2xl rounded-xl p-8 shadow-2xl border border-gray-100 text-center"
                            >
                                <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <AlertCircle size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-[#302e56] mb-2">Unfollow {name}?</h3>
                                <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                                    Are you sure? You will stop seeing their updates in your feed.
                                </p>

                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            await handleUnfollow(e);
                                            setShowUnfollowConfirm(false);
                                        }}
                                        disabled={localLoading}
                                        className="w-full py-4 bg-rose-500 text-white rounded-2xl text-sm font-bold hover:bg-rose-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-200"
                                    >
                                        {localLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                        Unfollow
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowUnfollowConfirm(false);
                                        }}
                                        className="w-full py-4 bg-gray-100 text-gray-700 rounded-2xl text-sm font-bold hover:bg-gray-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    )
}

export default UserCard
