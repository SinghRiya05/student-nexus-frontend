import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/apiEndpoints";

type Message = {
    role: "user" | "assistant";
    content: string;
};

export const generateAIResponse = createAsyncThunk(
    'ai/generateAIResponse', async ({ messages, userMessage }: { messages: Message[], userMessage: string }, { rejectWithValue }) => {
        try {
            // Include the new user message in the history sent to API
            const fullHistory = [...messages, { role: "user", content: userMessage } as Message];
            // Only send last 10 for efficiency
            const limitedHistory = fullHistory.slice(-10);
            
            const response = await apiClient.post(API_ENDPOINTS.AI.GENERATE, { messages: limitedHistory });
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to generate AI response");
        }
    });