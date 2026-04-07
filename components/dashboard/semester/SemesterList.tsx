"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppDispatch, useAppSelector } from "@/utils/hook";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Plus,
  CalendarCheck,
  Clock,
  Layers,
  CheckCircle2,
  AlertCircle,
  Search,
  ChevronDown
} from "lucide-react";
import { deleteSemester, getAllSemesters } from "@/features/semester/semesterThunk";
import { getAllCourses } from "@/features/course/courseThunk";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/ui/loading";



export default function SemesterList() {
  const dispatch = useAppDispatch();
  const { semesters, isLoading, error } = useAppSelector((state) => state.semester);
  const { courses } = useAppSelector((state) => state.course);
  useEffect(() => {
    dispatch(getAllSemesters());
    dispatch(getAllCourses())
  }, [dispatch]);


  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this semester?")) {
      dispatch(deleteSemester(id));
      toast.success("Semester deleted successfully");
    }
  }

  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCourse, setSelectedCourse] = React.useState("all");

  const filteredSemesters = semesters.filter((sem) => {
    const matchesSearch =
      sem.courseId?.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sem.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCourse = selectedCourse === "all" || sem.courseId.courseName === selectedCourse;

    return matchesSearch && matchesCourse;
  });

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left Section */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-600">
            <CalendarCheck size={18} />
            <span className="text-xs font-semibold uppercase tracking-widest">
              Schedule Management
            </span>
          </div>

          <h2 className="text-xl font-bold text-slate-900">Semesters</h2>

          <p className="text-sm text-slate-500">
            Manage academic periods, schedules and term-wise course offerings.
          </p>
        </div>

        {/* Right Section */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          {/* Course Dropdown */}
          <div className="w-full sm:w-64">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between bg-white border-slate-300 rounded-lg h-11 focus:ring-2 focus:ring-indigo-500 font-medium">
                  {selectedCourse === "all" ? "All Courses" : selectedCourse}
                  <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 rounded-xl shadow-xl border-slate-100 p-1">
                <DropdownMenuLabel className="text-xs text-slate-400 px-3 py-2 uppercase font-bold tracking-tight">
                  Filter by Course
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={selectedCourse} onValueChange={setSelectedCourse}>
                  <DropdownMenuRadioItem value="all" className="rounded-lg px-3 py-2 text-sm font-medium focus:bg-indigo-50 focus:text-indigo-600">
                    All Courses
                  </DropdownMenuRadioItem>
                  {courses.map((course) => (
                    <DropdownMenuRadioItem key={course._id} value={course.courseName} className="rounded-lg px-3 py-2 text-sm font-medium focus:bg-indigo-50 focus:text-indigo-600">
                      {course.courseName}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Search Bar */}
          <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 w-full sm:w-72 bg-white h-11">
            <Search size={16} className="ml-3 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search semesters..."
              className="flex-1 px-2 py-2 outline-none text-sm bg-transparent w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Create Button */}
          <Link href="/dashboard/semester/create">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 h-11 rounded-lg whitespace-nowrap w-full sm:w-auto shadow-sm">
              <Plus className="mr-2 h-4 w-4" />
              Create
            </Button>
          </Link>
        </div>
      </div>

      {/* Semester Table Section */}
      <Card className="border-none shadow-sm bg-white overflow-hidden py-0">
        <CardContent className="p-0">
          {isLoading ? (
            <LoadingSpinner label="Loading Semesters..." />
          ) : filteredSemesters.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-20 space-y-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300">
                <Layers size={32} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-slate-900">No Semesters Found</h3>
                <p className="text-sm text-slate-500 max-w-xs mx-auto">
                  {selectedCourse !== "all" 
                    ? `No semesters found for ${selectedCourse}.` 
                    : "Wait for the admin to add academic terms."}
                </p>
              </div>
              <Link href="/dashboard/semester/create">
                <Button variant="outline" size="sm" className="mt-2">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Semester
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-primary ">
                    <TableRow className="hover:bg-transparent border-slate-100 ">
                      <TableHead className="text-center font-bold text-white py-4 ">
                        Sem No.
                      </TableHead>
                      <TableHead className="text-center font-bold text-white py-4 ">
                        Sem Name
                      </TableHead>
                      <TableHead className="font-bold text-center text-white">Course</TableHead>
                      <TableHead className="font-bold text-center text-white">
                        Created At
                      </TableHead>
                      <TableHead className="text-center font-bold text-white pr-8">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSemesters.map((sem) => (
                      <TableRow
                        key={sem._id}
                        className="group hover:bg-slate-50/50 transition-colors border-slate-100"
                      >
                        <TableCell className="text-center py-5">
                          <div className="flex items-center justify-center">
                            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold group-hover:bg-indigo-100 transition-colors scale-90 sm:scale-100">
                              {sem.number}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center py-5">
                          <div className="flex items-center justify-center">
                            <div className="w-10 h-10 rounded-lg  flex items-center justify-center text-indigo-600 font-bold  transition-colors scale-90 sm:scale-100">
                              {sem.name}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-center">
                          <div className="flex flex-col">
                            <span className="text-slate-900 font-semibold">
                              {sem.courseId.courseName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                            {new Date(sem.createdAt).toLocaleDateString()}
                          </span>
                        </TableCell>

                        <TableCell className="text-center pr-8">
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
                              <Link href={`/dashboard/semester/edit/${sem._id}`}>
                                <DropdownMenuItem className="rounded-lg px-3 py-2 text-sm font-medium focus:bg-indigo-50 focus:text-indigo-600 cursor-pointer">
                                  Edit Period
                                </DropdownMenuItem>
                              </Link>
                              <DropdownMenuSeparator className="bg-slate-100" />
                              <DropdownMenuItem onClick={() => handleDelete(sem._id)} className="rounded-lg px-3 py-2 text-sm font-medium text-rose-600 focus:bg-rose-50 focus:text-rose-600 cursor-pointer">
                                Delete Semester
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="p-5 flex items-center justify-between border-t border-slate-50">
                <p className="text-sm text-slate-400 ">
                  Showing {filteredSemesters.length} semesters
                  {selectedCourse !== "all" && (
                    <span> for <span className="text-indigo-600 font-medium">{selectedCourse}</span></span>
                  )}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


