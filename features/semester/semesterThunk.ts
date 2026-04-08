import { createAsyncThunk } from "@reduxjs/toolkit";
import { ISemesterCreate, ISemesterUpdate, ISemesterResponse, ISemesterGetAllResponse } from "./semesterModel";
import apiClient from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/apiEndpoints";

export const createSemester = createAsyncThunk(
    "semester/createSemester",
    async (semesterData: ISemesterCreate, { rejectWithValue }) => {
        try {
            const response = await apiClient.post<ISemesterResponse>(API_ENDPOINTS.SEMESTER.CREATE, semesterData);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to create semester");
        }
    }
)

export const getAllSemesters = createAsyncThunk(
    "semester/getAllSemesters",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get<ISemesterGetAllResponse>(API_ENDPOINTS.SEMESTER.GET_ALL);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch semesters");
        }
    }
)

export const getSemesterById = createAsyncThunk(
    "semester/getSemesterById",
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await apiClient.get<ISemesterResponse>(API_ENDPOINTS.SEMESTER.GET_BY_ID(id));
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch semester");
        }
    }
)

export const updateSemester = createAsyncThunk(
    "semester/updateSemester",
    async ({ id, semesterData }: { id: string; semesterData: ISemesterUpdate }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put<ISemesterResponse>(API_ENDPOINTS.SEMESTER.UPDATE(id), semesterData);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to update semester");
        }
    }
)

export const deleteSemester = createAsyncThunk(
    "semester/deleteSemester",
    async (id: string, { rejectWithValue }) => {
        try {
            await apiClient.delete(API_ENDPOINTS.SEMESTER.DELETE(id));
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete semester");
        }
    }
)
