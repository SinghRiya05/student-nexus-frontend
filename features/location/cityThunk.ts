import { createAsyncThunk } from "@reduxjs/toolkit";
import { ICity, ICityCreate, ICityUpdate } from "./cityModel";
import apiClient from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/apiEndpoints";

export const fetchCities = createAsyncThunk(
    'city/fetchCities',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.CITY.GET_ALL);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message || "Failed to fetch cities");
        }
    }
)

export const fetchCityById = createAsyncThunk(
    'city/fetchCityById',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.CITY.GET_BY_ID(id));
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message || "Failed to fetch city");
        }
    }
)

export const createCity = createAsyncThunk(
    'city/createCity',
    async (city: ICityCreate, { rejectWithValue }) => {
        try {
            const response = await apiClient.post<ICity>(API_ENDPOINTS.CITY.CREATE, city);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message || "Failed to create city");
        }
    }
)

export const updateCity = createAsyncThunk(
    'city/updateCity',
    async ({ id, data }: { id: string, data: ICityUpdate }, { rejectWithValue }) => {
        try {
            console.log(data)
            const response = await apiClient.put<ICity>(API_ENDPOINTS.CITY.UPDATE(id), data);
            console.log(response.data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message || "Failed to update city");
        }
    }
)

export const deleteCity = createAsyncThunk(
    'city/deleteCity',
    async (id: string, { rejectWithValue }) => {
        try {
            await apiClient.delete(API_ENDPOINTS.CITY.DELETE(id));
            return id;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message || "Failed to delete city");
        }
    }
)
