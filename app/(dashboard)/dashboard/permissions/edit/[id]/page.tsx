"use client";

import PermissionForm from "@/components/dashboard/permissions/PermissionForm";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/utils/hook";
import { useParams } from "next/navigation";
import { getPermissionById } from "@/features/permissions/permissionThunk";

export default function EditPermissionPage() {
  const dispatch = useAppDispatch();
  const { singlePermission } = useAppSelector((state) => state.permission);
  const params = useParams();

  React.useEffect(() => {
    if (params.id) {
      dispatch(getPermissionById(params.id as string));
    }
  }, [dispatch, params.id]);

  if (!singlePermission) {
    return (
      <div className="p-8 text-slate-500 font-medium italic">
        Loading permission details...
      </div>
    );
  }

  return <PermissionForm initialData={singlePermission} isEditing={true} />;
}
