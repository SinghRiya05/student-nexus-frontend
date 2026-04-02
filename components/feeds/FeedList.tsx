"use client"

import * as React from "react"
import { PostCard } from "./PostCard"
import { motion, AnimatePresence } from "framer-motion"

const MOCK_POSTS = [
  {
    id: 1,
    user: {
      name: "Alex Johnson",
      role: "Lead Software Architect",
      organization: "Google Cloud",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
    },
    content: "Just published a new guide on implementing advanced design patterns in React! 🚀 Check it out if you're looking to scale your frontend architecture.\n\n#ReactJS #FrontendDevelopment #Engineering",
    tags: ["ReactJS", "FrontendDevelopment", "Engineering", "DesignPatterns"],
    likes: 124,
    comments: 42,
    views: 1200,
    publishedAt: "2 hours ago",
    images: ["https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop"]
  },
  {
    id: 2,
    user: {
      name: "Sarah Miller",
      role: "UX Designer",
      organization: "Adobe Research",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
    },
    content: "Exploring the intersections of AI and human-centered design today. The potential for tools that empower rather than replace is exciting. \n\nWhat's your take on AI-driven design workflows?",
    tags: ["UXDesign", "AIDesign", "HumanCenteredDesign", "FutureOfWork"],
    likes: 89,
    comments: 12,
    views: 840,
    publishedAt: "5 hours ago",
    images: [
      "https://images.unsplash.com/photo-1675557009875-436f0978964f?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1675557010061-0734568cc110?q=80&w=2070&auto=format&fit=crop"
    ]
  },
  {
    id: 3,
    user: {
      name: "Michael Chen",
      role: "Data Scientist",
      organization: "Tesla Open AI",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael"
    },
    content: "Data doesn't lie, but it can be misinterpreted. The most critical skill for a data scientist isn't coding—it's storytelling with context. 📊📈",
    tags: ["DataScience", "AI", "Storytelling", "MachineLearning"],
    likes: 215,
    comments: 56,
    views: 2310,
    publishedAt: "1 day ago",
    images: [
      "https://images.unsplash.com/photo-1551288049-bbdac8a28a1e?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=2070&auto=format&fit=crop"
    ]
  },
  {
    id: 4,
    user: {
      name: "Michael Chen",
      role: "Data Scientist",
      organization: "Tesla Open AI",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael"
    },
    content: "Building the future of transportation with autonomous systems. The integration of sensors and AI is reaching new heights. 🚗⚡",
    tags: ["Autonomous", "Tesla", "AI", "Engineering"],
    likes: 215,
    comments: 56,
    views: 2310,
    publishedAt: "1 day ago"
  }
];

export function FeedList() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground/90">
          Your Feed
        </h2>
        <div className="h-[2px] flex-1 mx-4 bg-linear-to-r from-primary/20 to-transparent rounded-full" />
      </div>

      <AnimatePresence>
        {MOCK_POSTS.map((post, index) => (
          <PostCard
            key={post.id}
            user={post.user}
            content={post.content}
            tags={post.tags}
            likes={post.likes}
            comments={post.comments}
            views={post.views}
            publishedAt={post.publishedAt}
            images={post.images}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
