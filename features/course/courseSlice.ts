import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CourseState, ICourse } from "./courseModel";
import { createCourse, getAllCourses, getCourseById, updateCourse, deleteCourse } from "./courseThunk";

const initialState: CourseState = {
    courses: [],
    singleCourse: null,
    courseLoading: false,
    courseError: null,
};

const courseSlice = createSlice({
    name: "course",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createCourse.pending, (state) => {
                state.courseLoading = true;
            })
            .addCase(createCourse.fulfilled, (state, action: PayloadAction<ICourse>) => {
                state.courseLoading = false;
                state.courses.push(action.payload);
            })
            .addCase(createCourse.rejected, (state, action) => {
                state.courseLoading = false;
                state.courseError = action.payload as string;
            })
            .addCase(getAllCourses.pending, (state) => {
                state.courseLoading = true;
            })
            .addCase(getAllCourses.fulfilled, (state, action: PayloadAction<ICourse[]>) => {
                state.courseLoading = false;
                state.courses = action.payload;
            })
            .addCase(getAllCourses.rejected, (state, action) => {
                state.courseLoading = false;
                state.courseError = action.payload as string;
            })
            .addCase(getCourseById.pending, (state) => {
                state.courseLoading = true;
            })
            .addCase(getCourseById.fulfilled, (state, action: PayloadAction<ICourse>) => {
                state.courseLoading = false;
                state.singleCourse = action.payload;
            })
            .addCase(getCourseById.rejected, (state, action) => {
                state.courseLoading = false;
                state.courseError = action.payload as string;
            })
            .addCase(updateCourse.pending, (state) => {
                state.courseLoading = true;
            })
            .addCase(updateCourse.fulfilled, (state, action: PayloadAction<ICourse>) => {
                state.courseLoading = false;
                state.courses = state.courses.map((course) =>
                    course._id === action.payload._id ? action.payload : course
                );
                state.singleCourse = action.payload;
            })
            .addCase(updateCourse.rejected, (state, action) => {
                state.courseLoading = false;
                state.courseError = action.payload as string;
            })
            .addCase(deleteCourse.pending, (state) => {
                state.courseLoading = true;
            })
            .addCase(deleteCourse.fulfilled, (state, action: PayloadAction<string>) => {
                state.courseLoading = false;
                state.courses = state.courses.filter((course) => course._id !== action.payload);
                if (state.singleCourse?._id === action.payload) {
                    state.singleCourse = null;
                }
            })
            .addCase(deleteCourse.rejected, (state, action) => {
                state.courseLoading = false;
                state.courseError = action.payload as string;
            });
    },
});

export default courseSlice.reducer;
