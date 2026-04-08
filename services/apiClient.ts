import axios from "axios";
import { API_ENDPOINTS } from "./apiEndpoints";

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_BASEURL,
    withCredentials: true,
});


// REQUEST INTERCEPTOR
apiClient.interceptors.request.use((config: any) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

    const isAuthRoute = config.url === API_ENDPOINTS.AUTH.LOGIN || config.url === API_ENDPOINTS.AUTH.REGISTER;
    const isLogoutRoute = config.url === API_ENDPOINTS.AUTH.LOGOUT;

    if (!token && !isAuthRoute && !isLogoutRoute && typeof window !== "undefined") {
        axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASEURL}${API_ENDPOINTS.AUTH.LOGOUT}`, {}, { withCredentials: true })
            .finally(() => {
                localStorage.removeItem("accessToken");
                window.location.href = "/auth/login";
            });
        return Promise.reject(new Error("No access token found."));
    }

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


// RESPONSE INTERCEPTOR
apiClient.interceptors.response.use((res: any) => res, async (error: any) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
            return apiClient(originalRequest);
        } catch (refreshError) {
            if (typeof window !== "undefined") {
                window.location.href = "/auth/login";
            }
            return Promise.reject(refreshError);
        }
    }
    return Promise.reject(error);
},
);

export default apiClient;
