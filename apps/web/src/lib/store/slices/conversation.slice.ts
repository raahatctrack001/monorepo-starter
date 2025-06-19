import { ConversationSliceStateSchema, IConversation } from '@/types/conversations/conversation.types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: ConversationSliceStateSchema = {
  conversations: [],
};

const conversationSlice = createSlice({
  name: 'conversation',
  initialState,
  reducers: {
    storeConverstaions: (state, action: PayloadAction<IConversation[]>) => {
      state.conversations = action.payload;
    },
    deleteConversations: (state)=>{
        state.conversations = []
    }
  },
});

export const {
  storeConverstaions,
  deleteConversations
} = conversationSlice.actions;

export default conversationSlice.reducer;