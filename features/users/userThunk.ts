import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/apiEndpoints";
import { ApiResponse } from "./userModel";


export const getAllUsers = createAsyncThunk(
    "user/getAllUsers",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.AUTH.GET_ALL_USERS);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Failed to fetch users");
        }
    }
);

export const getMe = createAsyncThunk(
    "user/getMe",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.AUTH.GET_ME);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Failed to fetch user");
        }
    }
);


export const getUserById = createAsyncThunk("user/getUserById",
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.AUTH.GET_BY_ID(id));
            const data = response.data;
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Failed to fetch user");
        }
    }
);


export const updateProfile = createAsyncThunk("user/updateProfile",
    async (profileData: any, { rejectWithValue }) => {
        try {
            const response = await apiClient.patch(API_ENDPOINTS.AUTH.UPDATE_PROFILE, profileData);
            const data = response.data;
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Failed to update profile");
        }
    }
);


export const deleteUser = createAsyncThunk(
    "user/deleteUser",
    async (id: string, { rejectWithValue }) => {
        try {
            console.log(id)
            const response = await apiClient.delete(API_ENDPOINTS.AUTH.DELETE_USER(id));
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Failed to delete users");
        }
    }
);

export const getMutualFollowers = createAsyncThunk(
    "user/getMutualFollowers",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.AUTH.GET_MUTUAL_FOLLOWERS);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Failed to fetch mutual followers");
        }
    }
);

