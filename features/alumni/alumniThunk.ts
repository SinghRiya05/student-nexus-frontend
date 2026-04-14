import apiClient from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/apiEndpoints";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ApiResponse, IAlumni, IAlumniByCompanyResponse, IAlumniByJobTitleResponse } from "./alumniModel";

export const fetchAlumniByJobTitle = createAsyncThunk(
    'alumni/fetchAlumniByJobTitle',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get<IAlumniByJobTitleResponse>(API_ENDPOINTS.ALUMNI.GET_BY_JOB_TITLE);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch alumni by job title");
        }
    }
);

export const fetchAlumniByCompany = createAsyncThunk(
    'alumni/fetchAlumniByCompany',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get<IAlumniByCompanyResponse>(API_ENDPOINTS.ALUMNI.GET_ALUMNI_GROUP_BY_COMPANY);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch alumni by company");
        }
    }
);

export const fetchAlumniByMyUniversity = createAsyncThunk(
    'alumni/fetchAlumniByMyUniversity',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get<ApiResponse>(API_ENDPOINTS.ALUMNI.GET_BY_MY_UNIVERSITY);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch alumni by my university");
        }
    }
);

export const fetchAlumniByMyCourse = createAsyncThunk(
    'alumni/fetchAlumniByMyCourse',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get<ApiResponse>(API_ENDPOINTS.ALUMNI.GET_BY_MY_COURSE);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch alumni by my course");
        }
    }
);

export const fetchAlumniByUniversityId = createAsyncThunk(
    'alumni/fetchAlumniByUniversityId',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await apiClient.get<ApiResponse>(API_ENDPOINTS.ALUMNI.GET_BY_UNIVERSITY_ID(id));
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch alumni by university id");
        }
    }
);