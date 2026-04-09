import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/apiEndpoints";



export const getAllUsers = createAsyncThunk(
    "user/getAllUsers",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.AUTH.GET_ALL_USERS);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Failed to fetch users");
        }
    }
);

export const deleteUser = createAsyncThunk(
    "user/deleteUser",
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.AUTH.DELETE_USER(id));
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Failed to delete users");
        }
    }
);

