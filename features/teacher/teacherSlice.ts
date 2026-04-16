import { createSlice } from "@reduxjs/toolkit";
import { TeacherState } from "./teacherModel";
import { getTeacherBycourse, getTeacherById, getTeacherFromOtherUniversity, getTeachersFromSameClass, getTeachersFromSameUniversity } from "./teacherThunk";

const initialState: TeacherState = {
    teachers: [],
    sameUniversityTeachers: [],
    otherUniversityTeachers: [],
    singleTeacher: null,
    loading: false,
    error: null,
}

const teacherSlice = createSlice({
    name: "teacher",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getTeachersFromSameUniversity.pending, (state) => {
                state.loading = true;
            })
            .addCase(getTeachersFromSameUniversity.fulfilled, (state, action) => {
                state.loading = false;
                state.sameUniversityTeachers = action.payload.data;
                // Also update teachers for backward compatibility if needed
                state.teachers = action.payload.data;
            })
            .addCase(getTeachersFromSameUniversity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(getTeachersFromSameClass.pending, (state) => {
                state.loading = true;
            })
            .addCase(getTeachersFromSameClass.fulfilled, (state, action) => {
                state.loading = false;
                state.teachers = action.payload.data;
            })
            .addCase(getTeachersFromSameClass.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(getTeacherFromOtherUniversity.pending, (state) => {
                state.loading = true;
            })
            .addCase(getTeacherFromOtherUniversity.fulfilled, (state, action) => {
                state.loading = false;
                state.otherUniversityTeachers = action.payload.data;
                // Also update teachers
                state.teachers = action.payload.data;
            })
            .addCase(getTeacherFromOtherUniversity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(getTeacherById.pending, (state) => {
                state.loading = true;
            })
            .addCase(getTeacherById.fulfilled, (state, action) => {
                state.loading = false;
                state.singleTeacher = action.payload.data;
            })
            .addCase(getTeacherById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(getTeacherBycourse.pending, (state) => {
                state.loading = true;
            })
            .addCase(getTeacherBycourse.fulfilled, (state, action) => {
                state.loading = false;
                state.teachers = action.payload.data;
            })
            .addCase(getTeacherBycourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    }
})

export default teacherSlice.reducer;