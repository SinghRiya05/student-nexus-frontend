import { createSlice } from "@reduxjs/toolkit";
import { UserInitialSliceState } from "./userModel";
import { getAllUsers, deleteUser, getMe, updateProfile, getUserById, getMutualFollowers } from "./userThunk";

const initialState: UserInitialSliceState = {
    users: [],
    singleUser: null,
    me: null,
    userLoading: false,
    userSuccess: false,
    userMessage: null,
    userError: null,
};

const normalizeUser = (user: any) => {
    if (!user) return null;
    const Profile = user.studentProfile || user.aluminiProfile || user.teacherProfile || user.profile;
    return { ...user, Profile };
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        clearUserState: (state) => {
            state.userLoading = false;
            state.userSuccess = false;
            state.userMessage = null;
            state.userError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get All Users
            .addCase(getAllUsers.pending, (state) => {
                state.userLoading = true;
                state.userError = null;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.userLoading = false;
                state.userSuccess = true;
                state.users = (action.payload.data || []).map(normalizeUser);
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.userLoading = false;
                state.userError = action.payload as string;
            })

            // Get Me
            .addCase(getMe.pending, (state) => {
                state.userLoading = true;
                state.userError = null;
            })
            .addCase(getMe.fulfilled, (state, action) => {
                state.userLoading = false;
                state.userSuccess = true;
                state.me = normalizeUser(action.payload.data);
            })
            .addCase(getMe.rejected, (state, action) => {
                state.userLoading = false;
                state.userError = action.payload as string;
            })

            // Get Mutual Followers
            .addCase(getMutualFollowers.pending, (state) => {
                state.userLoading = true;
                state.userError = null;
            })
            .addCase(getMutualFollowers.fulfilled, (state, action) => {
                state.userLoading = false;
                state.userSuccess = true;
                state.mutualFollowers = action.payload.data;
            })
            .addCase(getMutualFollowers.rejected, (state, action) => {
                state.userLoading = false;
                state.userError = action.payload as string;
            })

            // Get User By Id
            .addCase(getUserById.pending, (state) => {
                state.userLoading = true;
                state.userError = null;
            })
            .addCase(getUserById.fulfilled, (state, action) => {
                state.userLoading = false;
                state.userSuccess = true;
                state.singleUser = normalizeUser(action.payload.data);
            })
            .addCase(getUserById.rejected, (state, action) => {
                state.userLoading = false;
                state.userError = action.payload as string;
            })

            // Delete User
            .addCase(deleteUser.pending, (state) => {
                state.userLoading = true;
                state.userError = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.userLoading = false;
                state.userSuccess = true;
                state.users = state.users.filter((u) => u._id !== action.payload);
                state.userMessage = "User deleted successfully";
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.userLoading = false;
                state.userError = action.payload as string;
            })

            // Update Profile
            .addCase(updateProfile.pending, (state) => {
                state.userLoading = true;
                state.userError = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.userLoading = false;
                state.userSuccess = true;
                state.me = normalizeUser(action.payload.data);
                state.userMessage = "Profile updated successfully";
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.userLoading = false;
                state.userError = action.payload as string;
            });
    },
});

export const { clearUserState } = userSlice.actions;
export default userSlice.reducer;
