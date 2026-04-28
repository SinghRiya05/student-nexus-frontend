import apiClient from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/apiEndpoints";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ICreateChat, SendMessage } from "./chatModel";
import { AccessChatResponse, FetchChatsResponse, SendMessageResponse, FetchMessagesResponse } from "./chatModel";

export const fetchChats = createAsyncThunk<FetchChatsResponse, void>(
    "chat/fetchChats",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get<FetchChatsResponse>(API_ENDPOINTS.CHAT.GET_ALL);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Failed to fetch chats");
        }
    }
);

export const accessChat = createAsyncThunk<AccessChatResponse, ICreateChat>(
    "chat/accessChat",
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiClient.post<AccessChatResponse>(API_ENDPOINTS.CHAT.CREATE, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Failed to access chat");
        }
    }
);

export const sendMessage = createAsyncThunk<SendMessageResponse, SendMessage>(
    "chat/sendMessage",
    async (data, { rejectWithValue }) => {
        try {
            let payload: any = data;
            
            if (data.attachments && data.attachments.length > 0) {
                const formData = new FormData();
                formData.append("chatId", data.chatId);
                if (data.content) formData.append("content", data.content);
                data.attachments.forEach((file) => {
                    formData.append("attachments", file); // Field name must match backend (which is any, but I used attachments in manual check)
                });
                payload = formData;
            }

            const response = await apiClient.post<SendMessageResponse>(API_ENDPOINTS.CHAT.SEND_MESSAGE, payload);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Failed to send message");
        }
    }
);

export const clearChatMessages = createAsyncThunk(
    "chat/clearChat",
    async (chatId: string, { rejectWithValue }) => {
        try {
            const response = await apiClient.delete(API_ENDPOINTS.CHAT.CLEAR_MESSAGES(chatId));
            return { chatId, data: response.data };
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Failed to clear chat");
        }
    }
);

export const deleteChatConversation = createAsyncThunk(
    "chat/deleteChat",
    async (chatId: string, { rejectWithValue }) => {
        try {
            const response = await apiClient.delete(API_ENDPOINTS.CHAT.DELETE_CHAT(chatId));
            return { chatId, data: response.data };
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Failed to delete chat");
        }
    }
);

export const getMessages = createAsyncThunk<FetchMessagesResponse, { chatId: string, page?: number, limit?: number }>(
    "chat/getMessages",
    async ({ chatId, page = 1, limit = 20 }, { rejectWithValue }) => {
        try {
            const response = await apiClient.get<FetchMessagesResponse>(
                `${API_ENDPOINTS.CHAT.GET_MESSAGES(chatId)}?page=${page}&limit=${limit}`
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Failed to get messages");
        }
    }
);

