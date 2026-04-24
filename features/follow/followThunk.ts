import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/apiEndpoints";
import { IFollowListResponse, IFollowResponse } from "./followModel";

export const sendFollowRequest = createAsyncThunk<IFollowResponse, string>(
    "follow/sendFollowRequest",
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await apiClient.post<IFollowResponse>(API_ENDPOINTS.FOLLOW.SEND_FOLLOW_REQUEST(id));
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to send follow request");
        }
    }
);

export const acceptFollowRequest = createAsyncThunk<IFollowResponse, string>(
    "follow/acceptFollowRequest",
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await apiClient.patch<IFollowResponse>(API_ENDPOINTS.FOLLOW.ACCEPT_FOLLOW_REQUEST(id));
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to accept follow request");
        }
    }
);

export const rejectFollowRequest = createAsyncThunk<IFollowResponse, string>(
    "follow/rejectFollowRequest",
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await apiClient.delete<IFollowResponse>(API_ENDPOINTS.FOLLOW.REJECT_FOLLOW_REQUEST(id));
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to reject follow request");
        }
    }
);

export const unfollow = createAsyncThunk<IFollowResponse, string>(
    "follow/unfollow",
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await apiClient.delete<IFollowResponse>(API_ENDPOINTS.FOLLOW.UNFOLLOW(id));
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to unfollow");
        }
    }
);

export const getFollowers = createAsyncThunk<IFollowListResponse, void>(
    "follow/getFollowers",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get<IFollowListResponse>(API_ENDPOINTS.FOLLOW.GET_FOLLOWERS);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to get followers");
        }
    }
);

export const getFollowing = createAsyncThunk<IFollowListResponse, void>(
    "follow/getFollowing",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get<IFollowListResponse>(API_ENDPOINTS.FOLLOW.GET_FOLLOWING);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to get following");
        }
    }
);

export const getPendingFollowRequests = createAsyncThunk<IFollowListResponse, void>(
    "follow/getPendingFollowRequests",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get<IFollowListResponse>(API_ENDPOINTS.FOLLOW.PENDING_FOLLOW_REQUESTS);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to get pending follow requests");
        }
    }
);

export const getSentRequests = createAsyncThunk<IFollowListResponse, void>(
    "follow/getSentRequests",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get<IFollowListResponse>(API_ENDPOINTS.FOLLOW.SENT_REQUESTS);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to get sent requests");
        }
    }
);