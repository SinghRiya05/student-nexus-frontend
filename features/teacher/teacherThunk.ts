import apiClient from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/apiEndpoints";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IGetTeachersResponse } from "./teacherModel";

export const getTeachersFromSameUniversity = createAsyncThunk<IGetTeachersResponse>(
    "teacher/getTeachersFromSameUniversity",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.TEACHER.GET_SAME_UNIVERSITY_TEACHERS);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message);
        }
    }
)

export const getTeachersFromSameClass = createAsyncThunk<IGetTeachersResponse>(
    "teacher/getTeachersFromSameClass",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.TEACHER.GET_CLASS_TEACHERS);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message);
        }
    }
)

export const getTeacherFromOtherUniversity = createAsyncThunk<IGetTeachersResponse>(
    "teacher/getTeacherFromOtherUniversity",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.TEACHER.GET_OTHER_UNIVERSITY_TEACHERS);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message);
        }
    }
)

export const getTeacherById = createAsyncThunk(
    "teacher/getTeacherById",
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.TEACHER.GET_BY_ID(id));
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message);
        }
    }
)

export const getTeacherBycourse = createAsyncThunk(
    "teacher/getTeacherBycourse",
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.TEACHER.GET_TEACHERS_BY_COURSE(id));
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message);
        }
    }
)
