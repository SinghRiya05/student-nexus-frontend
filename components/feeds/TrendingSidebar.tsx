"use client";

import { TrendingUp, MessageSquare, Heart, Code, Brain, Database } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const TRENDING_POSTS = [
  {
    id: 1,
    title: "Advanced Design Patterns in React",
    description: "Just published a new guide on implementing advanced design patterns in React! 🚀 Check it out if you're looking to scale your frontend architecture.",
    author: "Alex Johnson",
    time: "2h ago",
    engagement: { likes: 124, comments: 42 },
    icon: Code,
    color: "text-blue-500",
    bgColor: "bg-blue-50"
  },
  {
    id: 2,
    title: "AI & Human-Centered Design",
    description: "Exploring the intersections of AI and human-centered design today. The potential for tools that empower rather than replace is exciting. What's your take?",
    author: "Sarah Miller",
    time: "5h ago",
    engagement: { likes: 89, comments: 12 },
    icon: Brain,
    color: "text-purple-500",
    bgColor: "bg-purple-50"
  },
  {
    id: 3,
    title: "Storytelling with Data context",
    description: "Data doesn't lie, but it can be misinterpreted. The most critical skill for a data scientist isn't coding—it's storytelling with context. 📊📈",
    author: "Michael Chen",
    time: "1d ago",
    engagement: { likes: 215, comments: 56 },
    icon: Database,
    color: "text-emerald-500",
    bgColor: "bg-emerald-50"
  }
];

export function TrendingSidebar() {
  const router = useRouter();

  const handleRedirect = (id: number) => {
    // Scroll to the post or redirect to a search/detail page
    // For now, syncing with the search logic we established
    router.push(`/feeds?post=${id}`);
  };

  return (
    <div className="space-y-6 lg:sticky ">
      {/* 1. Synced Trending Posts (Non-Accordion) */}
      <Card className="rounded-2xl border border-gray-100  overflow-hidden">
        <div className="p-4 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-indigo-600" />
            <h3 className="font-black text-[#1a1a3b] text-[15px] uppercase tracking-wider">Top Discussions</h3>
          </div>
        </div>

        <CardContent className="">
          <div className="space-y-1">
            {TRENDING_POSTS.map((post) => {
              const Icon = post.icon;
              return (
                <div
                  key={post.id}
                  onClick={() => handleRedirect(post.id)}
                  className="w-full flex items-start gap-4 p-4 text-left group cursor-pointer hover:bg-indigo-50/50 rounded-2xl transition-all"
                >
                  <div className={`mt-1 h-11 w-11 shrink-0 flex items-center justify-center rounded-xl font-bold text-sm ${post.bgColor} ${post.color} shadow-sm group-hover:scale-110 transition-transform`}>
                    <Icon size={18} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-[10px] font-bold text-gray-400">by {post.author}</p>
                      <span className="text-[10px] font-bold text-gray-300">{post.time}</span>
                    </div>

                    <h4 className="font-black text-[13px] leading-tight text-[#1a1a3b] group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {post.title}
                    </h4>

                    <p className="text-[11px] font-bold text-gray-500 mt-1 line-clamp-1 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                      {post.description}
                    </p>

                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-indigo-500/80">
                        <Heart size={11} className="fill-current" />
                        {post.engagement.likes}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400">
                        <MessageSquare size={11} />
                        {post.engagement.comments}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <Button variant="ghost" className="w-full mt-2 font-black text-indigo-600 text-xs rounded-xl hover:bg-indigo-50 transition-all h-10 uppercase tracking-[0.2em]">
            Explore More
          </Button>
        </CardContent>
      </Card>
      {/* Footer Links */}
      <div className="px-8 flex flex-wrap gap-x-5 gap-y-3 opacity-40 hover:opacity-100 transition-opacity">
        {['About', 'Privacy', 'Terms', 'Help'].map(link => (
          <a key={link} href="#" className="text-[10px] font-black uppercase tracking-[0.1em] text-[#1a1a3b] hover:text-indigo-600 transition-colors">{link}</a>
        ))}
        <p className="text-[10px] font-bold text-gray-400 w-full mt-2">© 2026 StudentNexus. Made with ❤️ for Students.</p>
      </div>
    </div>
  );
}
