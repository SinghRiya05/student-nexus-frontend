import { createSlice } from "@reduxjs/toolkit";
import { FollowState } from "./followModel";
import { sendFollowRequest, acceptFollowRequest, rejectFollowRequest, unfollow, getFollowers, getFollowing, getPendingFollowRequests, getSentRequests } from "./followThunk";

const initialState: FollowState = {
    followers: [],
    following: [],
    pendingRequests: [],
    sentRequests: [],
    loading: false,
    error: null,
};

const followSlice = createSlice({
    name: "follow",
    initialState,
    reducers: {
        handleFollowReceived: (state, action) => {
            const follow = action.payload;
            const exists = state.pendingRequests.find(r => r._id === follow._id) || state.followers.find(f => f._id === follow._id);
            if (exists) return;

            if (follow.status === "PENDING") {
                state.pendingRequests.push(follow);
            } else {
                state.followers.push(follow);
            }
        },
        handleUnfollowReceived: (state, action) => {
            const { followerId } = action.payload;
            state.followers = state.followers.filter(
                (f) => (typeof f.follower === 'string' ? f.follower : f.follower?._id) !== followerId
            );
        },
        handleFollowAccepted: (state, action) => {
            const follow = action.payload;
            state.sentRequests = state.sentRequests.filter(
                (r) => r._id !== follow._id
            );
            if (!state.following.find(f => f._id === follow._id)) {
                state.following.push(follow);
            }
        },
        handleFollowAcceptedSelf: (state, action) => {
            const follow = action.payload;
            state.pendingRequests = state.pendingRequests.filter(
                (r) => r._id !== follow._id
            );
            if (!state.followers.find(f => f._id === follow._id)) {
                state.followers.push(follow);
            }
        },
        handleFollowSuccess: (state, action) => {
            const follow = action.payload;
            if (follow.status === "ACCEPTED") {
                if (!state.following.find(f => f._id === follow._id)) {
                    state.following.push(follow);
                }
            } else {
                if (!state.sentRequests.find(r => r._id === follow._id)) {
                    state.sentRequests.push(follow);
                }
            }
        },
        handleUnfollowSuccess: (state, action) => {
            const { userId } = action.payload;
            state.following = state.following.filter(
                (f) => (typeof f.following === 'string' ? f.following : f.following?._id) !== userId
            );
            state.sentRequests = state.sentRequests.filter(
                (r) => (typeof r.following === 'string' ? r.following : r.following?._id) !== userId
            );
        },
        handleFollowRejectedSuccess: (state, action) => {
            const { requestId } = action.payload;
            state.pendingRequests = state.pendingRequests.filter(
                (r) => r._id !== requestId
            );
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendFollowRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendFollowRequest.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.data.status === "ACCEPTED") {
                    state.following.push(action.payload.data);
                } else {
                    state.sentRequests.push(action.payload.data);
                }
            })
            .addCase(sendFollowRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(acceptFollowRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(acceptFollowRequest.fulfilled, (state, action) => {
                state.loading = false;
                state.pendingRequests = state.pendingRequests.filter(
                    (request) => request._id !== action.payload.data._id
                );
                state.followers.push(action.payload.data);
            })
            .addCase(acceptFollowRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(rejectFollowRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(rejectFollowRequest.fulfilled, (state, action) => {
                state.loading = false;
                const requestId = action.meta.arg;
                state.pendingRequests = state.pendingRequests.filter(
                    (request) => request._id !== requestId
                );
            })
            .addCase(rejectFollowRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(unfollow.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(unfollow.fulfilled, (state, action) => {
                state.loading = false;
                const userId = action.meta.arg;
                state.following = state.following.filter(
                    (f) => (typeof f.following === 'string' ? f.following : f.following?._id) !== userId
                );
                state.sentRequests = state.sentRequests.filter(
                    (r) => (typeof r.following === 'string' ? r.following : r.following?._id) !== userId
                );
            })
            .addCase(unfollow.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(getFollowers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getFollowers.fulfilled, (state, action) => {
                state.loading = false;
                state.followers = action.payload.data;
            })
            .addCase(getFollowers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(getFollowing.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getFollowing.fulfilled, (state, action) => {
                state.loading = false;
                state.following = action.payload.data;
            })
            .addCase(getFollowing.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(getPendingFollowRequests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPendingFollowRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.pendingRequests = action.payload.data;
            })
            .addCase(getPendingFollowRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(getSentRequests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSentRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.sentRequests = action.payload.data;
            })
            .addCase(getSentRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { 
    handleFollowReceived, 
    handleUnfollowReceived, 
    handleFollowAccepted, 
    handleFollowAcceptedSelf,
    handleFollowSuccess,
    handleUnfollowSuccess,
    handleFollowRejectedSuccess
} = followSlice.actions;
export default followSlice.reducer;