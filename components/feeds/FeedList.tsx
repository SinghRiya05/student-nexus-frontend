"use client"

import * as React from "react"
import { PostCard } from "./PostCard"
import { motion, AnimatePresence } from "framer-motion"
import { useAppDispatch, useAppSelector } from "@/utils/hook"
import { getAllFeeds } from "@/features/feeds/feedThunk"
import { Loader2 } from "lucide-react"

export function FeedList() {
    const dispatch = useAppDispatch();
    const { feeds, loading, error } = useAppSelector((state) => state.feed);

    React.useEffect(() => {
        dispatch(getAllFeeds());
    }, [dispatch]);

    if (loading && feeds.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 space-y-4">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Loading Feeds...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center bg-red-50 rounded-2xl border border-red-100">
                <p className="text-sm font-bold text-red-600 uppercase tracking-wider">Failed to load feeds</p>
                <p className="text-xs text-red-400 mt-1">{error}</p>
            </div>
        );
    }

    if (feeds.length === 0) {
        return (
            <div className="p-12 text-center bg-muted/20 rounded-3xl border-2 border-dashed border-muted">
                <p className="text-lg font-black text-muted-foreground uppercase tracking-tighter">No feeds yet</p>
                <p className="text-sm text-muted-foreground/60 mt-1">Be the first one to share something!</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <AnimatePresence mode="popLayout">
                {feeds.map((post) => (
                    <PostCard
                        key={post._id}
                        id={post._id}
                        author={post.authorId}
                        content={post.content}
                        hashtags={post.hashtags}
                        likesCount={post.likesCount}
                        commentsCount={post.commentsCount}
                        viewsCount={post.viewsCount}
                        publishedAt={post.createdAt}
                        media={post.media}
                    />
                ))}
            </AnimatePresence>
        </div>
    )
}
