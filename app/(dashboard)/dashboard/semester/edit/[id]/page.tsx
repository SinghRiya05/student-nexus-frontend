"use client";

import SemesterForm from "@/components/dashboard/semester/SemesterForm";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/utils/hook";
import { getSemesterById } from "@/features/semester/semesterThunk";
import { useParams } from "next/navigation";
import LoadingSpinner from "@/components/ui/loading";



export default function EditSemesterPage() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const { singleSemester, isLoading } = useAppSelector((state) => state.semester);

  React.useEffect(() => {
    dispatch(getSemesterById(params.id as string)).unwrap().catch((error) => {
      console.log(error);
    });
  }, [params.id]);

  if (isLoading || !singleSemester) return <LoadingSpinner fullPage label="Loading semester details..." />;

  return <SemesterForm initialData={singleSemester} isEditing={true} />;
} 
