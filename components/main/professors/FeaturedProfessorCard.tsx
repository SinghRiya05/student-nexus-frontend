"use client";

import React from "react";
import { Star, Mail, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import Link from "next/link";
import { ITeacher } from "@/features/teacher/teacherModel";



export default function FeaturedProfessorCard({ prof, badge = "Top Rated" }: { prof: ITeacher, badge?: "Top Rated" | "Most Searched" }) {
  const name = `${prof.firstName} ${prof.lastName}`;
  const title = prof.teacherProfile?.designation || "Faculty";
  const department = prof.teacherProfile?.department;
  const universityName = prof.universityId?.name;
  const tags = prof.courseIds?.map(c => c.course_short_name) || ["Faculty"];
  const rating = prof.trustScore !== undefined ? (prof.trustScore / 20).toFixed(1) : "4.5";
  const reviews = prof.followersCount || 0;
  const experience = prof.teacherProfile?.experienceYears;

  return (
    <div className={`rounded-2xl flex flex-col sm:flex-row overflow-hidden border transition-all group hover:shadow-xl bg-white/90`}>
      <div className="w-full sm:w-2/5 lg:w-1/3 aspect-square relative shrink-0">
        {prof.avatar || prof.profilePicture ? (
          <img src={prof.avatar || prof.profilePicture} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl font-black text-indigo-200 uppercase bg-indigo-50">
            {prof.firstName?.[0]}
          </div>
        )}
        <div className={`absolute top-3 left-3 px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-widest bg-primary text-white shadow-sm`}>
          {badge}
        </div>
      </div>

      <div className="flex-1 p-5 lg:p-6 flex flex-col justify-between min-w-0">
        <div className="space-y-1">
          <h3 className={`text-lg lg:text-xl font-bold text-[#302e56] transition-colors truncate group-hover:text-primary`}>
            {name}
          </h3>
          <p className={`font-semibold text-primary text-xs lg:text-sm truncate`}>
            {title}
          </p>
          <p className={`font-semibold text-primary text-xs lg:text-sm truncate`}>
            {department}
          </p>
          {universityName && (
            <p className="text-[10px] text-[#5d5a86] italic truncate mb-2">
              {universityName}
            </p>
          )}
          <div className="flex flex-wrap gap-1.5 pt-2">
            {tags.slice(0, 3).map((tag: any) => (
              <span key={tag} className="px-2 py-0.5 bg-indigo-50 text-[10px] lg:text-[11px] font-medium rounded-lg text-indigo-600 border border-indigo-100">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
          <div className="space-y-1">
            {experience !== undefined && (
              <p className="text-[10px] text-[#5d5a86] font-medium">
                {experience}+ Years Experience
              </p>
            )}
          </div>
          <button className={`p-2.5 rounded-xl transition-all hover:scale-110 active:scale-95 bg-primary text-white shadow-md shadow-primary/20 hover:bg-primary/90`}>
            <Mail className="h-4 w-4 lg:h-5 lg:w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
