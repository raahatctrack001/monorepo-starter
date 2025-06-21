import { IMessage, MessageSliceSchema } from "@/types/conversations/message.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: MessageSliceSchema = {
  conversations: {},
}

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    addConversationMessages: (
      state, 
      action: PayloadAction<{conversationId: string, messages: IMessage[]}>
    ) => {
      console.log("conversation added", action.payload)  
      state.conversations[action.payload.conversationId] = action.payload.messages; 
    },
    addMessageToConversation: (
      state,
      action: PayloadAction<{ conversationId: string; messages: IMessage | IMessage[] }>
    ) => {
      console.log("action.paylaod", action.payload)
      const { conversationId, messages } = action.payload;
      if(!conversationId || !messages){
        return;
      }

      if (!state.conversations[conversationId]) {
        state.conversations[conversationId] = [];
        return;
      }

      if (Array.isArray(messages)) {
        if (messages.length > 0) {
          state.conversations[conversationId].push(...messages);
        }
      } else if (messages) {
        state.conversations[conversationId].push(messages);
      }
    },
    removeMessagesFromConversation: (
      state,
      action: PayloadAction<{ conversationId: string; messageIds: string | string[] }>
    ) => {
      const { conversationId, messageIds } = action.payload;

      if (!state.conversations[conversationId]) {
        // No conversation found, nothing to remove
        return;
      }

      // Convert single id to array for consistency
      const idsToRemove = Array.isArray(messageIds) ? messageIds : [messageIds];

      // Filter out messages with matching IDs
      state.conversations[conversationId] = state.conversations[conversationId].filter(
        (message) => !idsToRemove.includes(message._id)
      );
    },

  }
})

export const {
  addConversationMessages,
  addMessageToConversation
} = messageSlice.actions;

export default messageSlice.reducer;