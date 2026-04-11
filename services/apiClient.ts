import axios from "axios";
import { API_ENDPOINTS } from "./apiEndpoints";

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_BASEURL,
    withCredentials: true,
});


let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

apiClient.interceptors.response.use((res) => res, async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
                .then(() => {
                    return apiClient(originalRequest);
                })
                .catch((err) => {
                    return Promise.reject(err);
                });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            await apiClient.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN);
            isRefreshing = false;
            processQueue(null, "success");
            return apiClient(originalRequest);
        } catch (refreshError) {
            isRefreshing = false;
            processQueue(refreshError, null);

            // ⚠️ Clear session on failure
            if (typeof window !== "undefined") {
              // We try to call logout to clear cookies, but don't wait for it
              apiClient.post(API_ENDPOINTS.AUTH.LOGOUT).catch(() => {});
              
              // Clear persisted Redux state manually if needed, 
              // but redirecting to root with mode=login is the priority.
              // To break the middleware loop, we must clear the relevant indicator.
              // Since we can't easily dispatch without circularity here, 
              // we rely on the redirect and the MainLayoutClient to handle the rest.
              
              if (!window.location.pathname.includes("login")) {
                  window.location.href = "/?mode=login";
              }
            }
            return Promise.reject(refreshError);
        }
    }
    return Promise.reject(error);
},
);



export default apiClient;
