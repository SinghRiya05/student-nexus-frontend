"use client";

import PermissionForm from "@/components/dashboard/permissions/PermissionForm";
import React from "react";

// Mock function to simulate fetching session by ID
const getPermissionById = (id: string) => {
  return {
    id,
    name: "user.create",
    description: "Allows creating new users in the system.",
    module: "User",
  };
};

export default function EditPermissionPage({ params }: { params: { id: string } }) {
  const [permission, setPermission] = React.useState<any>(null);

  React.useEffect(() => {
    // In a real app, this would be an API call
    const data = getPermissionById(params.id);
    setPermission(data);
  }, [params.id]);

  if (!permission) return <div className="p-8 text-slate-500 font-medium italic">Loading permission details...</div>;

  return <PermissionForm initialData={permission} isEditing={true} />;
}
