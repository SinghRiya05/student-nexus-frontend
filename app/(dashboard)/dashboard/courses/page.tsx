"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Plus, BookOpen, GraduationCap, Building2, Globe, Clock, Calendar } from "lucide-react";

const courses = [
  {
    id: "1",
    name: "Master of Computer Science",
    university: "Stanford University",
    domain: "cs.stanford.edu",
    duration: "2 Years",
    country: "USA",
    createdAt: "2026-03-20",
  },
  {
    id: "2",
    name: "MBA",
    university: "Harvard University",
    domain: "hbs.edu",
    duration: "2 Years",
    country: "USA",
    createdAt: "2026-03-18",
  },
  {
    id: "3",
    name: "MSc in Data Science",
    university: "University of Oxford",
    domain: "ox.ac.uk",
    duration: "1 Year",
    country: "UK",
    createdAt: "2026-03-15",
  },
  {
    id: "4",
    name: "Bachelor of Engineering",
    university: "National University of Singapore",
    domain: "nus.edu.sg",
    duration: "4 Years",
    country: "Singapore",
    createdAt: "2026-03-10",
  },
  {
    id: "5",
    name: "M.Tech in AI",
    university: "IIT Bombay",
    domain: "iitb.ac.in",
    duration: "2 Years",
    country: "India",
    createdAt: "2026-03-05",
  },
];

export default function CoursesPage() {
  return (
    <div className="p-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-600">
            <BookOpen size={20} className="font-semibold" />
            <span className="text-sm font-bold uppercase tracking-wider">Academic Management</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Courses</h1>
          <p className="text-slate-500">Manage, edit and oversee all the courses available across different universities.</p>
        </div>
        <div>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100 px-6 py-6 rounded-xl transition-all hover:scale-[1.02]">
            <Plus className="mr-2 h-5 w-5" />
            Create New Course
          </Button>
        </div>
      </div>

      {/* Courses Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800">All Courses</h2>
            <div className="text-sm text-slate-400 font-medium">Total: {courses.length} courses</div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-slate-100">
                <TableHead className="w-[300px] font-bold text-slate-700 py-4">Course Name</TableHead>
                <TableHead className="font-bold text-slate-700">University</TableHead>
                <TableHead className="font-bold text-slate-700">Domain</TableHead>
                <TableHead className="font-bold text-slate-700">Duration</TableHead>
                <TableHead className="font-bold text-slate-700">Country</TableHead>
                <TableHead className="font-bold text-slate-700">Created At</TableHead>
                <TableHead className="text-right font-bold text-slate-700 pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id} className="group hover:bg-slate-50/50 transition-colors border-slate-100">
                  <TableCell className="font-medium py-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                            <BookOpen size={18} />
                        </div>
                        <span className="text-slate-900 font-semibold">{course.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-slate-600">
                        <Building2 size={14} className="text-slate-400" />
                        {course.university}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md font-medium">
                        {course.domain}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-slate-600">
                        <Clock size={14} className="text-slate-400" />
                        {course.duration}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-slate-600">
                        <Globe size={14} className="text-slate-400" />
                        {course.country}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-slate-600">
                        <Calendar size={14} className="text-slate-400" />
                        {course.createdAt}
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-200/50 rounded-full">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4 text-slate-600" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px] rounded-xl shadow-xl border-slate-100 p-1">
                        <DropdownMenuLabel className="text-xs text-slate-400 px-3 py-2">Actions</DropdownMenuLabel>
                        <DropdownMenuItem className="rounded-lg px-3 py-2 text-sm font-medium focus:bg-indigo-50 focus:text-indigo-600 cursor-pointer">
                          Edit Course
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-100" />
                        <DropdownMenuItem className="rounded-lg px-3 py-2 text-sm font-medium text-rose-600 focus:bg-rose-50 focus:text-rose-600 cursor-pointer">
                          Delete Course
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
