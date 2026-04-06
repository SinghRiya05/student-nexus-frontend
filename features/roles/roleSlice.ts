import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IRole, RoleState } from "./roleModel";
import {
    createRole,
    deleteRole,
    getRoleById,
    getRoles,
    updateRole,
} from "./roleThunk";

const initialState: RoleState = {
    roles: [],
    singleRole: null,
    roleLoading: false,
    roleSuccess: false,
    roleMessage: null,
    roleError: null,
};

const roleSlice = createSlice({
    name: "roles",
    initialState,
    reducers: {
        setSelectedRole: (state, action: PayloadAction<IRole | null>) => {
            state.singleRole = action.payload;
        },

        clearError: (state) => {
            state.roleError = null;
        },

        clearRoles: (state) => {
            state.roles = [];
            state.singleRole = null;
            state.roleError = null;
        },
    },
    extraReducers: (builder) => {
        // Create Role
        builder
            .addCase(createRole.pending, (state) => {
                state.roleLoading = true;
                state.roleError = null;
            })
            .addCase(createRole.fulfilled, (state, action: PayloadAction<IRole>) => {
                state.roleLoading = false;
                state.roles.push(action.payload);
            })
            .addCase(createRole.rejected, (state, action) => {
                state.roleLoading = false;
                state.roleError = action.payload as string;
            })

            // Get Role By Id
            .addCase(getRoleById.pending, (state) => {
                state.roleLoading = true;
                state.roleError = null;
            })
            .addCase(getRoleById.fulfilled, (state, action: PayloadAction<IRole>) => {
                state.roleLoading = false;
                state.singleRole = action.payload;
            })
            .addCase(getRoleById.rejected, (state, action) => {
                state.roleLoading = false;
                state.roleError = action.payload as string;
            })

            // Get Roles
            .addCase(getRoles.pending, (state) => {
                state.roleLoading = true;
                state.roleError = null;
            })
            .addCase(getRoles.fulfilled, (state, action: PayloadAction<IRole[]>) => {
                state.roleLoading = false;
                state.roles = action.payload;
            })
            .addCase(getRoles.rejected, (state, action) => {
                state.roleLoading = false;
                state.roleError = action.payload as string;
            })

            // Update Role
            .addCase(updateRole.pending, (state) => {
                state.roleLoading = true;
                state.roleError = null;
            })
            .addCase(updateRole.fulfilled, (state, action: PayloadAction<IRole>) => {
                state.roleLoading = false;
                const index = state.roles.findIndex((t) => t._id === action.payload._id);
                if (index !== -1) {
                    state.roles[index] = action.payload;
                }
                state.singleRole = null;
            })
            .addCase(updateRole.rejected, (state, action) => {
                state.roleLoading = false;
                state.roleError = action.payload as string;
            })

            // Delete Role
            .addCase(deleteRole.pending, (state) => {
                state.roleLoading = true;
                state.roleError = null;
            })
            .addCase(deleteRole.fulfilled, (state, action: PayloadAction<string>) => {
                state.roleLoading = false;
                state.roles = state.roles.filter((role) => role._id !== action.payload);
            })
            .addCase(deleteRole.rejected, (state, action) => {
                state.roleLoading = false;
                state.roleError = action.payload as string;
            });
    },
});

export const { setSelectedRole, clearError, clearRoles } = roleSlice.actions;

export default roleSlice.reducer;
