"use client";

import CountryForm from "@/components/dashboard/countries/CountryForm";
import React from "react";

// Mock function to simulate fetching country by ID
const getCountryById = (id: string) => {
  return {
    id,
    name: "India",
    code: "IND",
    capital: "New Delhi",
    region: "Asia",
    currency: "INR",
  };
};

export default function EditCountryPage({ params }: { params: { id: string } }) {
  const [country, setCountry] = React.useState<any>(null);

  React.useEffect(() => {
    // In a real app, this would be an API call
    const data = getCountryById(params.id);
    setCountry(data);
  }, [params.id]);

  if (!country) return <div className="p-8 text-slate-500 font-medium italic">Loading country details...</div>;

  return <CountryForm initialData={country} isEditing={true} />;
}
