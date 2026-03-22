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
  CalendarCheck, 
  Clock, 
  Layers,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const semesters = [
  {
    id: "1",
    name: "Fall 2025",
    startDate: "2025-09-01",
    endDate: "2025-12-20",
    status: "Active",
    courses: "45",
    students: "1,200",
  },
  {
    id: "2",
    name: "Spring 2026",
    startDate: "2026-01-15",
    endDate: "2026-05-30",
    status: "Planning",
    courses: "38",
    students: "950",
  },
  {
    id: "3",
    name: "Summer 2026",
    startDate: "2026-06-01",
    endDate: "2026-08-15",
    status: "Archived",
    courses: "12",
    students: "300",
  },
  {
    id: "4",
    name: "Fall 2026",
    startDate: "2026-09-01",
    endDate: "2026-12-20",
    status: "Planning",
    courses: "0",
    students: "0",
  },
];

export default function SemesterList() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <Card className="border-none shadow-sm bg-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600" />
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between p-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-600">
              <CalendarCheck size={18} className="font-semibold" />
              <span className="text-xs font-bold uppercase tracking-wider">Schedule Management</span>
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">Semesters</CardTitle>
            <CardDescription className="text-slate-500">Manage academic periods, schedules and term-wise course offerings.</CardDescription>
          </div>
          <div>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100 px-6 h-12 rounded-xl transition-all hover:scale-[1.02]">
              <Plus className="mr-2 h-5 w-5" />
              Create Semester
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Semester Table Section */}
      <Card className="border-none shadow-sm bg-white overflow-hidden">
        <CardHeader className="p-6 border-b border-slate-50 flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-xl font-semibold text-slate-800">Academic Terms</CardTitle>
            <p className="text-sm text-slate-400 mt-1">Total: {semesters.length} semesters configured</p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-slate-100">
                  <TableHead className="w-[300px] font-bold text-slate-700 py-4">Semester Name</TableHead>
                  <TableHead className="font-bold text-slate-700">Duration</TableHead>
                  <TableHead className="font-bold text-slate-700 text-center">Courses</TableHead>
                  <TableHead className="font-bold text-slate-700 text-center">Enrollments</TableHead>
                  <TableHead className="font-bold text-slate-700">Status</TableHead>
                  <TableHead className="text-right font-bold text-slate-700 pr-8">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {semesters.map((sem) => (
                  <TableRow key={sem.id} className="group hover:bg-slate-50/50 transition-colors border-slate-100">
                    <TableCell className="font-medium py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                          <Layers size={18} />
                        </div>
                        <span className="text-slate-900 font-semibold">{sem.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Clock size={12} className="text-slate-400" />
                          <span className="font-medium">{sem.startDate} — {sem.endDate}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-bold text-slate-700">
                       {sem.courses}
                    </TableCell>
                    <TableCell className="text-center font-bold text-slate-700">
                       {sem.students}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.7rem] font-bold uppercase tracking-wider border ${
                        sem.status === "Active" 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                        : sem.status === "Planning"
                        ? "bg-blue-50 text-blue-700 border-blue-100"
                        : "bg-slate-50 text-slate-600 border-slate-100"
                      }`}>
                        {sem.status === "Active" && <CheckCircle2 size={12} />}
                        {sem.status === "Planning" && <AlertCircle size={12} />}
                        {sem.status}
                      </span>
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
                            Edit Period
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-slate-100" />
                          <DropdownMenuItem className="rounded-lg px-3 py-2 text-sm font-medium text-rose-600 focus:bg-rose-50 focus:text-rose-600 cursor-pointer">
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
        </CardContent>
      </Card>
    </div>
  );
}
