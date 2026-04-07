"use client";

import CountryForm from "@/components/dashboard/countries/CountryForm";
import React from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/utils/hook";
import LoadingSpinner from "@/components/ui/loading";
import { fetchCountryById } from "@/features/location/countryThunk";


export default function EditCountryPage() {
  const dispatch = useAppDispatch();
  const params = useParams();


  React.useEffect(() => {
    dispatch(fetchCountryById(params.id as string));
  }, [params.id, dispatch]);

  const { singleCountry, loading } = useAppSelector((state) => state.country);
  if (loading || !singleCountry) return <LoadingSpinner fullPage label="Loading country details..." />;

  return <CountryForm initialData={singleCountry} isEditing={true} />;
}
