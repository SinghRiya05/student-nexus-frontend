import { createSlice } from "@reduxjs/toolkit";
import { UserState } from "./userModel";
import { getAllUsers, deleteUser, getMe } from "./userThunk";

const initialState: UserState = {
    users: [],
    me: null,
    loading: false,
    success: false,
    message: null,
    error: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        clearUserState: (state) => {
            state.loading = false;
            state.success = false;
            state.message = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get All Users
            .addCase(getAllUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.users = action.payload;
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Get Me
            .addCase(getMe.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMe.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.me = action.payload;
            })
            .addCase(getMe.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Delete User
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.users = state.users.filter((u) => u._id !== action.payload);
                state.message = "User deleted successfully";
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearUserState } = userSlice.actions;
export default userSlice.reducer;
