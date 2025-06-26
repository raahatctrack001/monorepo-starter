import { IOnlineStatus } from "@/types/conversations/onlineStatus.type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: IOnlineStatus = {
    users: {},
    typingStatus: {},
    isConnected: false,
}

const onlineStatusSlice = createSlice({
    name: "onlineStatus",
    initialState,
    reducers: {
        updateWebSocketConnectedStatus(state, action: PayloadAction<{status: boolean}>) {
          state.isConnected = action.payload.status;
        },
        setUserOnline(state, action: PayloadAction<{userId: string, timestamp: Date}>) {
          state.users[action.payload.userId] = {
            isOnline: true,
            lastSeen: action.payload.timestamp || new Date(),
          };
          console.log(`user ${action.payload.userId} is now online`);
        },
        setUserOffline(state, action: PayloadAction<{ userId: string; timestamp: Date }>) {
            state.users[action.payload.userId] = {
            isOnline: false,
            lastSeen: action.payload.timestamp || new Date(),
            };
        }, 
        setTyping(state, action: PayloadAction<{ conversationId: string; userId: string }>) {
            console.log("from redux", action.payload)
            const { conversationId, userId } = action.payload;
            if (!state.typingStatus[conversationId]) {
            state.typingStatus[conversationId] = {};
            }
            state.typingStatus[conversationId][userId] = true;
        },
        stopTyping(state, action: PayloadAction<{ conversationId: string; userId: string }>) {
            const { conversationId, userId } = action.payload;
            if (state.typingStatus[conversationId]) {
                delete state.typingStatus[conversationId][userId];
            }
            console.log('stopped from redux', state.typingStatus)
        },
        clearTypingState(state, action: PayloadAction<{ conversationId: string }>) {
            delete state.typingStatus[action.payload.conversationId];
        },   
        cleanStatusData: (state) => {
            state.users=  {};
            state.typingStatus = {};
            state.isConnected=  false;
        }
    }
})

export const { 
    setUserOnline, 
    setUserOffline,
    setTyping,
    stopTyping,
    clearTypingState,
    updateWebSocketConnectedStatus,
    cleanStatusData,
} = onlineStatusSlice.actions;

export default onlineStatusSlice.reducer;