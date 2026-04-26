import { createSlice } from "@reduxjs/toolkit";
import {
    bulkSyncRolePermission,
    assignRolePermission,
    getPermissionsByRole,
    removePermissionFromRole,
} from "./rolePermissionThunk";
import { IRolePermission } from "./rolePermissionModel";

interface RolePermissionState {
    rolePermissions: IRolePermission[];
    assignedPermissionIds: string[];
    loading: boolean;
    success: boolean;
    message: string | null;
    error: string | null;
}

const initialState: RolePermissionState = {
    rolePermissions: [],
    assignedPermissionIds: [],
    loading: false,
    success: false,
    message: null,
    error: null,
};

const rolePermissionSlice = createSlice({
    name: "rolePermission",
    initialState,
    reducers: {
        resetRolePermissionState: (state) => {
            state.loading = false;
            state.success = false;
            state.message = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // ================= GET PERMISSIONS BY ROLE =================
        builder
            .addCase(getPermissionsByRole.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPermissionsByRole.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.rolePermissions = action.payload.data;
                state.assignedPermissionIds = action.payload.data.map(
                    (item: IRolePermission) => String(item.permission._id)
                );
            })
            .addCase(getPermissionsByRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // ================= BULK SYNC =================
        builder
            .addCase(bulkSyncRolePermission.pending, (state) => {
                state.loading = true;
            })
            .addCase(bulkSyncRolePermission.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message;
            })
            .addCase(bulkSyncRolePermission.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // ================= ASSIGN =================
        builder
            .addCase(assignRolePermission.fulfilled, (state, action) => {
                state.message = action.payload.message;
            });
        builder
            .addCase(assignRolePermission.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
        builder
            .addCase(assignRolePermission.pending, (state) => {
                state.loading = true;
            });

        // ================= REMOVE =================
        builder
            .addCase(removePermissionFromRole.fulfilled, (state, action) => {
                state.message = action.payload.message;
            });
        builder
            .addCase(removePermissionFromRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
        builder
            .addCase(removePermissionFromRole.pending, (state) => {
                state.loading = true;
            });
    },
});

export const { resetRolePermissionState } = rolePermissionSlice.actions;
export default rolePermissionSlice.reducer;