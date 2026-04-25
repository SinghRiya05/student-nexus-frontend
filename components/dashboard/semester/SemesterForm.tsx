"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller, useWatch } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/utils/hook";
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
  BadgeCheck,
  Hash,
  Info,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { createSemester, updateSemester } from "@/features/semester/semesterThunk";
import { getAllCourses } from "@/features/course/courseThunk";
import toast from "react-hot-toast";

interface FormValues {
  number: number;
  courseId: string;
  name: string;
  status: "ACTIVE" | "INACTIVE";
}

interface SemesterFormProps {
  initialData?: any;
  isEditing?: boolean;
}

// Semester name map for semesters 1–8
const SEMESTER_NAMES: Record<number, string> = {
  1: "Semester 1",
  2: "Semester 2",
  3: "Semester 3",
  4: "Semester 4",
  5: "Semester 5",
  6: "Semester 6",
  7: "Semester 7",
  8: "Semester 8",
};

export default function SemesterForm({ initialData, isEditing }: SemesterFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [nameAutoFilled, setNameAutoFilled] = React.useState(false);

  const { courses } = useAppSelector((s) => s.course);

  // Fetch courses for the dropdown
  useEffect(() => {
    dispatch(getAllCourses());
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      number: initialData?.number || 1,
      courseId:
        typeof initialData?.courseId === "object"
          ? initialData.courseId._id
          : initialData?.courseId || "",
      name: initialData?.name || "",
      status: (initialData?.status as "ACTIVE" | "INACTIVE") || "ACTIVE",
    },
  });

  // Watch semester number and auto-fill name
  const watchedNumber = useWatch({ control, name: "number" });
  useEffect(() => {
    const autoName = SEMESTER_NAMES[Number(watchedNumber)];
    if (autoName) {
      setValue("name", autoName);
      setNameAutoFilled(true);
    } else {
      setNameAutoFilled(false);
    }
  }, [watchedNumber, setValue]);

  // Re-sync when initialData changes (edit page)
  useEffect(() => {
    if (!initialData) return;
    reset({
      number: initialData.number || 1,
      courseId:
        typeof initialData.courseId === "object"
          ? initialData.courseId._id
          : initialData.courseId || "",
      name: initialData.name || "",
      status: (initialData.status as "ACTIVE" | "INACTIVE") || "ACTIVE",
    });
  }, [initialData, reset]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const payload = { ...data, number: Number(data.number) };

      if (isEditing && initialData?._id) {
        await dispatch(updateSemester({ id: initialData._id, semesterData: payload })).unwrap();
        toast.success("Semester updated successfully!");
      } else {
        await dispatch(createSemester(payload)).unwrap();
        toast.success("Semester created successfully!");
      }
      router.push("/dashboard/semester");
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
          {isEditing ? "Edit Semester" : "Add New Semester"}
        </h2>
        <p className="text-sm text-slate-500">
          {isEditing
            ? "Update semester details and course association."
            : "Define a new academic term for a specific course."}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center gap-2 text-indigo-600 mb-2">
              <Layers size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">Semester Details</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Semester Number — dropdown 1–8 */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                  <Hash size={13} className="text-indigo-400" />
                  Semester No. <span className="text-rose-500">*</span>
                </Label>
                <Controller
                  control={control}
                  name="number"
                  rules={{ required: "Semester number is required" }}
                  render={({ field }) => (
                    <Select
                      value={String(field.value)}
                      onValueChange={(val) => field.onChange(Number(val))}
                    >
                      <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white">
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                        {Object.entries(SEMESTER_NAMES).map(([num, label]) => (
                          <SelectItem
                            key={num}
                            value={num}
                            className="rounded-lg focus:bg-indigo-50 focus:text-indigo-600"
                          >
                            <span className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-md bg-indigo-50 text-indigo-600 font-black text-[10px] flex items-center justify-center shrink-0">
                                {num}
                              </span>
                              {label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.number && (
                  <p className="text-xs text-rose-500">{errors.number.message}</p>
                )}
              </div>

              {/* Associated Course */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                  <BookOpen size={13} className="text-indigo-400" />
                  Associated Course <span className="text-rose-500">*</span>
                </Label>
                <Controller
                  control={control}
                  name="courseId"
                  rules={{ required: "Please select a course" }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white">
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-100 shadow-xl max-h-60 overflow-y-auto">
                        {courses.map((c) => (
                          <SelectItem
                            key={c._id}
                            value={c._id}
                            className="rounded-lg focus:bg-indigo-50 focus:text-indigo-600"
                          >
                            {c.courseName}
                            {c.course_short_name && (
                              <span className="ml-2 text-slate-400 text-xs">({c.course_short_name})</span>
                            )}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.courseId && (
                  <p className="text-xs text-rose-500">{errors.courseId.message}</p>
                )}
              </div>

              {/* Semester Name — auto-filled from number */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Layers size={13} className="text-indigo-400" />
                  Semester Name <span className="text-rose-500">*</span>
                  {nameAutoFilled && (
                    <span className="ml-auto text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                      Auto-filled
                    </span>
                  )}
                </Label>
                <Input
                  id="name"
                  placeholder="e.g. First Semester"
                  className="h-11 rounded-xl border-slate-200"
                  {...register("name", { required: "Semester name is required" })}
                  onChange={(e) => {
                    register("name").onChange(e);
                    setNameAutoFilled(false); // user manually edited
                  }}
                />
                <p className="text-[10px] text-slate-400 font-medium">
                  Auto-filled when you pick a semester number. You can override it.
                </p>
                {errors.name && (
                  <p className="text-xs text-rose-500">{errors.name.message}</p>
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
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-10 h-12 font-semibold shadow-lg shadow-indigo-100 min-w-[160px]"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </div>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isEditing ? "Update Semester" : "Add Semester"}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help Note */}
        <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100 flex gap-4">
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-blue-500 shadow-sm shrink-0">
            <Info size={18} />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-blue-900">Academic Cycles</h4>
            <p className="text-xs text-blue-700 leading-relaxed">
              Semesters are linked directly to courses. Make sure the course exists before creating a semester. Each course can have multiple semesters numbered sequentially.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
