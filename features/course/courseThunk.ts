import { createAsyncThunk } from "@reduxjs/toolkit";
import { CourseCreateDto, CourseUpdateDto } from "./courseModel";
import apiClient from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/apiEndpoints";

export const createCourse = createAsyncThunk(
    "course/createCourse",
    async (courseData: CourseCreateDto, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.COURSE.CREATE, courseData);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Failed to create course");
        }
    }
);

export const getAllCourses = createAsyncThunk(
    "course/getAllCourses",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.COURSE.GET_ALL);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Failed to fetch courses");
        }
    }
);

export const getCourseById = createAsyncThunk(
    "course/getCourseById",
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.COURSE.GET_BY_ID(id));
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Failed to fetch course");
        }
    }
);

export const updateCourse = createAsyncThunk(
    "course/updateCourse",
    async ({ id, courseData }: { id: string; courseData: CourseUpdateDto }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(API_ENDPOINTS.COURSE.UPDATE(id), courseData);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Failed to update course");
        }
    }
);

export const deleteCourse = createAsyncThunk(
    "course/deleteCourse",
    async (id: string, { rejectWithValue }) => {
        try {
            await apiClient.delete(API_ENDPOINTS.COURSE.DELETE(id));
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Failed to delete course");
        }
    }
);