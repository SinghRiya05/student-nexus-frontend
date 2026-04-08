import { createSlice } from "@reduxjs/toolkit";
import { createUniversity, getAllUniversities, getUniversityById, updateUniversity, deleteUniversity } from "./universityThunk";
import { UniversityInitialState } from "./universityModel";

const initialState: UniversityInitialState = {
    singleUniversity: null,
    universities: [],
    universityLoading: false,
    universityError: null,
}

const universitySlice = createSlice({
    name: "university",
    initialState,
    reducers: {
        clearUniversityError: (state) => {
            state.universityError = null;
        },
        clearSingleUniversity: (state) => {
            state.singleUniversity = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createUniversity.pending, (state) => {
                state.universityLoading = true;
            })
            .addCase(createUniversity.fulfilled, (state, action) => {
                state.universityLoading = false;
                state.universities.push(action.payload);
            })
            .addCase(createUniversity.rejected, (state, action) => {
                state.universityLoading = false;
                state.universityError = action.payload as string;
            })
            .addCase(getAllUniversities.pending, (state) => {
                state.universityLoading = true;
            })
            .addCase(getAllUniversities.fulfilled, (state, action) => {
                state.universityLoading = false;
                state.universities = action.payload;
            })
            .addCase(getAllUniversities.rejected, (state, action) => {
                state.universityLoading = false;
                state.universityError = action.payload as string;
            })
            .addCase(getUniversityById.pending, (state) => {
                state.universityLoading = true;
            })
            .addCase(getUniversityById.fulfilled, (state, action) => {
                state.universityLoading = false;
                state.singleUniversity = action.payload;
            })
            .addCase(getUniversityById.rejected, (state, action) => {
                state.universityLoading = false;
                state.universityError = action.payload as string;
            })
            .addCase(updateUniversity.pending, (state) => {
                state.universityLoading = true;
            })
            .addCase(updateUniversity.fulfilled, (state, action) => {
                state.universityLoading = false;
                state.universities = state.universities.map((university) =>
                    university._id === action.payload._id ? action.payload : university
                );
            })
            .addCase(updateUniversity.rejected, (state, action) => {
                state.universityLoading = false;
                state.universityError = action.payload as string;
            })
            .addCase(deleteUniversity.pending, (state) => {
                state.universityLoading = true;
            })
            .addCase(deleteUniversity.fulfilled, (state, action) => {
                state.universityLoading = false;
                state.universities = state.universities.filter((university) => university._id !== action.payload);
            })
            .addCase(deleteUniversity.rejected, (state, action) => {
                state.universityLoading = false;
                state.universityError = action.payload as string;
            });
    }
});

export const { clearUniversityError, clearSingleUniversity } = universitySlice.actions;
export default universitySlice.reducer;