import { createSlice } from "@reduxjs/toolkit";
import { ResourcesState } from "./resourceModel";
import { createResource, getAllResourcesByTeacherId, getResourceById, updateResource, deleteResource } from "./resourceThunk";

const initialState: ResourcesState = {
    resources: [],
    singleResource: null,
    loading: false,
    error: null,
};

const resourceSlice = createSlice({
    name: "resource",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createResource.pending, (state) => {
                state.loading = true;
            })
            .addCase(createResource.fulfilled, (state, action) => {
                state.loading = false;
                state.resources.push(action.payload);
            })
            .addCase(createResource.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(getAllResourcesByTeacherId.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllResourcesByTeacherId.fulfilled, (state, action) => {
                state.loading = false;
                state.resources = action.payload;
            })
            .addCase(getAllResourcesByTeacherId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(getResourceById.pending, (state) => {
                state.loading = true;
            })
            .addCase(getResourceById.fulfilled, (state, action) => {
                state.loading = false;
                state.singleResource = action.payload;
            })
            .addCase(getResourceById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateResource.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateResource.fulfilled, (state, action) => {
                state.loading = false;
                state.resources = state.resources.map((resource) =>
                    resource._id === action.payload._id ? action.payload : resource
                );
            })
            .addCase(updateResource.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteResource.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteResource.fulfilled, (state, action) => {
                state.loading = false;
                state.resources = state.resources.filter(
                    (resource) => resource._id !== action.payload
                );
            })
            .addCase(deleteResource.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default resourceSlice.reducer;