export const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASEURL;

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: "/auth/login",
        REGISTER: "/auth/register",
        LOGOUT: "/auth/logout",
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

};