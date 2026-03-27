"use client";

import StateForm from "@/components/dashboard/state/StateForm";
import React from "react";

// Mock function to simulate fetching state by ID
const getStateById = (id: string) => {
  return {
    id,
    name: "California",
    countryId: "1", // United States
    code: "CA",
  };
};

export default function EditStatePage({ params }: { params: { id: string } }) {
  const [stateData, setStateData] = React.useState<any>(null);

  React.useEffect(() => {
    // In a real app, this would be an API call
    const data = getStateById(params.id);
    setStateData(data);
  }, [params.id]);

  if (!stateData) return <div className="p-8 text-slate-500 font-medium italic">Loading state details...</div>;

  return <StateForm initialData={stateData} isEditing={true} />;
}
