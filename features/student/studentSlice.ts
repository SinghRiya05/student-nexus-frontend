import { createSlice } from "@reduxjs/toolkit";
import { studentState } from "./studentModel";
import { getAllStudents, getStudentsByMatchedCourseAndSameUniversity, getStudentsByMatchedHobbyBadge, getStudentsByMatchedSemesterWithCourseAndSameUniversity, getStudentsByMyUniversity } from "./studentThunk";


const initialState: studentState = {
    students: [],
    singleStudent: null,
    loading: false,
    error: null,
};

const studentSlice = createSlice({
    name: "student",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // get all students
            .addCase(getAllStudents.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllStudents.fulfilled, (state, action) => {
                state.loading = false;
                state.students = action.payload.data;
            })
            .addCase(getAllStudents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // get students by my university
            .addCase(getStudentsByMyUniversity.pending, (state) => {
                state.loading = true;
            })
            .addCase(getStudentsByMyUniversity.fulfilled, (state, action) => {
                state.loading = false;
                state.students = action.payload.data;
            })
            .addCase(getStudentsByMyUniversity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // get students by matched hobby badge
            .addCase(getStudentsByMatchedHobbyBadge.pending, (state) => {
                state.loading = true;
            })
            .addCase(getStudentsByMatchedHobbyBadge.fulfilled, (state, action) => {
                state.loading = false;
                state.students = action.payload.data;
            })
            .addCase(getStudentsByMatchedHobbyBadge.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // get students by matched course and same university
            .addCase(getStudentsByMatchedCourseAndSameUniversity.pending, (state) => {
                state.loading = true;
            })
            .addCase(getStudentsByMatchedCourseAndSameUniversity.fulfilled, (state, action) => {
                state.loading = false;
                state.students = action.payload.data;
            })
            .addCase(getStudentsByMatchedCourseAndSameUniversity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // get students by matched semester with course and same university
            .addCase(getStudentsByMatchedSemesterWithCourseAndSameUniversity.pending, (state) => {
                state.loading = true;
            })
            .addCase(getStudentsByMatchedSemesterWithCourseAndSameUniversity.fulfilled, (state, action) => {
                state.loading = false;
                state.students = action.payload.data;
            })
            .addCase(getStudentsByMatchedSemesterWithCourseAndSameUniversity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    }
});

export default studentSlice.reducer;