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
  LayoutGrid,
  Search
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
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left Section */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-600">
            <BookOpen size={18} />
            <span className="text-xs font-semibold uppercase tracking-widest">
              Academic Management
            </span>
          </div>

          <h2 className="text-xl font-bold text-slate-900">Courses</h2>

          <p className="text-sm text-slate-500">
            Manage, edit and oversee all the courses available across different
            universities.
          </p>
        </div>

        {/* Right Section */}
        <div className="flex w-full md:w-auto items-center gap-3 justify-between md:justify-end">
          {/* Search Bar */}
          <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 w-full sm:w-72">
            <Search size={16} className="ml-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search courses..."
              className="flex-1 px-2 py-2 outline-none text-sm bg-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 transition text-sm">
              Search
            </button>
          </div>

          {/* Create Button */}
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 h-10 rounded-lg whitespace-nowrap">
            <Plus className="mr-2 h-4 w-4" />
            Create
          </Button>
        </div>
      </div>

      {/* Courses Table Section */}
      <Card className="border-none shadow-sm bg-white overflow-hidden py-0">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-primary ">
                <TableRow className="hover:bg-transparent border-slate-100 ">
                  <TableHead className="w-[300px] font-bold text-white py-4">
                    Course Name
                  </TableHead>
                  <TableHead className="font-bold text-white">
                    University
                  </TableHead>
                  <TableHead className="font-bold text-white">Domain</TableHead>
                  <TableHead className="font-bold text-white">
                    Duration
                  </TableHead>
                  <TableHead className="font-bold text-white">Country</TableHead>
                  <TableHead className="font-bold text-white">
                    Created At
                  </TableHead>
                  <TableHead className="text-right font-bold text-white pr-8">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.map((course) => (
                  <TableRow
                    key={course.id}
                    className="group hover:bg-slate-50/50 transition-colors border-slate-100"
                  >
                    <TableCell className="font-medium py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                          <BookOpen size={18} />
                        </div>
                        <span className="text-slate-900 font-semibold">
                          {course.name}
                        </span>
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
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-slate-200/50 rounded-full"
                          >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4 text-slate-600" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-[160px] rounded-xl shadow-xl border-slate-100 p-1"
                        >
                          <DropdownMenuLabel className="text-xs text-slate-400 px-3 py-2 uppercase font-bold tracking-tight">
                            Actions
                          </DropdownMenuLabel>
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
          <div className="p-5">
            <p className="text-sm text-slate-400 ">
              Total: {filteredCourses.length} courses registered
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

