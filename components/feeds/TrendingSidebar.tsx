"use client"
import { TrendingUp, Hash, Loader2, MessageSquare, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/utils/hook";
import { getTrendingHashtags, getTopPosts } from "@/features/feeds/feedThunk";
import { ASSET_URL } from "@/services/apiEndpoints";
import * as React from "react";
import { motion } from "framer-motion";

export function TrendingSidebar() {
    const dispatch = useAppDispatch();
    const { trendingHashtags = [], topPosts = [], loading = false } = useAppSelector((state) => state.feed || {});

    React.useEffect(() => {
        dispatch(getTrendingHashtags());
        dispatch(getTopPosts());
    }, [dispatch]);

    console.log(topPosts)

    // Limit hashtags to 6 for the 2-row grid
    const displayHashtags = trendingHashtags.slice(0, 6);

    const hashtagColors = [
        "bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20",
        "bg-accent/10 text-accent border-accent/20 hover:bg-accent/20",
        "bg-amber-50/50 text-amber-600 border-amber-100/50 hover:bg-amber-100/80",
        "bg-emerald-50/50 text-emerald-600 border-emerald-100/50 hover:bg-emerald-100/80",
        "bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20",
        "bg-accent/10 text-accent border-accent/20 hover:bg-accent/20",
    ];

    const scrollToPost = (postId: string) => {
        const element = document.getElementById(`post-${postId}`);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
            // Optional: Highlight effect
            element.style.transition = "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
            element.style.transform = "scale(1.02)";
            element.style.boxShadow = "0 20px 40px -12px rgba(var(--primary), 0.15)";
            setTimeout(() => {
                element.style.transform = "scale(1)";
                element.style.boxShadow = "none";
            }, 1000);
        }
    };

    return (
        <div className="space-y-6 lg:sticky top-20">
            {/* Section 1: Trending Hashtags (Interactive 2-row grid) */}
            <Card className="rounded-2xl py-2 px-2 overflow-hidden shadow-sm hover:shadow-md transition-all duration-500 bg-white/90 backdrop-blur-xl">
                <div className="pt-2 px-4 pb-3 border-b border-border/50 flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl">
                        <Hash size={18} className="text-primary animate-pulse" />
                    </div>
                    <h3 className="font-extrabold text-primary text-[13px] uppercase tracking-[0.2em] opacity-80">Trending Tags</h3>
                </div>

                <CardContent className="pb-2 pt-2">
                    <div className="grid lg:grid-cols-3 grid-cols-2 gap-2.5">
                        {loading && trendingHashtags.length === 0 ? (
                            <div className="col-span-full flex items-center justify-center p-8">
                                <Loader2 className="w-5 h-5 text-primary animate-spin" />
                            </div>
                        ) : displayHashtags.length > 0 ? (
                            displayHashtags.map((tag, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={cn(
                                        "flex items-center justify-center gap-1.5 p-2.5 border rounded-xl cursor-pointer transition-all duration-300 group shadow-sm",
                                        hashtagColors[index % hashtagColors.length]
                                    )}
                                >
                                    <span className="text-[11px] font-black tracking-tight truncate">
                                        #{tag}
                                    </span>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full p-8 text-center bg-background/50 rounded-2xl">
                                <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest opacity-60">No trends yet</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Section 2: Top Discussions (Engagement based) */}
            <Card className="rounded-2xl py-1 overflow-hidden shadow-sm hover:shadow-md transition-all duration-500 bg-white/90 backdrop-blur-xl">
                <div className="pt-4 px-4   flex items-center gap-3">
                    <div className="p-2 bg-accent/10 rounded-xl text-black">
                        <TrendingUp size={18} className="" />
                    </div>
                    <h3 className="font-extrabold text-black text-[13px] uppercase tracking-[0.2em] opacity-80">Top Discussions</h3>
                </div>

                <CardContent className=" space-y-5">
                    {loading && topPosts?.length === 0 ? (
                        <div className="flex items-center justify-center p-8">
                            <Loader2 className="w-5 h-5 text-primary animate-spin" />
                        </div>
                    ) : topPosts?.length > 0 ? (
                        topPosts.map((post, idx) => (
                            <motion.div
                                key={post._id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                onClick={() => scrollToPost(post._id)}
                                className="w-full flex items-center gap-5 px-3 py-2 text-left group cursor-pointer bg-gray-50 rounded-lg transition-all duration-300"
                            >
                                {/* Left Side: Media or Avatar */}
                                <div className="h-12 w-12 shrink-0 rounded-full overflow-hidden bg-background border-2 border-card relative shadow-sm group-hover:border-secondary transition-all duration-500 ring-2 ring-transparent group-hover:ring-secondary/5">
                                    <img
                                        src={post.authorId.avatar}
                                        alt={post.authorId.firstName}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                </div>

                                {/* Right Side: Name and Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-black text-[12px] text-primary truncate uppercase tracking-tight group-hover:text-secondary transition-colors">
                                            {post.authorId.firstName} {post.authorId.lastName}
                                        </h4>
                                    </div>
                                    <p className="text-[11px] font-bold text-muted-foreground/80 line-clamp-2 leading-relaxed lowercase first-letter:uppercase">
                                        {post.content.split(' ').slice(0, 10).join(' ')}{post.content.split(' ').length > 10 ? '...' : ''}
                                    </p>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="p-8 text-center bg-background/50 rounded-2xl m-2">
                            <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest opacity-60">No top posts yet</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Footer Links */}
            <div className="px-6 flex flex-wrap gap-x-5 gap-y-3 opacity-30 hover:opacity-100 transition-opacity">
                {['About', 'Privacy', 'Terms', 'Help'].map(link => (
                    <a key={link} href="#" className="text-[9px] font-black uppercase tracking-[0.1em] text-primary hover:text-secondary transition-colors">{link}</a>
                ))}
                <p className="text-[9px] font-bold text-primary/30 w-full mt-2 uppercase tracking-tighter">© 2026 StudentNexus. Made with ❤️ for Students.</p>
            </div>
        </div>
    );
}

