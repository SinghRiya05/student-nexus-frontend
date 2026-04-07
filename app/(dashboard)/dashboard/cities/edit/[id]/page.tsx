"use client";

import CityForm from "@/components/dashboard/cities/CityForm"
import React from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/utils/hook";
import { fetchCityById } from "@/features/location/cityThunk";
import LoadingSpinner from "@/components/ui/loading";


export default function EditCityPage() {
    const params = useParams();
    const dispatch = useAppDispatch();
    const { singleCity, cityLoading } = useAppSelector((state) => state.city);

    React.useEffect(() => {
        dispatch(fetchCityById(params.id as string));
    }, [params.id]);

    if (cityLoading || !singleCity) return <LoadingSpinner fullPage label="Loading city details..." />;

    return <CityForm initialData={singleCity} isEditing={true} />;
}
