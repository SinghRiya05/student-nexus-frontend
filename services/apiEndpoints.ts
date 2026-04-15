import { Alumni_Sans } from "next/font/google";
import { id } from "zod/v4/locales";

export const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASEURL;
export const ASSET_URL = process.env.NEXT_PUBLIC_ASSET_BACKEND_BASEURL;


export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: "/auth/login",
        REGISTER: "/auth/register",
        LOGOUT: "/auth/logout",
        REFRESH_TOKEN: "/auth/refresh-token",
        VERIFY_EMAIL: "/auth/verify-email",
        RESEND_OTP: "/auth/resend-otp",
        COMPLETE_REGISTRATION: "/auth/complete-registration",
        DELETE_USER: (id: string) => `/auth/delete-user/${id}`,
        GET_ALL_USERS: "/auth/get-all-users",
        GET_ME: "/auth/get-me",
        GET_BY_ID: (id: string) => `/auth/get-by-id/${id}`,
        UPDATE_PROFILE: "/auth/update-profile",
        TOGGLE_PRIVACY: "/auth/toggle-privacy",
        FORGOT_PASSWORD: "/auth/forgot-password",
        RESET_PASSWORD: "/auth/reset-password",
        VERIFY_RESET_OTP: "/auth/verify-reset-otp",
    },
    COUNTRY: {
        CREATE: "/country",
        GET_ALL: "/country",
        GET_BY_ID: (id: string) => `/country/${id}`,
        UPDATE: (id: string) => `/country/${id}`,
        DELETE: (id: string) => `/country/${id}`,
    },
    STATE: {
        CREATE: "/state",
        GET_ALL: "/state",
        GET_BY_ID: (id: string) => `/state/${id}`,
        UPDATE: (id: string) => `/state/${id}`,
        DELETE: (id: string) => `/state/${id}`,
    },
    CITY: {
        CREATE: "/city",
        GET_ALL: "/city",
        GET_BY_ID: (id: string) => `/city/${id}`,
        UPDATE: (id: string) => `/city/${id}`,
        DELETE: (id: string) => `/city/${id}`,
    },
    UNIVERSITY: {
        CREATE: "/university",
        GET_ALL: "/university",
        GET_BY_ID: (id: string) => `/university/${id}`,
        UPDATE: (id: string) => `/university/${id}`,
        DELETE: (id: string) => `/university/${id}`,
    },
    COURSE: {
        CREATE: "/course",
        GET_ALL: "/course",
        GET_BY_ID: (id: string) => `/course/${id}`,
        UPDATE: (id: string) => `/course/${id}`,
        DELETE: (id: string) => `/course/${id}`,
    },
    UNIVERSITY_COURSE: {
        SYNC: "/university-course/sync",
        GET_BY_COURSE_ID: (id: string) => `/university-course/course/${id}`,
        GET_BY_UNIVERSITY_ID: (id: string) => `/university-course/university/${id}`,
        DELETE: (id: string) => `/university-course/${id}`,
    },
    SEMESTER: {
        CREATE: "/semester",
        GET_ALL: "/semester",
        GET_BY_ID: (id: string) => `/semester/${id}`,
        GET_BY_COURSE_ID: (id: string) => `/semester/course/${id}`,
        UPDATE: (id: string) => `/semester/${id}`,
        DELETE: (id: string) => `/semester/${id}`,
    },
    ROLE: {
        CREATE: "/role",
        GET_ALL: "/role",
        GET_BY_ID: (id: string) => `/role/${id}`,
        UPDATE: (id: string) => `/role/${id}`,
        DELETE: (id: string) => `/role/${id}`,
    },
    PERMISSION: {
        CREATE: "/permissions",
        GET_ALL: "/permissions",
        GET_BY_ID: (id: string) => `/permissions/${id}`,
        UPDATE: (id: string) => `/permissions/${id}`,
        DELETE: (id: string) => `/permissions/${id}`,
    },
    STUDENT: {
        GET_ALL: "/students",
        GET_BY_MY_UNIVERSITY: `/students/my-university`,
        GET_ME: `/students/me`,
        GET_BY_MATCHED_HOBBY_BADGE: `/students/matched-hobby`,
        GET_BY_MATCHED_SEMESTER_WITH_COURSE_AND_SAME_UNIVERSITY: `/students/matched-semester-with-course-and-same-university`,
        GET_BY_MATCH_COURSE_AND_SAME_UNIVERSITY: `/students/match-course-and-same-university`,
    },
    ALUMNI: {
        GET_BY_MY_UNIVERSITY: `/alumni/my-university`,
        GET_BY_UNIVERSITY_ID: (id: string) => `/alumni/university/${id}`,
        GET_BY_MY_COURSE: `/alumni/my-course`,
        GET_BY_JOB_TITLE: `/alumni/job-titles`,
        GET_ALUMNI_GROUP_BY_COMPANY: `/alumni/company`,
    },
    FOLLOW: {
        SEND_FOLLOW_REQUEST: (id: string) => `/follow/${id}`,
        GET_FOLLOWERS: "/follow/followers",
        GET_FOLLOWING: "/follow/following",
        UNFOLLOW: (id: string) => `/follow/${id}`,
        ACCEPT_FOLLOW_REQUEST: (id: string) => `/follow/accept-request/${id}`,
        REJECT_FOLLOW_REQUEST: (id: string) => `/follow/reject-request/${id}`,
        PENDING_FOLLOW_REQUESTS: "/follow/pending-requests",
        SENT_REQUESTS: "/follow/sent-requests",
    },
    TEACHER: {
        GET_SAME_UNIVERSITY_TEACHERS: "/teachers/same-university",
        GET_CLASS_TEACHERS: "/teachers/class-teachers",
        GET_OTHER_UNIVERSITY_TEACHERS: "/teachers/other-universities",
        GET_TEACHERS_BY_COURSE: (id: string) => `/teachers/by-course/${id}`,
    }

};