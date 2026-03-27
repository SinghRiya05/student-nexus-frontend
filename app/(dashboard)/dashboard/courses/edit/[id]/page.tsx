"use client";

import CourseForm from "@/components/dashboard/courses/CourseForm";
import React from "react";

// Mock function to simulate fetching course by ID
const getCourseById = (id: string) => {
  return {
    id,
    name: "B.Tech Computer Science",
    universityId: "1", // Stanford
    duration: "4 Years",
    level: "Undergraduate",
    description: "A comprehensive study of computer systems, software engineering, and artificial intelligence.",
  };
};

export default function EditCoursePage({ params }: { params: { id: string } }) {
  const [course, setCourse] = React.useState<any>(null);

  React.useEffect(() => {
    // In a real app, this would be an API call
    const data = getCourseById(params.id);
    setCourse(data);
  }, [params.id]);

  if (!course) return <div className="p-8 text-slate-500 font-medium italic">Loading course details...</div>;

  return <CourseForm initialData={course} isEditing={true} />;
}
