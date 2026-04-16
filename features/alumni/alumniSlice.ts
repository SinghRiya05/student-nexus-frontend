import { createSlice } from "@reduxjs/toolkit";
import { AlumniState } from "./alumniModel";
import { fetchAlumniByCompany, fetchAlumniById, fetchAlumniByJobTitle, fetchAlumniByMyCourse, fetchAlumniByMyUniversity, fetchAlumniByUniversityId } from "./alumniThunk";

const initialState: AlumniState = {
    universityAlumni: [],
    courseAlumni: [],
    alumni: [],
    singleAlumni: null,
    alumniByJobTitle: [],
    alumniByCompany: [],
    loading: false,
    error: null,
};

const alumniSlice = createSlice({
    name: "alumni",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        resetState: (state) => {
            return initialState;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAlumniByJobTitle.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAlumniByJobTitle.fulfilled, (state, action) => {
                state.loading = false;
                state.alumniByJobTitle = action.payload;
            })
            .addCase(fetchAlumniByJobTitle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchAlumniByCompany.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAlumniByCompany.fulfilled, (state, action) => {
                state.loading = false;
                state.alumniByCompany = action.payload;
            })
            .addCase(fetchAlumniByCompany.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchAlumniByMyUniversity.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAlumniByMyUniversity.fulfilled, (state, action) => {
                state.loading = false;
                state.universityAlumni = action.payload;
            })
            .addCase(fetchAlumniByMyUniversity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchAlumniById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAlumniById.fulfilled, (state, action) => {
                state.loading = false;
                state.singleAlumni = action.payload;
            })
            .addCase(fetchAlumniById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchAlumniByMyCourse.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAlumniByMyCourse.fulfilled, (state, action) => {
                state.loading = false;
                state.courseAlumni = action.payload;
            })
            .addCase(fetchAlumniByMyCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchAlumniByUniversityId.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAlumniByUniversityId.fulfilled, (state, action) => {
                state.loading = false;
                state.alumni = action.payload;
            })
            .addCase(fetchAlumniByUniversityId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError, resetState } = alumniSlice.actions;
export default alumniSlice.reducer;