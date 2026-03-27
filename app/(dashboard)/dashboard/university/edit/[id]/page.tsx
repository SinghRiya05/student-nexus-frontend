"use client";

import UniversityForm from "@/components/dashboard/university/UniversityForm";
import React from "react";

// Mock function to simulate fetching university by ID
const getUniversityById = (id: string) => {
  return {
    id,
    name: "LPU University",
    countryId: "2", // India
    stateId: "2", // Maharashtra
    website: "https://www.lpu.in",
    logo: "https://v1.lpu.in/images/logo.png",
  };
};

export default function EditUniversityPage({ params }: { params: { id: string } }) {
  const [university, setUniversity] = React.useState<any>(null);

  React.useEffect(() => {
    // In a real app, this would be an API call
    const data = getUniversityById(params.id);
    setUniversity(data);
  }, [params.id]);

  if (!university) return <div className="p-8 text-slate-500 font-medium italic">Loading university details...</div>;

  return <UniversityForm initialData={university} isEditing={true} />;
}
