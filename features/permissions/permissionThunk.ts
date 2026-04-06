import { createAsyncThunk } from "@reduxjs/toolkit";
import { ICreatePermission, IUpdatePermission } from "./permissionModel";
import apiClient from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/apiEndpoints";


// CREATE PERMISSION
export const createPermission = createAsyncThunk(
    "permission/create",
    async (permissionData: ICreatePermission, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(
                API_ENDPOINTS.PERMISSION.CREATE,
                permissionData
            );
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to create permission"
            );
        }
    }
);


// UPDATE PERMISSION
export const updatePermission = createAsyncThunk(
    "permission/update",
    async (
        { id, permissionData }: { id: string; permissionData: IUpdatePermission },
        { rejectWithValue }
    ) => {
        try {
            const response = await apiClient.put(
                API_ENDPOINTS.PERMISSION.UPDATE(id),
                permissionData
            );
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update permission"
            );
        }
    }
);


// GET PERMISSION BY ID
export const getPermissionById = createAsyncThunk(
    "permission/getById",
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                API_ENDPOINTS.PERMISSION.GET_BY_ID(id)
            );
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to get permission"
            );
        }
    }
);

export const getAllPermissions = createAsyncThunk(
    "permission/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                API_ENDPOINTS.PERMISSION.GET_ALL
            );
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch permissions"
            );
        }
    }
);

// export const getModulesWithPermission = createAsyncThunk(
//     "permission/getModules",
//     async (_, { rejectWithValue }) => {
//         try {
//             const response = await apiClient.get(
//                 API_ENDPOINTS.PERMISSION.GET_MODULES
//             );
//             return response.data.data;
//         } catch (error: any) {
//             return rejectWithValue(
//                 error.response?.data?.message || "Failed to fetch permissions"
//             );
//         }
//     }
// );

export const deletePermission = createAsyncThunk(
    "permission/delete",
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await apiClient.delete(
                API_ENDPOINTS.PERMISSION.DELETE(id)
            );
            return id;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to delete permission"
            );
        }
    }
);
// export const getPermissionByModule = createAsyncThunk(
//     "permission/getByModule",
//     async (moduleName: string, { rejectWithValue }) => {
//         try {
//             const response = await apiClient.get(
//                 API_ENDPOINTS.PERMISSION.GET_BY_MODULE(moduleName)
//             );
//             return response.data.data;
//         } catch (error: any) {
//             return rejectWithValue(
//                 error.response?.data?.message || "Failed to fetch permissions by module"
//             );
//         }
//     }
// );