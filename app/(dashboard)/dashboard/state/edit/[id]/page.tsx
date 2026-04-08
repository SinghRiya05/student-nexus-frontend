"use client";

import StateForm from "@/components/dashboard/state/StateForm";
import React from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/utils/hook";
import LoadingSpinner from "@/components/ui/loading";
import { getStateById } from "@/features/location/StateThunk";


export default function EditStatePage() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const { singleState, stateLoading } = useAppSelector((state) => state.state);

  React.useEffect(() => {
    dispatch(getStateById(params.id as string));
  }, [params.id]);

  if (stateLoading || !singleState) return <LoadingSpinner fullPage label="Loading state details..." />;

  return <StateForm initialData={singleState} isEditing={true} />;
}
