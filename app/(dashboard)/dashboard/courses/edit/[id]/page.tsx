"use client";

import CourseForm from "@/components/dashboard/courses/CourseForm";
import { getCourseById } from "@/features/course/courseThunk";
import { useAppDispatch, useAppSelector } from "@/utils/hook";
import { useParams } from "next/navigation";
import React from "react";
import LoadingSpinner from "@/components/ui/loading";



export default function EditCoursePage() {
  const dispatch = useAppDispatch();
  const { singleCourse, courseLoading } = useAppSelector((state) => state.course);
  const params = useParams();

  React.useEffect(() => {
    dispatch(getCourseById(params.id as string));
  }, [params.id]);

  if (courseLoading || !singleCourse) return <LoadingSpinner fullPage label="Loading course details..." />;

  return <CourseForm initialData={singleCourse} isEditing={true} />;
}
