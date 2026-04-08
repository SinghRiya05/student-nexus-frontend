"use client";

import UniversityForm from "@/components/dashboard/university/UniversityForm";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/utils/hook";
import { getUniversityById } from "@/features/university/universityThunk";
import { useParams } from "next/navigation";
import LoadingSpinner from "@/components/ui/loading";



export default function EditUniversityPage() {
  const dispatch = useAppDispatch();
  const params = useParams();
  const { id } = params;
  const { singleUniversity, universityLoading } = useAppSelector((state) => state.university);
  React.useEffect(() => {
    dispatch(getUniversityById(id as string));
  }, [params.id]);

  if (universityLoading || !singleUniversity) return <LoadingSpinner fullPage label="Loading university details..." />;

  return <UniversityForm initialData={singleUniversity} isEditing={true} />;
}
