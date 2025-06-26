import { ConversationSliceStateSchema, IConversation } from '@/types/conversations/conversation.types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: ConversationSliceStateSchema = {
  conversations: [],
  activeConversation: null,
};

const conversationSlice = createSlice({
  name: 'conversation',
  initialState,
  reducers: {
    storeConverstaions: (state, action: PayloadAction<IConversation[]>) => {
      state.conversations = action.payload;
      console.log("conversation stored")
    },
    updateConversation: (state, action: PayloadAction<IConversation>) => {
      const conversation = action.payload;
      if (!conversation) {
        return;
      }
      const existingIndex = state.conversations.findIndex(c => c._id === conversation._id);

      if (existingIndex === 0) {
        // Already at first position, just update it - no sorting needed
        state.conversations[0] = conversation;
        return;
      }

      if (existingIndex !== -1) {
        // Update existing conversation
        state.conversations[existingIndex] = conversation;
      } else {
        // Add new conversation
        state.conversations.push(conversation);
      }

      // Sort conversations by most recent message
      state.conversations.sort((a, b) => {
        // Helper function to get timestamp from conversation
        const getTimestamp = (conv: IConversation): number => {
          if (conv.lastMessage) {
            // Use lastMessageAt.sentAt if available, otherwise fall back to lastMessage.createdAt
            return new Date(conv?.lastMessageAt || conv?.updatedAt).getTime();
          }
          // If no lastMessage, use conversation createdAt or 0 as fallback
          return conv.createdAt ? new Date(conv.createdAt).getTime() : 0;
        };

        const aTime = getTimestamp(a);
        const bTime = getTimestamp(b);
        
        return bTime - aTime; // Most recent first
      });
      console.log("conversation updated")
    },
    activateConverstaion: (state, action: PayloadAction<IConversation>) => {
      if(!action.payload)
          return;
      state.activeConversation = action.payload;
      console.log("conversation activated")
    },
    deactivateConversation: (state)=>{
      state.activeConversation=null;
    },
    deleteConversations: (state)=>{
        state.conversations = [];
        console.log("conversation deleted")
    },   
    cleanConversationData: (state) => {
      state.activeConversation = null;
      state.conversations = [];
    }
  },
});

export const {
  storeConverstaions,
  deleteConversations,
  activateConverstaion,
  deactivateConversation,
  updateConversation,
  cleanConversationData,
} = conversationSlice.actions;

export default conversationSlice.reducer;