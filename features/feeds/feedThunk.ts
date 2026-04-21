import apiClient from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/apiEndpoints";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IFeed, IComment, CreateFeedRequest, UpdateFeedRequest, CreateCommentRequest, IToggleLikeResponse } from "./feedModel";

export const getAllFeeds = createAsyncThunk<IFeed[], void>(
    'feeds/getAllFeeds',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.FEED.GET_ALL);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message || "Failed to fetch feeds");
        }
    }
)

export const getSingleFeed = createAsyncThunk<IFeed, string>(
    'feeds/getSingleFeed',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.FEED.GET_BY_ID(id));
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message || "Failed to fetch feed");
        }
    }
)

export const createFeed = createAsyncThunk<IFeed, CreateFeedRequest>(
    'feeds/createFeed',
    async (feedData, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.FEED.CREATE, feedData);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message || "Failed to create feed");
        }
    }
)

export const updateFeed = createAsyncThunk<IFeed, { id: string, feedData: UpdateFeedRequest | FormData }>(
    'feeds/updateFeed',
    async ({ id, feedData }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(API_ENDPOINTS.FEED.UPDATE(id), feedData);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message || "Failed to update feed");
        }
    }
)

export const deleteFeed = createAsyncThunk<void, string>(
    'feeds/deleteFeed',
    async (id, { rejectWithValue }) => {
        try {
            await apiClient.delete(API_ENDPOINTS.FEED.DELETE(id));
        } catch (error: any) {
            return rejectWithValue(error.response.data.message || "Failed to delete feed");
        }
    }
)

export const getAllComments = createAsyncThunk<IComment[], string>(
    'feeds/getAllComments',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.FEED.COMMENT.GET_ALL(id));
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message || "Failed to fetch comments");
        }
    }
)

export const deleteComment = createAsyncThunk<void, string>(
    'feeds/deleteComment',
    async (commentId, { rejectWithValue }) => {
        try {
            await apiClient.delete(API_ENDPOINTS.FEED.COMMENT.DELETE(commentId));
        } catch (error: any) {
            return rejectWithValue(error.response.data.message || "Failed to delete comment");
        }
    }
)

export const createComment = createAsyncThunk<IComment, { id: string, commentData: CreateCommentRequest }>(
    'feeds/createComment',
    async ({ id, commentData }, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.FEED.COMMENT.CREATE(id), commentData);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message || "Failed to create comment");
        }
    }
)

export const toggleLike = createAsyncThunk<IToggleLikeResponse, string>(
    'feeds/toggleLike',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.FEED.LIKE.TOGGLE(id));
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message || "Failed to toggle like");
        }
    }
)

export const getTrendingHashtags = createAsyncThunk<string[], void>(
    'feeds/getTrendingHashtags',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.FEED.TRENDING_HASHTAGS);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message || "Failed to fetch trending hashtags");
        }
    }
)

export const getTopPosts = createAsyncThunk<IFeed[], void>(
    'feeds/getTopPosts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.FEED.GET_ALL, {
                params: { limit: 4, sortBy: 'likes' }
            });
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message || "Failed to fetch top posts");
        }
    }
)

