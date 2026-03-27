"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  BookOpen, 
  Building2, 
  Clock, 
  Layers,
  FileText,
  Info 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface CourseFormProps {
  initialData?: any;
  isEditing?: boolean;
}

const mockUniversities = [
  { id: "1", name: "Stanford University" },
  { id: "2", name: "Harvard University" },
  { id: "3", name: "MIT" },
  { id: "4", name: "LPU University" },
];

const courseLevels = [
  "Undergraduate",
  "Postgraduate",
  "Doctorate",
  "Diploma",
  "Certification",
];

export default function CourseForm({ initialData, isEditing }: CourseFormProps) {
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    name: initialData?.name || "",
    universityId: initialData?.universityId || "",
    duration: initialData?.duration || "",
    level: initialData?.level || "",
    description: initialData?.description || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // API CALL PLACE: Create/Update course
    console.log("Submitting course:", formData);
    router.push("/dashboard/courses");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
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
            {isEditing ? "Edit Course" : "Add New Course"}
          </h2>
          <p className="text-sm text-slate-500">
            {isEditing
              ? "Update course curriculum, duration, and affiliated university."
              : "Define a new academic program and its requirements."}
          </p>
        </div>
      </div>

      <Card className="border-none shadow-sm bg-white overflow-hidden">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Course Name */}
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="name" className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <BookOpen size={14} className="text-indigo-500" />
                  Course Name
                </Label>
                <Input
                  id="name"
                  placeholder="e.g. B.Tech Computer Science"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="rounded-xl border-slate-200 focus:ring-indigo-500 h-11"
                  required
                />
              </div>

              {/* University Selection */}
              <div className="space-y-2">
                <Label htmlFor="university" className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Building2 size={14} className="text-indigo-500" />
                  Affiliated University
                </Label>
                <Select
                  value={formData.universityId}
                  onValueChange={(val) => setFormData({ ...formData, universityId: val })}
                  required
                >
                  <SelectTrigger className="rounded-xl border-slate-200 h-11 focus:ring-indigo-500 bg-white">
                    <SelectValue placeholder="Select University" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                    {mockUniversities.map((uni) => (
                      <SelectItem key={uni.id} value={uni.id} className="rounded-lg focus:bg-indigo-50 focus:text-indigo-600">
                        {uni.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Course Level */}
              <div className="space-y-2">
                <Label htmlFor="level" className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Layers size={14} className="text-indigo-500" />
                  Academic Level
                </Label>
                <Select
                  value={formData.level}
                  onValueChange={(val) => setFormData({ ...formData, level: val })}
                  required
                >
                  <SelectTrigger className="rounded-xl border-slate-200 h-11 focus:ring-indigo-500 bg-white">
                    <SelectValue placeholder="Select Level" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                    {courseLevels.map((level) => (
                      <SelectItem key={level} value={level} className="rounded-lg focus:bg-indigo-50 focus:text-indigo-600">
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label htmlFor="duration" className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Clock size={14} className="text-indigo-500" />
                  Duration (e.g. 4 Years)
                </Label>
                <Input
                  id="duration"
                  placeholder="e.g. 4 Years"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="rounded-xl border-slate-200 focus:ring-indigo-500 h-11"
                  required
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="description" className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <FileText size={14} className="text-indigo-500" />
                  Course Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Provide a brief overview of the course curriculum and objectives..."
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                  className="rounded-xl border-slate-200 focus:ring-indigo-500 min-h-[120px]"
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
                {isEditing ? "Update Course" : "Add Course"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {/* Help Note */}
      <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 flex gap-4">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-emerald-500 shadow-sm shrink-0">
          <Info size={20} />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-emerald-900">Academic Programs</h4>
          <p className="text-xs text-emerald-700 leading-relaxed">
            Courses are the core of the student experience. Ensure levels and durations are standardized to help students filter effectively.
          </p>
        </div>
      </div>
    </div>
  );
}
