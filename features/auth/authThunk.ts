import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_ENDPOINTS } from "@/services/apiEndpoints";
import apiClient from "@/services/apiClient";
import { ILoginRequest, IRegisterRequest, IVerifyRequest } from "./authModel";

//----------Register User----------
export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (userData: IRegisterRequest, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

//----------Login User----------
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (userData: ILoginRequest, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, userData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

//----------Logout User----------
export const logoutUser = createAsyncThunk(
    "auth/logoutUser",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
            return { message: "Logged out successfully" };
        } catch (error: any) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const verifyEmail = createAsyncThunk(
    "auth/verifyEmail",
    async (userData: IVerifyRequest, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, userData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const resendOtp = createAsyncThunk(
    "auth/resendOtp",
    async (email: string, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.AUTH.RESEND_OTP, { email });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const completeRegistration = createAsyncThunk(
    "auth/completeRegistration",
    async ({ userId, userData }: { userId: string, userData: any }, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.AUTH.COMPLETE_REGISTRATION, { 
                userId, 
                ...userData 
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to complete registration");
        }
    }
);

export const forgotPassword = createAsyncThunk(
    "auth/forgotPassword",
    async (email: string, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to send reset code");
        }
    }
);

export const resetPassword = createAsyncThunk(
    "auth/resetPassword",
    async (userData: any, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, userData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to reset password");
        }
    }
);

export const verifyResetOtp = createAsyncThunk(
    "auth/verifyResetOtp",
    async (userData: { email: string, otp: string }, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_RESET_OTP, userData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Invalid or expired reset code");
        }
    }
);



