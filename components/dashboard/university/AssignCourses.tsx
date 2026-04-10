"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppDispatch, useAppSelector } from "@/utils/hook";
import {
  Search,
  BookOpen,
  ArrowLeft,
  CheckCircle2,
  Trash2,
  Loader2,
  Filter,
  GraduationCap,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import { getAllCourses } from "@/features/course/courseThunk";
import { getCoursesByUniversityId, syncUniversityCourses } from "@/features/university/universityThunk";



export default function AssignCourses({ universityId }: { universityId?: string }) {
  const dispatch = useAppDispatch();
  const { courses } = useAppSelector((state) => state.course);
  const { assignedCoursesIds, universityLoading } = useAppSelector((state) => state.university);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isSyncing, setIsSyncing] = useState(false);

  // 1. Fetch all courses and already assigned courses on mount
  useEffect(() => {
    dispatch(getAllCourses());
    if (universityId) {
      dispatch(getCoursesByUniversityId(universityId));
    }
  }, [dispatch, universityId]);

  // 2. Sync local selectedIds with assignedCoursesIds from Redux once they are loaded
  useEffect(() => {
    if (assignedCoursesIds) {
      setSelectedIds(new Set(assignedCoursesIds));
    }
  }, [assignedCoursesIds]);

  // Filter courses based on search term
  const filteredCourses = useMemo(() => {
    return courses?.filter(
      (course) =>
        course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.course_short_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [courses, searchTerm]);

  // Handle selection toggles
  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleAll = () => {
    if (selectedIds.size === filteredCourses.length && filteredCourses.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredCourses.map((c) => c._id)));
    }
  };

  // 3. Real Sync Action
  const handleSyncCourses = async () => {
    if (!universityId) return;

    setIsSyncing(true);
    try {
      await dispatch(syncUniversityCourses({
        universityId,
        courseIds: Array.from(selectedIds)
      })).unwrap();
      
      toast.success("Courses synchronized successfully!");
      // Optionally re-fetch to ensure sync
      dispatch(getCoursesByUniversityId(universityId));
    } catch (error: any) {
      toast.error(error || "Failed to synchronize courses");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full hover:bg-slate-100"
          >
            <ArrowLeft className="h-5 w-5 text-slate-500" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Assign Courses</h1>
            <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5 font-medium">
              University Management <span className="text-slate-300">•</span> University ID: <span className="text-indigo-600 font-bold">{universityId || "NOT_FOUND"}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button
            onClick={handleSyncCourses}
            disabled={isSyncing || universityLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-10 px-6 rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center gap-2"
          >
            {isSyncing || (universityLoading && selectedIds.size === 0) ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Sync Changes ({selectedIds.size})
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden transition-all">
        {/* Table Filters/Search Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center text-sm">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by course name or code..."
                className="pl-9 h-10 border-slate-200 bg-white shadow-sm focus-visible:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="h-10 w-10 border-slate-200 bg-white">
              <Filter className="h-4 w-4 text-slate-500" />
            </Button>
          </div>

          <div className="text-slate-500 font-semibold uppercase tracking-widest text-[10px] hidden md:block">
            {filteredCourses?.length || 0} Courses available
          </div>
        </div>

        {/* Courses Table */}
        <div className="overflow-x-auto relative">
          {(universityLoading && selectedIds.size === 0) && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-slate-100 italic font-medium bg-white">
                <TableHead className="w-[50px] pl-6 py-4">
                  <Checkbox
                    checked={
                      filteredCourses?.length > 0 &&
                      selectedIds.size === filteredCourses.length
                    }
                    onCheckedChange={toggleAll}
                    className="border-slate-300"
                  />
                </TableHead>
                <TableHead className="font-black text-slate-800 uppercase tracking-widest text-[11px]">Course Details</TableHead>
                <TableHead className="font-black text-slate-800 uppercase tracking-widest text-[11px]">Short Name</TableHead>
                <TableHead className="font-black text-slate-800 uppercase tracking-widest text-[11px]">Duration</TableHead>
                <TableHead className="font-black text-slate-800 uppercase tracking-widest text-[11px]">Status</TableHead>
                <TableHead className="font-black text-slate-800 uppercase tracking-widest text-[11px] text-right pr-6">Selection</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses?.length > 0 ? (
                filteredCourses.map((course) => (
                  <TableRow
                    key={course._id}
                    className={`group transition-colors border-slate-100 ${selectedIds.has(course._id) ? "bg-indigo-50/40" : "hover:bg-slate-50/60"
                      }`}
                  >
                    <TableCell className="pl-6">
                      <Checkbox
                        checked={selectedIds.has(course._id)}
                        onCheckedChange={() => toggleSelection(course._id)}
                        className="border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                      />
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-sm bg-linear-to-tr ${selectedIds.has(course._id) ? "from-indigo-500 to-indigo-600" : "from-slate-400 to-slate-500 group-hover:from-indigo-400 group-hover:to-indigo-500"
                          }`}>
                          <BookOpen className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 group-hover:underline cursor-pointer tracking-tight underline-offset-4 decoration-indigo-200">
                            {course.courseName}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                            {course._id}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-200 font-bold px-2 py-0">
                        {course.course_short_name}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-600 font-medium whitespace-nowrap">
                      {course.durationYears} Years
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${course.status === 'Active' ? 'bg-green-500' : 'bg-slate-300'}`} />
                        <span className={`text-[11px] font-bold uppercase tracking-wider ${course.status === 'Active' ? 'text-green-600' : 'text-slate-400'}`}>
                          {course.status}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSelection(course._id)}
                        className={`text-[10px] font-black uppercase tracking-widest px-4 h-8 rounded-lg ${selectedIds.has(course._id)
                          ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                          : "text-indigo-600 hover:bg-indigo-50 font-bold"
                          }`}
                      >
                        {selectedIds.has(course._id) ? (
                          <span className="flex items-center gap-1.5">
                            <Trash2 className="h-3 w-3" />
                            Remove
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 font-bold">
                            <Plus size={14} className="mt-0.5" />
                            Select
                          </span>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3 opacity-30">
                      <GraduationCap size={48} className="text-slate-400" />
                      <div>
                        <p className="text-lg font-bold text-slate-900 tracking-tight">No courses found</p>
                        <p className="text-sm text-slate-500 font-medium">Try adjusting your search criteria</p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest py-4 px-2">
        <span>Selection Count: {selectedIds.size}</span>
        <span>© StudentNexus Institute Portal</span>
      </div>
    </div>
  );
}
