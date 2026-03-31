"use client";

import React from "react";
import { TrendingUp, Users, Rocket, Eye, MessageCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const TRENDING_FACULTY = [
  {
    id: 1,
    name: "Dr. Mark Walton",
    title: "Cybersecurity Expert",
    recent: 'Recently published: "Post-Quantum Cryptography in Distributed Networks"',
    views: "2.4k views this week",
    icon: <Eye className="h-3.5 w-3.5" />,
    iconClass: "text-primary",
  },
  {
    id: 2,
    name: "Prof. Anita Desai",
    title: "Sustainability Lead",
    recent: 'Upcoming Workshop: "Zero-Waste Campus Initiatives 2024"',
    views: "Booking fast: 4 spots left",
    icon: <Calendar className="h-3.5 w-3.5" />,
    iconClass: "text-primary",
  },
  {
    id: 3,
    name: "Dr. Thomas Lee",
    title: "Robotics Dept",
    recent: "New Grant: $2.4M for Human-Centric AI Interaction Lab",
    views: "Join Research Team",
    icon: <Rocket className="h-3.5 w-3.5" />,
    iconClass: "text-primary",
  },
];

export default function TrendingSidebar() {
  return (
    <div className="w-full flex flex-col  bg-white/90 border border-outline-variant/30 rounded-2xl overflow-hidden">
      <div className="flex px-5 py-5 flex-col overflow-y-auto scrollbar-hide">
        <h3 className="text-lg font-bold  mb-4 flex items-center gap-3 tracking-tight">
          <div className="p-2.5 bg-primary/10 rounded-2xl text-primary shadow-sm">
            <TrendingUp className="h-4 w-4" />
          </div>
          Trending Faculty
        </h3>

        <div className="space-y-5">
          {TRENDING_FACULTY.map((faculty, idx) => (
            <div key={faculty.id} className="group cursor-pointer">
              <div className="flex items-center gap-4 mb-3">
                <div className="relative">
                  <div className="h-12 w-12 rounded-2xl overflow-hidden shadow-md bg-slate-100 flex items-center justify-center font-bold text-primary border border-surface-container-high/50 group-hover:scale-110 transition-transform duration-300">
                    {faculty.name.split(" ").pop()?.charAt(0)}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-sm  group-hover:text-primary transition-colors truncate">
                    {faculty.name}
                  </h4>
                  <p className="text-[11px] font-medium -variant/70 italic truncate">{faculty.title}</p>
                </div>
              </div>
              {idx < TRENDING_FACULTY.length - 1 && (
                <div className="mt-4 border-b border-outline-variant/10 w-full" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-5">
          <div className="p-6 text-white rounded-2xl bg-primary relative overflow-hidden group/cta">
            <div className="relative z-10">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <Rocket className="h-4 w-4" />
                Need a Mentor?
              </h4>
              <p className="text-[11px] opacity-90 mb-6 leading-relaxed font-medium">
                Our AI-driven Nexus Match algorithm pairs you with the perfect research advisor.
              </p>
              <button className="w-full py-3 bg-white text-primary font-bold rounded-xl text-xs hover:bg-primary-container hover:text-on-primary-container transition-all shadow-lg active:scale-95 transition-transform">
                Start Matching Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
