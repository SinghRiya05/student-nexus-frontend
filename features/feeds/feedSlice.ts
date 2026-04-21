import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IFeed, IComment, IFeedState } from "./feedModel";
import { getAllFeeds, getSingleFeed, createFeed, updateFeed, deleteFeed, getAllComments, deleteComment, createComment, toggleLike, getTrendingHashtags, getTopPosts } from "./feedThunk";

const initialState: IFeedState = {
    feeds: [],
    topPosts: [],
    singleFeed: null,
    comments: [],
    trendingHashtags: [],
    loading: false,
    error: null,
}

const feedSlice = createSlice({
    name: "feeds",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearFeeds: (state) => {
            state.feeds = [];
        },
        clearSingleFeed: (state) => {
            state.singleFeed = null;
        },
        clearComments: (state) => {
            state.comments = [];
        },
    },
    extraReducers: (builder) => {
        builder
            // Get all feeds
            .addCase(getAllFeeds.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllFeeds.fulfilled, (state, action) => {
                state.loading = false;
                state.feeds = action.payload;
            })
            .addCase(getAllFeeds.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Get single feed
            .addCase(getSingleFeed.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSingleFeed.fulfilled, (state, action) => {
                state.loading = false;
                state.singleFeed = action.payload;
            })
            .addCase(getSingleFeed.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Create feed
            .addCase(createFeed.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createFeed.fulfilled, (state, action) => {
                state.loading = false;
                state.feeds.unshift(action.payload); // Add new feed to the top
            })
            .addCase(createFeed.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Update feed
            .addCase(updateFeed.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateFeed.fulfilled, (state, action) => {
                state.loading = false;
                state.feeds = state.feeds.map((feed) =>
                    feed._id === action.payload._id ? action.payload : feed
                );
                if (state.singleFeed?._id === action.payload._id) {
                    state.singleFeed = action.payload;
                }
            })
            .addCase(updateFeed.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Delete feed
            .addCase(deleteFeed.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteFeed.fulfilled, (state, action) => {
                state.loading = false;
                state.feeds = state.feeds.filter((feed) => feed._id !== action.meta.arg);
                if (state.singleFeed?._id === action.meta.arg) {
                    state.singleFeed = null;
                }
            })
            .addCase(deleteFeed.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Get all comments
            .addCase(getAllComments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllComments.fulfilled, (state, action) => {
                state.loading = false;
                state.comments = action.payload;
            })
            .addCase(getAllComments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Create comment
            .addCase(createComment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createComment.fulfilled, (state, action) => {
                state.loading = false;
                state.comments.unshift(action.payload);
                // Update comment count in feeds list
                state.feeds = state.feeds.map((feed) =>
                    feed._id === action.meta.arg.id ? { ...feed, commentsCount: feed.commentsCount + 1 } : feed
                );
            })
            .addCase(createComment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Delete comment
            .addCase(deleteComment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteComment.fulfilled, (state, action) => {
                state.loading = false;
                const commentToDelete = state.comments.find(c => c._id === action.meta.arg);
                if (commentToDelete) {
                    state.feeds = state.feeds.map((feed) =>
                        feed._id === commentToDelete.feedId ? { ...feed, commentsCount: Math.max(0, feed.commentsCount - 1) } : feed
                    );
                }
                state.comments = state.comments.filter((comment) => comment._id !== action.meta.arg);
            })
            .addCase(deleteComment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Toggle like
            .addCase(toggleLike.pending, (state) => {
                state.error = null;
            })
            .addCase(toggleLike.fulfilled, (state, action) => {
                state.loading = false;
                state.feeds = state.feeds.map((feed) =>
                    feed._id === action.meta.arg ? { ...feed, likesCount: action.payload.likesCount } : feed
                );
                if (state.singleFeed?._id === action.meta.arg) {
                    state.singleFeed = { ...state.singleFeed, likesCount: action.payload.likesCount };
                }
            })
            .addCase(toggleLike.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Get trending hashtags
            .addCase(getTrendingHashtags.pending, (state) => {
                state.error = null;
            })
            .addCase(getTrendingHashtags.fulfilled, (state, action) => {
                state.loading = false;
                state.trendingHashtags = action.payload;
            })
            .addCase(getTrendingHashtags.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Get top posts
            .addCase(getTopPosts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTopPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.topPosts = action.payload;
            })
            .addCase(getTopPosts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
})

export default feedSlice.reducer;