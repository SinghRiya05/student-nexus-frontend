import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SearchState } from "./searchModel";
import { searchUsers } from "./searchThunk";

const initialState: SearchState = {
    results: [],
    loading: false,
    error: null,
};

const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        clearSearchResults: (state) => {
            state.results = [];
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.results = action.payload;
            })
            .addCase(searchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearSearchResults } = searchSlice.actions;
export default searchSlice.reducer;
