import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/services/apiClient";
import { ICreateRole, IUpdateRole } from "./roleModel";
import { API_ENDPOINTS } from "@/services/apiEndpoints";

export const createRole = createAsyncThunk(
    "roles/createRole",
    async (roleData: ICreateRole, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(
                API_ENDPOINTS.ROLE.CREATE,
                roleData,
            );
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to create role",
            );
        }
    },
);

export const getRoleById = createAsyncThunk(
    "roles/getRoleById",
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.ROLE.GET_BY_ID(id));
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to get role",
            );
        }
    },
);

export const getRoles = createAsyncThunk(
    "roles/getRoles",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.ROLE.GET_ALL);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to get roles",
            );
        }
    },
);

export const updateRole = createAsyncThunk(
    "roles/updateRole",
    async (
        { id, roleData }: { id: string; roleData: IUpdateRole },
        { rejectWithValue },
    ) => {
        try {
            const response = await apiClient.put(
                API_ENDPOINTS.ROLE.UPDATE(id),
                roleData,
            );
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update role",
            );
        }
    },
);

export const deleteRole = createAsyncThunk(
    "roles/deleteRole",
    async (id: string, { rejectWithValue }) => {
        try {
            await apiClient.delete(API_ENDPOINTS.ROLE.DELETE(id));
            return id;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to delete role",
            );
        }
    },
);

export const assignRole = createAsyncThunk(
    "roles/assignRole",
    async (
        { id, roleData }: { id: string; roleData: { roleId: string } },
        { rejectWithValue },
    ) => {
        try {
            const response = await apiClient.put(
                API_ENDPOINTS.ROLE.ASSIGN_ROLE(id),
                roleData,
            );
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to assign role",
            );
        }
    },
);
