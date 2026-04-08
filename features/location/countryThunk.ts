import { createAsyncThunk } from "@reduxjs/toolkit";
import { ICountry, ICreateCountry, IUpdateCountry, ICountryListResponse, ICountryResponse } from "./countryModel";
import apiClient from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/apiEndpoints";

export const fetchCountries = createAsyncThunk(
    'country/fetchCountries',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get<ICountryListResponse>(API_ENDPOINTS.COUNTRY.GET_ALL);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message || "Failed to fetch countries");
        }
    }
)

export const fetchCountryById = createAsyncThunk(
    'country/fetchCountryById',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.COUNTRY.GET_BY_ID(id));
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message || "Failed to fetch country");
        }
    }
)

export const createCountry = createAsyncThunk(
    'country/createCountry',
    async (country: ICreateCountry, { rejectWithValue }) => {
        try {
            const response = await apiClient.post<ICountry>(API_ENDPOINTS.COUNTRY.CREATE, country);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message || "Failed to create country");
        }
    }
)

export const updateCountry = createAsyncThunk(
    'country/updateCountry',
    async (country: IUpdateCountry, { rejectWithValue }) => {
        try {
            console.log(country)
            const response = await apiClient.put<ICountry>(API_ENDPOINTS.COUNTRY.UPDATE(country.id), country.data);
            console.log(response.data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message || "Failed to update country");
        }
    }
)

export const deleteCountry = createAsyncThunk(
    'country/deleteCountry',
    async (id: string, { rejectWithValue }) => {
        try {
            await apiClient.delete(API_ENDPOINTS.COUNTRY.DELETE(id));
            return id;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message || "Failed to delete country");
        }
    }
)
