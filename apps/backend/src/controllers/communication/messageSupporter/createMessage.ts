import { IMessage, Message } from "@repo/database";
import ApiError from "../../../utils/apiError";

export const createMessages = async (tailoredMessages: IMessage[]) => {
    return await Promise.all(
    tailoredMessages.map(async (payload: IMessage) => {
      const message = await Message.create(payload);
      if(!message){
        throw new ApiError(500, "Failed to send messages!")
      };
      console.log(message)
      return message
    })
  );
}