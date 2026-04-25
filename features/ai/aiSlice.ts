import { createSlice } from "@reduxjs/toolkit";
import { generateAIResponse } from "./aiThunk";

type Message = {
    role: "user" | "assistant";
    content: string;
};

interface AiState {
    messages: Message[];
    loading: boolean;
    error: string | null;
}

const DEFAULT_GREETING: Message = {
    role: "assistant",
    content: "Hi! I'm your StudentNexus assistant. How can I help you today?",
};

const storedMessages: Message[] =
    typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("messages") || "[]")
        : [];


const initialState: AiState = {
    messages: storedMessages.length > 0 ? storedMessages : [DEFAULT_GREETING],
    loading: false,
    error: null
};

const aiSlice = createSlice({
    name: "ai",
    initialState,
    reducers: {
        clearChat: (state) => {
            state.messages = [DEFAULT_GREETING];
            state.error = null;
            localStorage.setItem("messages", JSON.stringify(state.messages));
        }
    },
    extraReducers: (builder) => {
        builder
            // USER MESSAGE ADD (optional if you handle UI side)
            .addCase(generateAIResponse.pending, (state, action: any) => {
                state.loading = true;
                state.error = null;

                // optional: user message push (agar thunk me pass kar rahe ho)
                if (action.meta?.arg?.userMessage) {
                    state.messages.push({
                        role: "user",
                        content: action.meta.arg.userMessage
                    });
                    localStorage.setItem("messages", JSON.stringify(state.messages));
                }
            })

            // AI RESPONSE SUCCESS
            .addCase(generateAIResponse.fulfilled, (state, action) => {
                state.loading = false;

                state.messages.push({
                    role: "assistant",
                    content: action.payload
                });
                localStorage.setItem("messages", JSON.stringify(state.messages));
            })

            // ERROR HANDLING
            .addCase(generateAIResponse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export const { clearChat } = aiSlice.actions;
export default aiSlice.reducer;