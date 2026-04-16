"use client";

import React from "react";
import ProfessorHero from "./ProfessorHero";
import StudyResources from "./StudyResources";
import ScheduledClasses from "./ScheduledClasses";
import JoinedGroups from "./JoinedGroups";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/utils/hook";
import { getTeacherById } from "@/features/teacher/teacherThunk";

import {
  User,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  Award,
  TrendingUp,
  Sparkles,
  Users
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ProfessorProfileMain() {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const { singleTeacher: teacher, loading, error } = useAppSelector((state) => state.teacher);

  useEffect(() => {
    if (id) {
      dispatch(getTeacherById(id as string));
    }
  }, [id, dispatch]);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="font-black text-indigo-600 animate-pulse uppercase tracking-[0.2em] text-[10px]">Syncing Nexus Profile...</p>
      </div>
    );
  }

  if (error || !teacher) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="bg-rose-50 p-8 rounded-[2.5rem] border border-rose-100 mb-6 shadow-sm">
          <ShieldCheck className="w-16 h-16 text-rose-500 mb-4 mx-auto" />
          <h3 className="text-2xl font-black text-rose-900 mb-2">Academic Connection Lost</h3>
          <p className="text-rose-600 font-bold max-w-sm">This professor profile is currently unreachable in the directory.</p>
        </div>
        <Button
          onClick={() => window.history.back()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl px-10 h-12 shadow-xl"
        >
          Back to Hub
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1300px] space-y-8 pt-2 px-4 sm:px-6">
      {/* Top Section: Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <ProfessorHero member={teacher} />
      </motion.div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Main Content (Left) */}
        <div className="lg:col-span-8 space-y-8 order-2 lg:order-1">
          {/* Bio Section */}
          <Card className="bg-white p-5 md:p-10 rounded-xl border border-blue-100 shadow-xl shadow-gray-200/20 relative overflow-hidden group">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <User size={24} />
              </div>
              <h3 className="text-xl font-black text-[#1a1a3b]">Professional Bio</h3>
            </div>
            <p className="text-gray-500 font-medium leading-[1.8] text-[15px] relative z-10">
              {teacher.teacherProfile.bio || `${teacher.firstName} ${teacher.lastName} is a dedicated educator at ${teacher.universityId?.name}. They are committed to fostering academic growth and providing high-quality mentorship to students.`}
            </p>
            <div className="absolute -bottom-6 -right-6 opacity-[0.03] group-hover:scale-110 transition-transform duration-700 pointer-events-none">
              <ShieldCheck size={180} />
            </div>
          </Card>

          {/* Academic Expertise */}
          <Card className="bg-white p-5 rounded-xl border border-blue-100 shadow-xl shadow-gray-200/20">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <BookOpen size={24} />
              </div>
              <h3 className="text-xl font-black text-[#1a1a3b]">Core Subjects & Expertise</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {teacher.courseIds?.length > 0 ? teacher.courseIds.map((course: any) => (
                <div key={course._id} className="px-6 py-3 bg-gray-50 text-[#1a1a3b] text-xs font-black rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/50 transition-all cursor-default">
                  {course.courseName}
                </div>
              )) : (
                <p className="text-xs text-gray-400 font-bold italic">Specialized academic courses listed here.</p>
              )}
            </div>
          </Card>

          {/* Shared Resources */}
          <div className="space-y-6">
            <div className="flex items-center justify-between ">
              <div className="flex items-center gap-3">
                <Award className="text-indigo-600" size={24} />
                <h3 className="text-xl font-black text-[#1a1a3b]">Academic Resources</h3>
              </div>
            </div>
            <StudyResources />
          </div>

          {/* Pagination */}
          <div className="mt-12 flex items-center justify-center gap-3 px-4 py-8 border-t border-gray-50">
            <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl border-gray-100 bg-white"><ChevronLeft size={18} /></Button>
            {[1, 2, 3].map((page) => (
              <Button key={page} variant={page === 1 ? "default" : "outline"} className={`h-12 w-12 rounded-2xl font-black text-sm transition-all ${page === 1 ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "bg-white border-gray-100"}`}>{page}</Button>
            ))}
            <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl border-gray-100 bg-white"><ChevronRight size={18} /></Button>
          </div>
        </div>

        {/* Sidebar Sections (Right) */}
        <aside className="lg:col-span-4 space-y-8 order-1 lg:order-2">
          <div className="sticky top-20 space-y-8">
            <ScheduledClasses />
          </div>
        </aside>
      </div>
    </div>
  );
}
