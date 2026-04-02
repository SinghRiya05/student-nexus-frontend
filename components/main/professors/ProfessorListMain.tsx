"use client";

import React from "react";
import ProfessorSearch from "./ProfessorSearch";
import ProfessorCard from "./ProfessorCard";
import FeaturedProfessorCard from "./FeaturedProfessorCard";
import TrendingSidebar from "./TrendingSidebar";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

const FEATURED_PROFESSORS = [
  {
    id: 101,
    name: "Dr. Elena Rodriguez",
    title: "Head of AI Research • CS Dept",
    department: "Computer Science",
    tags: ["Neural Networks", "Ethics in Tech", "Machine Learning"],
    rating: "4.9",
    reviews: "120",
    badge: "Top Rated" as const,
    variant: "primary" as const,
  },
  {
    id: 102,
    name: "Prof. James Sterling",
    title: "Senior Faculty • Business School",
    department: "Business School",
    tags: ["Venture Capital", "Leadership", "Financial Tech"],
    rating: "4.8",
    reviews: "85",
    badge: "Most Searched" as const,
    variant: "secondary" as const,
  },
];

const DIRECTORY_PROFESSORS = [
  {
    id: 1,
    name: "Dr. Sarah Jenkins",
    title: "Associate Professor",
    department: "Department of Life Sciences",
    tags: ["Genomics", "Data Bio"],
    rating: "4.7",
    reviews: "45",
    isOnline: true,
  },
  {
    id: 2,
    name: "Prof. Robert Chen",
    title: "Senior Researcher",
    department: "Theoretical Physics",
    tags: ["Quantum Mech", "Space"],
    rating: "4.9",
    reviews: "128",
    isOnline: false,
  },
  {
    id: 3,
    name: "Dr. Maya Patel",
    title: "Assistant Professor",
    department: "Social Sciences",
    tags: ["Urban Policy", "Sociology"],
    rating: "4.6",
    reviews: "56",
    isOnline: true,
  },
  {
    id: 4,
    name: "Dr. Mark Walton",
    title: "Cybersecurity Lead",
    department: "Computer Science",
    tags: ["Network Sec", "Crypto"],
    rating: "4.8",
    reviews: "92",
    isOnline: true,
  },
  {
    id: 5,
    name: "Prof. Anita Desai",
    title: "Faculty Head",
    department: "Environmental Science",
    tags: ["Climate", "Ecology"],
    rating: "4.9",
    reviews: "210",
    isOnline: true,
  },
  {
    id: 6,
    name: "Dr. Thomas Lee",
    title: "Robotics Expert",
    department: "Engineering",
    tags: ["AI", "Hardware"],
    rating: "4.7",
    reviews: "34",
    isOnline: false,
  },
];

export default function ProfessorListMain() {
  return (
    <div className="flex flex-col xl:flex-row gap-8 xl:gap-12 pb-20 animate-fade-in-up">
      {/* Main Content (Left/Center) */}
      <div className="flex-1 min-w-0 space-y-5">
        {/* Page Header */}
        <section className="space-y-2">
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">
            Academic Directory
          </h1>
          <p className=" text-gray-700 text-base max-w-2xl font-medium leading-relaxed">
            Find and connect with mentors, researchers, and faculty members driving the future of innovation.
          </p>
        </section>

        {/* Search & Filters */}
        <ProfessorSearch />

        {/* Featured Mentors */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
            <Star className="h-5 w-5 text-tertiary fill-tertiary" />
            Featured Mentors
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {FEATURED_PROFESSORS.map((prof) => (
              <FeaturedProfessorCard key={prof.id} {...prof} />
            ))}
          </div>
        </section>

        {/* Directory Grid */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-on-surface">Browse All Faculty</h2>
            <div className="flex gap-2 text-on-surface-variant text-sm font-medium">
              <span>Showing {DIRECTORY_PROFESSORS.length} of 142 results</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-5">
            {DIRECTORY_PROFESSORS.map((prof) => (
              <ProfessorCard key={prof.id} {...prof} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-16">
            <Button
              variant="outline"
              size="icon"
              className="p-2 rounded-xl border-none bg-surface-container-high text-on-surface-variant hover:bg-primary hover:text-on-primary transition-all shadow-none"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            {[1, 2, 3, "...", 12].map((page, idx) => (
              <Button
                key={idx}
                variant={page === 1 ? "default" : "outline"}
                className={`h-10 w-10 rounded-xl font-bold transition-all shadow-none border-none ${page === 1
                  ? "bg-primary text-white"
                  : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
                  }`}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              className="p-2 rounded-xl border-none bg-surface-container-high text-on-surface-variant hover:bg-primary hover:text-on-primary transition-all shadow-none"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </section>
      </div>

      {/* Right Sidebar (Sticky Trending Section) */}
      <aside className="hidden  xl:block w-70 shrink-0 sticky top-20 h-fit">
        <TrendingSidebar />
      </aside>
    </div>
  );
}
