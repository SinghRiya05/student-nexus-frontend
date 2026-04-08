"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { useAppDispatch } from "@/utils/hook";
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
  Clock,
  FileText,
  Info,
  BadgeCheck,
  Tag,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { createCourse, updateCourse } from "@/features/course/courseThunk";
import toast from "react-hot-toast";

interface FormValues {
  courseName: string;
  course_short_name: string;
  durationYears: number;
  status: "ACTIVE" | "INACTIVE";
  description: string;
}

interface CourseFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export default function CourseForm({ initialData, isEditing }: CourseFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      courseName: initialData?.courseName || "",
      course_short_name: initialData?.course_short_name || "",
      durationYears: initialData?.durationYears || 1,
      status: initialData?.status || "ACTIVE",
      description: initialData?.description || "",
    },
  });

  // Re-sync form when initialData changes (e.g. after update)
  useEffect(() => {
    if (!initialData) return;
    reset({
      courseName: initialData.courseName || "",
      course_short_name: initialData.course_short_name || "",
      durationYears: initialData.durationYears || 1,
      status: initialData.status || "ACTIVE",
      description: initialData.description || "",
    });
  }, [initialData, reset]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        durationYears: Number(data.durationYears),
      };

      if (isEditing && initialData?._id) {
        await dispatch(updateCourse({ id: initialData._id, courseData: payload })).unwrap();
        toast.success("Course updated successfully!");
      } else {
        await dispatch(createCourse(payload)).unwrap();
        toast.success("Course created successfully!");
      }
      router.push("/dashboard/courses");
    } catch (err: any) {
      toast.error(err || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <Button
          type="button"
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
            ? "Update the course details below."
            : "Define a new academic program and its basic information."}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center gap-2 text-indigo-600 mb-2">
              <BookOpen size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">Course Details</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Course Name */}
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="courseName" className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                  <BookOpen size={13} className="text-indigo-400" />
                  Course Name <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="courseName"
                  placeholder="e.g. Bachelor of Technology in Computer Science"
                  className="h-11 rounded-xl border-slate-200"
                  {...register("courseName", { required: "Course name is required" })}
                />
                {errors.courseName && (
                  <p className="text-xs text-rose-500">{errors.courseName.message}</p>
                )}
              </div>

              {/* Course Short Name */}
              <div className="space-y-2">
                <Label htmlFor="course_short_name" className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                  <Tag size={13} className="text-indigo-400" />
                  Short Name / Abbreviation <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="course_short_name"
                  placeholder="e.g. B.Tech CS, MBA, MCA"
                  className="h-11 rounded-xl border-slate-200"
                  {...register("course_short_name", { required: "Short name is required" })}
                />
                {errors.course_short_name && (
                  <p className="text-xs text-rose-500">{errors.course_short_name.message}</p>
                )}
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label htmlFor="durationYears" className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                  <Clock size={13} className="text-indigo-400" />
                  Duration (Years) <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="durationYears"
                  type="number"
                  min={1}
                  max={10}
                  placeholder="e.g. 4"
                  className="h-11 rounded-xl border-slate-200"
                  {...register("durationYears", {
                    required: "Duration is required",
                    min: { value: 1, message: "Minimum duration is 1 year" },
                    max: { value: 10, message: "Maximum duration is 10 years" },
                  })}
                />
                {errors.durationYears && (
                  <p className="text-xs text-rose-500">{errors.durationYears.message}</p>
                )}
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                  <BadgeCheck size={13} className="text-indigo-400" />
                  Status
                </Label>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                        <SelectItem value="ACTIVE" className="rounded-lg focus:bg-indigo-50 focus:text-indigo-600">
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                            Active
                          </span>
                        </SelectItem>
                        <SelectItem value="INACTIVE" className="rounded-lg focus:bg-rose-50 focus:text-rose-600">
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
                            Inactive
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                  <FileText size={13} className="text-indigo-400" />
                  Course Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Provide a brief overview of the course curriculum and objectives..."
                  rows={4}
                  className="rounded-xl border-slate-200 resize-none"
                  {...register("description")}
                />
              </div>
            </div>

            {/* Actions */}
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
                disabled={isSubmitting}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-10 h-12 font-semibold shadow-lg shadow-indigo-100 min-w-[150px]"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </div>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isEditing ? "Update Course" : "Add Course"}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help Note */}
        <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100 flex gap-4">
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-emerald-500 shadow-sm shrink-0">
            <Info size={18} />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-emerald-900">Academic Programs</h4>
            <p className="text-xs text-emerald-700 leading-relaxed">
              Courses are the core of the student experience. Ensure names and durations are standardized to help students filter effectively.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
