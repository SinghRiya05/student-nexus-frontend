"use client";

import RoleForm from "@/components/dashboard/roles/RoleForm";
import React from "react";

// Mock function to simulate fetching role by ID
const getRoleById = (id: string) => {
  return {
    id,
    name: "Teacher",
    description: "Access to courses, students, and semester management.",
    permissions: ["1", "2", "7", "8"], // IDs of assigned permissions
  };
};

export default function EditRolePage({ params }: { params: { id: string } }) {
  const [role, setRole] = React.useState<any>(null);

  React.useEffect(() => {
    // In a real app, this would be an API call
    const data = getRoleById(params.id);
    setRole(data);
  }, [params.id]);

  if (!role) return <div className="p-8 text-slate-500 font-medium italic">Loading role details...</div>;

  return <RoleForm initialData={role} isEditing={true} />;
}
