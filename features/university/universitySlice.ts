import { createSlice } from "@reduxjs/toolkit";
import { createUniversity, getAllUniversities, getUniversityById, updateUniversity, deleteUniversity, getCoursesByUniversityId, syncUniversityCourses } from "./universityThunk";
import { UniversityInitialState } from "./universityModel";

const initialState: UniversityInitialState = {
    singleUniversity: null,
    universities: [],
    universityLoading: false,
    universityError: null,
    universityCourses: [],
    assignedCoursesIds: [],
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
        toggleCourse: (state, action) => {
            const courseId = action.payload;
            if (state.assignedCoursesIds.includes(courseId)) {
                state.assignedCoursesIds = state.assignedCoursesIds.filter(
                    (id) => id !== courseId
                );
            } else {
                state.assignedCoursesIds.push(courseId);
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // createUniversity
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
            // getAllUniversities
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
            // getUniversityById
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
            // updateUniversity
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
            // deleteUniversity
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
            })
            // getCoursesByUniversityId
            .addCase(getCoursesByUniversityId.pending, (state) => {
                state.universityLoading = true;
            })
            .addCase(getCoursesByUniversityId.fulfilled, (state, action: any) => {
                state.universityLoading = false;
                state.universityCourses = action.payload;
                state.assignedCoursesIds = action.payload.map((course: any) => course.courseId._id);
            })
            .addCase(getCoursesByUniversityId.rejected, (state, action) => {
                state.universityLoading = false;
                state.universityError = action.payload as string;
            })
            // syncUniversityCourses
            .addCase(syncUniversityCourses.pending, (state) => {
                state.universityLoading = true;
            })
            .addCase(syncUniversityCourses.fulfilled, (state, action) => {
                state.universityLoading = false;
            })
            .addCase(syncUniversityCourses.rejected, (state, action) => {
                state.universityLoading = false;
                state.universityError = action.payload as string;
            });
    }
});

export const { clearUniversityError, clearSingleUniversity, toggleCourse } = universitySlice.actions;
export default universitySlice.reducer;