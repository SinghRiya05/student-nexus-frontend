"use client";

import React from "react";
import { Star, Mail, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import Link from "next/link";

interface FeaturedProfessorCardProps {
  id: string | number;
  name: string;
  title: string;
  department: string;
  tags: string[];
  rating: string | number;
  reviews: string | number;
  badge: "Top Rated" | "Most Searched";
  image?: string;
}

export default function FeaturedProfessorCard({
  id,
  name,
  title,
  department,
  tags,
  rating,
  reviews,
  badge,
  image,
}: FeaturedProfessorCardProps) {
  return (
    <div className={`rounded-2xl flex flex-col sm:flex-row overflow-hidden border transition-all group hover:shadow-xl bg-white/90`}>
      <div className="w-full sm:w-2/5 lg:w-1/3 aspect-4/3 sm:aspect-square relative shrink-0">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl font-black text-slate-200 uppercase bg-slate-100">
            {name.charAt(5)}
          </div>
        )}
        <div className={`absolute top-3 left-3 px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-widest bg-primary-container text-on-primary-container`}>
          {badge}
        </div>
      </div>

      <div className="flex-1 p-5 lg:p-6 flex flex-col justify-between min-w-0">
        <div className="space-y-1">
          <h3 className={`text-lg lg:text-xl font-bold text-on-surface transition-colors truncate group-hover:text-primary`}>
            {name}
          </h3>
          <p className={`font-semibold text-xs lg:text-sm mb-2 truncate group-hover:text-primary`}>
            {title}
          </p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-2 py-0.5 bg-surface-container-lowest text-[10px] lg:text-[11px] font-medium rounded-lg text-on-surface-variant border border-on-surface-variant/5">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto pt-4">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 lg:h-5 lg:w-5 fill-tertiary text-tertiary" />
            <span className="font-bold text-sm lg:text-base">{rating}</span>
            <span className="text-[10px] lg:text-xs text-on-surface-variant">({reviews})</span>
          </div>
          <button className={`p-2 lg:p-2.5 rounded-xl transition-transform hover:scale-110 active:scale-95 bg-primary/80 text-white `}>
            <Mail className="h-4 w-4 lg:h-5 lg:w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
