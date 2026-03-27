"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ArrowLeft, 
  Save, 
  Layers, 
  BookOpen, 
  Calendar,
  Clock,
  Info 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SemesterFormProps {
  initialData?: any;
  isEditing?: boolean;
}

const mockCourses = [
  { id: "1", name: "B.Tech Computer Science" },
  { id: "2", name: "MBA Marketing" },
  { id: "3", name: "M.Sc Physics" },
];

export default function SemesterForm({ initialData, isEditing }: SemesterFormProps) {
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    semesterNo: initialData?.semesterNo || "",
    courseId: initialData?.courseId || "",
    startYear: initialData?.startYear || new Date().getFullYear(),
    endYear: initialData?.endYear || new Date().getFullYear() + 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // API CALL PLACE: Create/Update semester
    console.log("Submitting semester:", formData);
    router.push("/dashboard/semester");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="group -ml-3 text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to List
          </Button>
          <h2 className="text-2xl font-bold text-slate-900">
            {isEditing ? "Edit Semester" : "Add New Semester"}
          </h2>
          <p className="text-sm text-slate-500">
            {isEditing
              ? "Update semester numbering and academic year associations."
              : "Define a new academic term for a specific course."}
          </p>
        </div>
      </div>

      <Card className="border-none shadow-sm bg-white overflow-hidden">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Semester Number */}
              <div className="space-y-2">
                <Label htmlFor="semesterNo" className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Layers size={14} className="text-indigo-500" />
                  Semester Number
                </Label>
                <Input
                  id="semesterNo"
                  type="number"
                  min={1}
                  max={12}
                  placeholder="e.g. 1, 2, 3"
                  value={formData.semesterNo}
                  onChange={(e) => setFormData({ ...formData, semesterNo: e.target.value })}
                  className="rounded-xl border-slate-200 focus:ring-indigo-500 h-11"
                  required
                />
              </div>

              {/* Course Selection */}
              <div className="space-y-2">
                <Label htmlFor="course" className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <BookOpen size={14} className="text-indigo-500" />
                  Associated Course
                </Label>
                <Select
                  value={formData.courseId}
                  onValueChange={(val) => setFormData({ ...formData, courseId: val })}
                  required
                >
                  <SelectTrigger className="rounded-xl border-slate-200 h-11 focus:ring-indigo-500 bg-white">
                    <SelectValue placeholder="Select Course" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                    {mockCourses.map((c) => (
                      <SelectItem key={c.id} value={c.id} className="rounded-lg focus:bg-indigo-50 focus:text-indigo-600">
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Start Year */}
              <div className="space-y-2">
                <Label htmlFor="startYear" className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Calendar size={14} className="text-indigo-500" />
                  Start Year
                </Label>
                <Input
                  id="startYear"
                  type="number"
                  placeholder="e.g. 2023"
                  value={formData.startYear}
                  onChange={(e) => setFormData({ ...formData, startYear: parseInt(e.target.value) })}
                  className="rounded-xl border-slate-200 focus:ring-indigo-500 h-11"
                  required
                />
              </div>

              {/* End Year */}
              <div className="space-y-2">
                <Label htmlFor="endYear" className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Clock size={14} className="text-indigo-500" />
                  End Year
                </Label>
                <Input
                  id="endYear"
                  type="number"
                  placeholder="e.g. 2024"
                  value={formData.endYear}
                  onChange={(e) => setFormData({ ...formData, endYear: parseInt(e.target.value) })}
                  className="rounded-xl border-slate-200 focus:ring-indigo-500 h-11"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 px-8 h-12 font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-10 h-12 font-semibold shadow-lg shadow-indigo-100"
              >
                <Save className="mr-2 h-4 w-4" />
                {isEditing ? "Update Semester" : "Add Semester"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {/* Help Note */}
      <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 flex gap-4">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-500 shadow-sm shrink-0">
          <Info size={20} />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-blue-900">Academic Cycles</h4>
          <p className="text-xs text-blue-700 leading-relaxed">
            Semesters are the granular time units for academic tracking. Correct start and end years are crucial for generating valid student transcripts and session reports.
          </p>
        </div>
      </div>
    </div>
  );
}
