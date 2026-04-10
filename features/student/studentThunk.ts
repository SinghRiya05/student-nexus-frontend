import apiClient from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/apiEndpoints";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IStudentResponse } from "./studentModel";

export const getAllStudents = createAsyncThunk<IStudentResponse, void>(
    "student/getAllStudents",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.STUDENT.GET_ALL);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const getStudentsByMyUniversity = createAsyncThunk<IStudentResponse, void>(
    "student/getStudentsByMyUniversity",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.STUDENT.GET_BY_MY_UNIVERSITY);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const getStudentsByMatchedHobbyBadge = createAsyncThunk<IStudentResponse, string>(
    "student/getStudentsByMatchedHobbyBadge",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.STUDENT.GET_BY_MATCHED_HOBBY_BADGE);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const getStudentsByMatchedCourseAndSameUniversity = createAsyncThunk<IStudentResponse, void>(
    "student/getStudentsByMatchedCourseAndSameUniversity",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.STUDENT.GET_BY_MATCH_COURSE_AND_SAME_UNIVERSITY);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const getStudentsByMatchedSemesterWithCourseAndSameUniversity = createAsyncThunk<IStudentResponse, void>(
    "student/getStudentsByMatchedSemesterWithCourseAndSameUniversity",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.STUDENT.GET_BY_MATCHED_SEMESTER_WITH_COURSE_AND_SAME_UNIVERSITY);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);