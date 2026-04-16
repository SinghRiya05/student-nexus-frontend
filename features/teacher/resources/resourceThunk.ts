import apiClient from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/apiEndpoints";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ICreateResource, IUpdateResource } from "./resourceModel";

export const createResource = createAsyncThunk(
    "resource/createResource",
    async (resource: ICreateResource, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.RESOURCE.CREATE, resource);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const getAllResourcesByTeacherId = createAsyncThunk(
    "resource/getAllResourcesByTeacherId",
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.RESOURCE.GET_ALL_BY_TEACHER_ID(id));
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const getResourceById = createAsyncThunk(
    "resource/getResourceById",
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.RESOURCE.GET_BY_ID(id));
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const updateResource = createAsyncThunk(
    "resource/updateResource",
    async ({ id, resource }: { id: string, resource: IUpdateResource }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(API_ENDPOINTS.RESOURCE.UPDATE(id), resource);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const deleteResource = createAsyncThunk(
    "resource/deleteResource",
    async (id: string, { rejectWithValue }) => {
        try {
            await apiClient.delete(API_ENDPOINTS.RESOURCE.DELETE(id));
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message);
        }
    }
);