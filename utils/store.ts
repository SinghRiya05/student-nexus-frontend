import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer, PersistConfig } from "redux-persist";
import storage from "redux-persist/lib/storage";
import countryReducer from "@/features/location/countrySlice";
import roleReducer from "@/features/roles/roleSlice";
import permissionReducer from "@/features/permissions/permissionSlice";
import stateReducer from "@/features/location/stateSlice";
import cityReducer from "@/features/location/citySlice";
import universityReducer from "@/features/university/universitySlice";
import courseReducer from "@/features/course/courseSlice";
import semesterReducer from "@/features/semester/semesterSlice";
import authReducer from "@/features/auth/authSlice";
import userReducer from "@/features/users/userSlice";
import studentReducer from "@/features/student/studentSlice";
import followReducer from "@/features/follow/followSlice";
import teacherReducer from "@/features/teacher/teacherSlice";
import alumniReducer from "@/features/alumni/alumniSlice";

const rootReducer = combineReducers({
    country: countryReducer,
    role: roleReducer,
    permission: permissionReducer,
    state: stateReducer,
    city: cityReducer,
    university: universityReducer,
    course: courseReducer,
    semester: semesterReducer,
    auth: authReducer,
    user: userReducer,
    student: studentReducer,
    follow: followReducer,
    teacher: teacherReducer,
    alumni: alumniReducer,
});

export type RootState = ReturnType<typeof rootReducer>;


const persistConfig: PersistConfig<RootState> = {
    key: "root",
    storage,
    version: 1,
    whitelist: ["country", "role", "auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;