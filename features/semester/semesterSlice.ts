import { createSlice } from "@reduxjs/toolkit";
import { SemesterState } from "./semesterModel";
import { createSemester, getAllSemesters, getSemesterById, updateSemester, deleteSemester, getSemestersByCourseId } from "./semesterThunk";

const initialState: SemesterState = {
    semesters: [],
    singleSemester: null,
    semestersByCourseId: [],
    isLoading: false,
    error: null,
}

const semesterSlice = createSlice({
    name: "semester",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createSemester.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createSemester.fulfilled, (state, action) => {
                state.isLoading = false;
                state.semesters.push(action.payload);
            })
            .addCase(createSemester.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(getAllSemesters.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllSemesters.fulfilled, (state, action) => {
                state.isLoading = false;
                state.semesters = action.payload;
            })
            .addCase(getAllSemesters.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(getSemesterById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getSemesterById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.singleSemester = action.payload;
            })
            .addCase(getSemesterById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(getSemestersByCourseId.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getSemestersByCourseId.fulfilled, (state, action) => {
                state.isLoading = false;
                state.semestersByCourseId = action.payload;
            })
            .addCase(getSemestersByCourseId.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(updateSemester.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateSemester.fulfilled, (state, action) => {
                state.isLoading = false;
                state.semesters = state.semesters.map((semester) =>
                    semester._id === action.payload._id ? action.payload : semester
                );
            })
            .addCase(updateSemester.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteSemester.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteSemester.fulfilled, (state, action) => {
                state.isLoading = false;
                state.semesters = state.semesters.filter(
                    (semester) => semester._id !== action.payload
                );
            })
            .addCase(deleteSemester.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
    }
})

export default semesterSlice.reducer;
