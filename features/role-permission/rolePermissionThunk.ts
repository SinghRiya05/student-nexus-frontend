import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    AssignRolePermissionRequest,
    RolePermissionRequest,
} from "./rolePermissionModel";
import apiClient from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/apiEndpoints";

// ================= BULK SYNC =================
export const bulkSyncRolePermission = createAsyncThunk<
    any,
    RolePermissionRequest,
    { rejectValue: string }
>("rolePermission/bulkSyncRolePermission", async (data, { rejectWithValue }) => {
    try {/*  */
        const response = await apiClient.post(
            API_ENDPOINTS.ROLE_PERMISSION.SYNC,
            data
        );
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Sync failed");
    }
});

// ================= ASSIGN =================
export const assignRolePermission = createAsyncThunk<
    any,
    AssignRolePermissionRequest,
    { rejectValue: string }
>("rolePermission/assignRolePermission", async (data, { rejectWithValue }) => {
    try {
        const response = await apiClient.post(
            API_ENDPOINTS.ROLE_PERMISSION.ASSIGN,
            data
        );
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Assign failed");
    }
});

// ================= GET =================
export const getPermissionsByRole = createAsyncThunk<
    any,
    number,
    { rejectValue: string }
>("rolePermission/getPermissionsByRole", async (roleId, { rejectWithValue }) => {
    try {
        const response = await apiClient.get(
            API_ENDPOINTS.ROLE_PERMISSION.GET_BY_ROLE(roleId)
        );
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Fetch failed");
    }
});

// ================= REMOVE =================
export const removePermissionFromRole = createAsyncThunk<
    any,
    AssignRolePermissionRequest,
    { rejectValue: string }
>(
    "rolePermission/removePermissionFromRole",
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(
                API_ENDPOINTS.ROLE_PERMISSION.REMOVE,
                data
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Remove failed");
        }
    }
);