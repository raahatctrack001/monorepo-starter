
import { cleanUserData } from "../slices/user.slice";
import { cleanConversationData } from "../slices/conversation.slice";
import { cleanMessageData } from "../slices/message.slice";
import { cleanStatusData } from "../slices/status.slice";
import { AppDispatch } from "../store";

export const clearAllAppState = () => (dispatch: AppDispatch) => {
    console.log("|calling safai abhiyan")
  dispatch(cleanUserData());
  dispatch(cleanConversationData());
  dispatch(cleanMessageData());
  dispatch(cleanStatusData());
};
