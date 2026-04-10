import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/apiEndpoints";
import { IUniversityUpdate, IUniversityCreate, IUniversityResponse, IUniversityListResponse } from "./universityModel";

export const createUniversity = createAsyncThunk(
    "university/createUniversity",
    async (formData: FormData, { rejectWithValue }) => {
        try {
            const response = await apiClient.post<IUniversityResponse>(
                API_ENDPOINTS.UNIVERSITY.CREATE,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to create university");
        }
    }
)

export const getAllUniversities = createAsyncThunk(
    "university/getAllUniversities",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get<IUniversityListResponse>(API_ENDPOINTS.UNIVERSITY.GET_ALL);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch universities");
        }
    }
)

export const getUniversityById = createAsyncThunk(
    "university/getUniversityById",
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await apiClient.get<IUniversityResponse>(API_ENDPOINTS.UNIVERSITY.GET_BY_ID(id));
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch university");
        }
    }
)

export const updateUniversity = createAsyncThunk(
    "university/updateUniversity",
    async ({ id, formData }: { id: string; formData: FormData }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put<IUniversityResponse>(
                API_ENDPOINTS.UNIVERSITY.UPDATE(id),
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            return response.data.data;

        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to update university");
        }
    }
)

export const deleteUniversity = createAsyncThunk(
    "university/deleteUniversity",
    async (id: string, { rejectWithValue }) => {
        try {
            await apiClient.delete(API_ENDPOINTS.UNIVERSITY.DELETE(id));
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete university");
        }
    }
)

export const syncUniversityCourses = createAsyncThunk(
    "university/syncUniversityCourses",
    async (data: { universityId: string, courseIds: string[] }, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.UNIVERSITY_COURSE.SYNC, data);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to sync university courses");
        }
    }
)


export const getCoursesByUniversityId = createAsyncThunk(
    "university/getCoursesByUniversityId",
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.UNIVERSITY_COURSE.GET_BY_UNIVERSITY_ID(id));
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch courses by university id");
        }
    }
)

