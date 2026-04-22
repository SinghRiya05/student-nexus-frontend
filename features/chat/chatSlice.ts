import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatState, IMessage } from "./chatModel";
import { fetchChats, accessChat, sendMessage, getMessages, clearChatMessages, deleteChatConversation } from "./chatThunk";

const initialState: ChatState = {
    chats: [],
    messages: {},
    typingUsers: {},
    unreadCounts: {},
    selectedChatId: null,
    loading: false,
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setSelectedChatId: (state, action: PayloadAction<string | null>) => {
            state.selectedChatId = action.payload;
            if (action.payload) {
                state.unreadCounts[action.payload] = 0;
            }
        },
        addMessage: (state, action: PayloadAction<IMessage>) => {
            const chatId = typeof action.payload.chat === 'string' 
                ? action.payload.chat 
                : action.payload.chat._id;
            
            if (!state.messages[chatId]) {
                state.messages[chatId] = [];
            }
            // Check for duplicates
            if (!state.messages[chatId].find(m => m._id === action.payload._id)) {
                state.messages[chatId].push(action.payload);

                // Increment unread count IF NOT the currently selected chat
                if (state.selectedChatId !== chatId) {
                    state.unreadCounts[chatId] = (state.unreadCounts[chatId] || 0) + 1;
                }
            }

            // Update latestMessage in chats array and move to top
            const chatIndex = state.chats.findIndex(c => c._id === chatId);
            if (chatIndex !== -1) {
                const targetChat = state.chats[chatIndex];
                targetChat.latestMessage = action.payload;
                targetChat.lastActivity = action.payload.createdAt;
                
                // Move to top
                state.chats.splice(chatIndex, 1);
                state.chats.unshift(targetChat);
            }
        },
        clearMessages: (state, action: PayloadAction<string>) => {
            state.messages[action.payload] = [];
        },
        setTypingStatus: (state, action: PayloadAction<{ chatId: string; userId: string; isTyping: boolean }>) => {
            const { chatId, userId, isTyping } = action.payload;
            if (!state.typingUsers[chatId]) {
                state.typingUsers[chatId] = [];
            }
            if (isTyping) {
                if (!state.typingUsers[chatId].includes(userId)) {
                    state.typingUsers[chatId].push(userId);
                }
            } else {
                state.typingUsers[chatId] = state.typingUsers[chatId].filter(id => id !== userId);
            }
        },
        updateMessageReadStatus: (state, action: PayloadAction<{ chatId: string; messageId: string; userId: string }>) => {
            const { chatId, messageId, userId } = action.payload;
            if (state.messages[chatId]) {
                const message = state.messages[chatId].find(m => m._id === messageId);
                if (message && !message.readBy.includes(userId)) {
                    message.readBy.push(userId);
                }
            }
        },
        markAllMessagesAsReadInChat: (state, action: PayloadAction<{ chatId: string; userId: string }>) => {
            const { chatId, userId } = action.payload;
            if (state.messages[chatId]) {
                state.messages[chatId].forEach(msg => {
                    if (!msg.readBy.includes(userId)) {
                        msg.readBy.push(userId);
                    }
                });
            }
        },
        incrementUnreadCount: (state, action: PayloadAction<string>) => {
            const chatId = action.payload;
            state.unreadCounts[chatId] = (state.unreadCounts[chatId] || 0) + 1;
        },
        resetUnreadCount: (state, action: PayloadAction<string>) => {
            state.unreadCounts[action.payload] = 0;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchChats.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchChats.fulfilled, (state, action) => {
                state.loading = false;
                state.chats = action.payload.data;
            })
            .addCase(fetchChats.rejected, (state) => {
                state.loading = false;
            })
            .addCase(accessChat.pending, (state) => {
                state.loading = true;
            })
            .addCase(accessChat.fulfilled, (state, action) => {
                state.loading = false;
                const exists = state.chats.find(c => c._id === action.payload.data._id);
                if (!exists) {
                    state.chats.unshift(action.payload.data);
                }
                state.selectedChatId = action.payload.data._id;
            })
            .addCase(accessChat.rejected, (state) => {
                state.loading = false;
            })
            .addCase(sendMessage.pending, (state) => {
                state.loading = true;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.loading = false;
                const chatId = typeof action.payload.data.chat === 'string' 
                    ? action.payload.data.chat 
                    : action.payload.data.chat._id;
                
                if (!state.messages[chatId]) {
                    state.messages[chatId] = [];
                }
                // Update or push
                const msgIndex = state.messages[chatId].findIndex(m => m._id === action.payload.data._id);
                if (msgIndex !== -1) {
                    state.messages[chatId][msgIndex] = action.payload.data;
                } else {
                    state.messages[chatId].push(action.payload.data);
                }

                // Update latestMessage and move to top
                const chatIndex = state.chats.findIndex(c => c._id === chatId);
                if (chatIndex !== -1) {
                    const targetChat = state.chats[chatIndex];
                    targetChat.latestMessage = action.payload.data;
                    targetChat.lastActivity = action.payload.data.createdAt;
                    state.chats.splice(chatIndex, 1);
                    state.chats.unshift(targetChat);
                }
            })
            .addCase(sendMessage.rejected, (state) => {
                state.loading = false;
            })
            .addCase(getMessages.pending, (state) => {
                state.loading = true;
            })
            .addCase(getMessages.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.data.length > 0) {
                    const chatId = typeof action.payload.data[0].chat === 'string' 
                        ? action.payload.data[0].chat 
                        : action.payload.data[0].chat._id;
                    state.messages[chatId] = action.payload.data;
                }
            })
            .addCase(getMessages.rejected, (state, action) => {
                state.loading = false;
            })
            // Clear Chat
            .addCase(clearChatMessages.fulfilled, (state, action) => {
                const { chatId } = action.payload;
                state.messages[chatId] = [];
            })
            // Delete Chat
            .addCase(deleteChatConversation.fulfilled, (state, action) => {
                const { chatId } = action.payload;
                state.chats = state.chats.filter(c => c._id !== chatId);
                if (state.selectedChatId === chatId) {
                    state.selectedChatId = null;
                }
            });
    },
});

export const { 
    setSelectedChatId, 
    addMessage, 
    clearMessages, 
    setTypingStatus, 
    updateMessageReadStatus,
    markAllMessagesAsReadInChat,
    incrementUnreadCount,
    resetUnreadCount 
} = chatSlice.actions;
export default chatSlice.reducer;
