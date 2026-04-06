"use client";

import CountryForm from "@/components/dashboard/countries/CountryForm";
import React from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/utils/hook";
import { fetchCountryById } from "@/features/location/countryThunk";


export default function EditCountryPage() {
  const dispatch = useAppDispatch();
  const params = useParams();


  React.useEffect(() => {
    dispatch(fetchCountryById(params.id as string));
  }, [params.id, dispatch]);

  const country = useAppSelector((state) => state.country.singleCountry);
  if (!country) return <div className="p-8 text-slate-500 font-medium italic">Loading country details...</div>;

  return <CountryForm initialData={country} isEditing={true} />;
}
