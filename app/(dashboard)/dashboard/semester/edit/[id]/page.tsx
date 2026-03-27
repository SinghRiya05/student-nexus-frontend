"use client";

import SemesterForm from "@/components/dashboard/semester/SemesterForm";
import React from "react";

// Mock function to simulate fetching semester by ID
const getSemesterById = (id: string) => {
  return {
    id,
    semesterNo: "1",
    courseId: "1", // B.Tech Computer Science
    startYear: 2023,
    endYear: 2024,
  };
};

export default function EditSemesterPage({ params }: { params: { id: string } }) {
  const [semester, setSemester] = React.useState<any>(null);

  React.useEffect(() => {
    // In a real app, this would be an API call
    const data = getSemesterById(params.id);
    setSemester(data);
  }, [params.id]);

  if (!semester) return <div className="p-8 text-slate-500 font-medium italic">Loading semester details...</div>;

  return <SemesterForm initialData={semester} isEditing={true} />;
}
