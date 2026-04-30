import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_ENDPOINTS } from "@/services/apiEndpoints";
import apiClient from "@/services/apiClient";

export const searchUsers = createAsyncThunk(
    "search/searchUsers",
    async (query: string, { rejectWithValue }) => {
        try {
            if (!query.trim()) return [];
            const response = await apiClient.get(API_ENDPOINTS.SEARCH.GET_GLOBAL_SEARCH(query));
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || "Failed to search users.");
        }
    }
);
