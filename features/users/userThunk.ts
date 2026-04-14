import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/apiEndpoints";
import { IUpdateProfile } from "./userModel";


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

export const getMe = createAsyncThunk(
    "user/getMe",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.AUTH.GET_ME);
            const data = response.data.data;
            if (data) {
                if (data.studentProfile) data.Profile = data.studentProfile;
                else if (data.aluminiProfile) data.Profile = data.aluminiProfile;
                else if (data.teacherProfile) data.Profile = data.teacherProfile;
                else if (data.profile) data.Profile = data.profile;
            }
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Failed to fetch user");
        }
    }
);

export const updateProfile = createAsyncThunk(
    "user/updateProfile",
    async (profileData: IUpdateProfile, { rejectWithValue }) => {
        try {
            const response = await apiClient.patch(API_ENDPOINTS.AUTH.UPDATE_PROFILE, profileData);
            const data = response.data.data;
            if (data) {
                if (data.studentProfile) data.Profile = data.studentProfile;
                else if (data.aluminiProfile) data.Profile = data.aluminiProfile;
                else if (data.teacherProfile) data.Profile = data.teacherProfile;
                else if (data.profile) data.Profile = data.profile;
            }
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

