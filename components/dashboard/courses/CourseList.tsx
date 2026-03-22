"use client";

import React from "react";
import {
  Table,
  TableBody,
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
import { 
  MoreHorizontal, 
  Plus, 
  BookOpen, 
  Building2, 
  Globe, 
  Clock, 
  Calendar,
  LayoutGrid
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

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

export default function CourseList() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <Card className="border-none shadow-sm bg-white overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600" />
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between p-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-600">
              <BookOpen size={18} className="font-semibold" />
              <span className="text-xs font-bold uppercase tracking-wider">Academic Management</span>
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">Courses</CardTitle>
            <CardDescription className="text-slate-500">Manage, edit and oversee all the courses available across different universities.</CardDescription>
          </div>
          <div>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100 px-6 h-12 rounded-xl transition-all hover:scale-[1.02]">
              <Plus className="mr-2 h-5 w-5" />
              Create New Course
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Courses Table Section */}
      <Card className="border-none shadow-sm bg-white overflow-hidden">
        <CardHeader className="p-6 border-b border-slate-50 flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-xl font-semibold text-slate-800">All Courses</CardTitle>
            <p className="text-sm text-slate-400 mt-1">Total: {courses.length} courses registered</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-lg h-9">
              <LayoutGrid size={14} className="mr-2" />
              Grid View
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
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
                      <span className="text-sm text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md font-semibold border border-indigo-100">
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
                          <DropdownMenuLabel className="text-xs text-slate-400 px-3 py-2 uppercase font-bold tracking-tight">Actions</DropdownMenuLabel>
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
        </CardContent>
      </Card>
    </div>
  );
}
