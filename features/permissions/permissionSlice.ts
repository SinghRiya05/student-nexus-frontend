import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IModulePermissions, IPermission, PermissionState } from "./permissionModel";
import {
    createPermission,
    deletePermission,
    getPermissionById,
    getAllPermissions,
    updatePermission,
} from "./permissionThunk";

const initialState: PermissionState = {
    permissions: [],
    singlePermission: null,
    permissionLoading: false,
    permissionSuccess: false,
    permissionMessage: null,
    permissionError: null,
};

const permissionSlice = createSlice({
    name: "permissions",
    initialState,
    reducers: {
        setSelectedPermission: (
            state,
            action: PayloadAction<IPermission | null>
        ) => {
            state.singlePermission = action.payload;
        },

        clearPermissionError: (state) => {
            state.permissionError = null;
        },

        clearPermissions: (state) => {
            state.permissions = [];
            state.singlePermission = null;
            state.permissionError = null;
        },
    },

    extraReducers: (builder) => {
        // Create Permission
        builder
            .addCase(createPermission.pending, (state) => {
                state.permissionLoading = true;
                state.permissionError = null;
            })
            .addCase(
                createPermission.fulfilled,
                (state, action: PayloadAction<IPermission>) => {
                    state.permissionLoading = false;
                    state.permissions.push(action.payload);
                }
            )
            .addCase(createPermission.rejected, (state, action) => {
                state.permissionLoading = false;
                state.permissionError = action.payload as string;
            })

            // Get Permission By Id
            .addCase(getPermissionById.pending, (state) => {
                state.permissionLoading = true;
                state.permissionError = null;
            })
            .addCase(
                getPermissionById.fulfilled,
                (state, action: PayloadAction<IPermission>) => {
                    state.permissionLoading = false;
                    state.singlePermission = action.payload;
                }
            )
            .addCase(getPermissionById.rejected, (state, action) => {
                state.permissionLoading = false;
                state.permissionError = action.payload as string;
            })

            // Get All Permissions
            .addCase(getAllPermissions.pending, (state) => {
                state.permissionLoading = true;
                state.permissionError = null;
            })
            .addCase(
                getAllPermissions.fulfilled,
                (state, action: PayloadAction<IPermission[]>) => {
                    state.permissionLoading = false;
                    state.permissions = action.payload;
                }
            )
            .addCase(getAllPermissions.rejected, (state, action) => {
                state.permissionLoading = false;
                state.permissionError = action.payload as string;
            })

            // Update Permission
            .addCase(updatePermission.pending, (state) => {
                state.permissionLoading = true;
                state.permissionError = null;
            })
            .addCase(
                updatePermission.fulfilled,
                (state, action: PayloadAction<IPermission>) => {
                    state.permissionLoading = false;

                    const index = state.permissions.findIndex(
                        (p) => p._id === action.payload._id
                    );

                    if (index !== -1) {
                        state.permissions[index] = action.payload;
                    }

                    state.singlePermission = null;
                }
            )
            .addCase(updatePermission.rejected, (state, action) => {
                state.permissionLoading = false;
                state.permissionError = action.payload as string;
            })

            // Delete Permission
            .addCase(deletePermission.pending, (state) => {
                state.permissionLoading = true;
                state.permissionError = null;
            })
            .addCase(
                deletePermission.fulfilled,
                (state, action: PayloadAction<string>) => {
                    state.permissionLoading = false;
                    state.permissions = state.permissions.filter(
                        (permission) => permission._id !== action.payload
                    );
                }
            )
            .addCase(deletePermission.rejected, (state, action) => {
                state.permissionLoading = false;
                state.permissionError = action.payload as string;
            });

    },
});

export const {
    setSelectedPermission,
    clearPermissionError,
    clearPermissions,
} = permissionSlice.actions;

export default permissionSlice.reducer;