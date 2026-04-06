import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/apiEndpoints";
import { IStateCreate, IStateUpdate } from "./stateModel";

// CREATE STATE
export const createState = createAsyncThunk(
    "state/create",
    async (stateData: IStateCreate, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(
                API_ENDPOINTS.STATE.CREATE,
                stateData
            );
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to create state"
            );
        }
    }
);


// UPDATE STATE
export const updateState = createAsyncThunk(
    "state/update",
    async (
        { id, stateData }: { id: string; stateData: IStateUpdate },
        { rejectWithValue }
    ) => {
        try {
            const response = await apiClient.put(
                API_ENDPOINTS.STATE.UPDATE(id),
                stateData
            );
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update state"
            );
        }
    }
);


// GET STATE BY ID
export const getStateById = createAsyncThunk(
    "state/getById",
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                API_ENDPOINTS.STATE.GET_BY_ID(id)
            );
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to get state"
            );
        }
    }
);


// GET ALL STATES
export const getAllStates = createAsyncThunk(
    "state/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                API_ENDPOINTS.STATE.GET_ALL
            );
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch states"
            );
        }
    }
);


// DELETE STATE
export const deleteState = createAsyncThunk(
    "state/delete",
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await apiClient.delete(
                API_ENDPOINTS.STATE.DELETE(id)
            );
            return id;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to delete state"
            );
        }
    }
);
