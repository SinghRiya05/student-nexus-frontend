"use client";

import React, { useEffect } from "react";
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
import { useAppDispatch, useAppSelector } from "@/utils/hook";
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
} from "@/components/ui/card";
import Link from "next/link";
import { deleteCourse, getAllCourses } from "@/features/course/courseThunk";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/ui/loading";


export default function CourseList() {
  const dispatch = useAppDispatch();
  const { courses, courseLoading, courseError } = useAppSelector((state) => state.course);

  useEffect(() => {
    dispatch(getAllCourses())
  }, [dispatch])
  const [searchTerm, setSearchTerm] = React.useState("");

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this course?")) {
      dispatch(deleteCourse(id));
      toast.success("Course deleted successfully");
    }

  }
  const filteredCourses = courses.filter((course) =>
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.course_short_name.toLowerCase().includes(searchTerm.toLowerCase())
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
          </div>

          {/* Create Button */}
          <Link href="/dashboard/courses/create">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 h-10 rounded-lg whitespace-nowrap">
              <Plus className="mr-2 h-4 w-4" />
              Create
            </Button>
          </Link>
        </div>
      </div>

      {/* Courses Table Section */}
      <Card className="border-none shadow-sm bg-white overflow-hidden py-0">
        <CardContent className="p-0">
          {courseLoading ? (
            <LoadingSpinner label="Loading Courses..." />
          ) : filteredCourses.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-20 space-y-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300">
                <BookOpen size={32} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-slate-900">No Courses Found</h3>
                <p className="text-sm text-slate-500 max-w-xs mx-auto">
                  {searchTerm 
                    ? `No courses matching "${searchTerm}" were found.` 
                    : "Academic programs list is currently empty."}
                </p>
              </div>
              <Link href="/dashboard/courses/create">
                <Button variant="outline" size="sm" className="mt-2">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Course
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-primary ">
                    <TableRow className="hover:bg-transparent border-slate-100 ">
                      <TableHead className=" font-bold text-white py-4">
                        Course Name
                      </TableHead>
                      <TableHead className=" font-bold text-white py-4">
                        Short Name
                      </TableHead>

                      <TableHead className="font-bold text-white">
                        Duration
                      </TableHead>
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
                        key={course._id}
                        className="group hover:bg-slate-50/50 transition-colors border-slate-100"
                      >
                        <TableCell className="font-medium py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                              <BookOpen size={18} />
                            </div>
                            <span className="text-slate-900 font-semibold">
                              {course.courseName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-slate-600">
                            <Building2 size={14} className="text-slate-400" />
                            {course.course_short_name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md font-semibold border border-indigo-100">
                            {course.durationYears}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-slate-600">
                            <Clock size={14} className="text-slate-400" />
                            {new Date(course.createdAt).toISOString().split('T')[0]}
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
                              <Link href={`/dashboard/courses/edit/${course._id}`}>
                                <DropdownMenuItem className="rounded-lg px-3 py-2 text-sm font-medium focus:bg-indigo-50 focus:text-indigo-600 cursor-pointer">
                                  Edit Course
                                </DropdownMenuItem>
                              </Link>
                              <DropdownMenuSeparator className="bg-slate-100" />
                              <DropdownMenuItem onClick={() => handleDelete(course._id)} className="rounded-lg px-3 py-2 text-sm font-medium text-rose-600 focus:bg-rose-50 focus:text-rose-600 cursor-pointer">
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

