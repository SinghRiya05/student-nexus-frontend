"use client";

import RoleForm from "@/components/dashboard/roles/RoleForm";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/utils/hook";
import { useParams } from "next/navigation";
import { getRoleById } from "@/features/roles/roleThunk";


export default function EditRolePage() {
  const dispatch = useAppDispatch();
  const { singleRole } = useAppSelector((state) => state.role);
  const params = useParams();

  React.useEffect(() => {
    dispatch(getRoleById(params.id as string))
  }, [params.id]);

  if (!singleRole) return <div className="p-8 text-slate-500 font-medium italic">Loading role details...</div>;

  return <RoleForm initialData={singleRole} isEditing={true} />;
}
