import { IConversation } from '@/types/conversations/conversation.types';
import { updateConversation } from '../store/slices/conversation.slice';
import { addMessageToConversation } from '../store/slices/message.slice';
import { AppDispatch } from '../store/store';
import { markMessageAsDelivered } from './../services/message.service';
import { IMessage } from "@/types/conversations/message.types";
import { setUserOffline, setUserOnline } from '../store/slices/status.slice';
import { IOnlineStatus } from '@/types/conversations/onlineStatus.type';

export const markDelivered = async (message: IMessage, conversation: IConversation, userId: string, dispatch: AppDispatch ) => {
    try {
        const result = await markMessageAsDelivered(message?.conversationId.toString(), message?._id , userId)
        console.log("delivered api response", result);
        dispatch(updateConversation(conversation))
        dispatch(addMessageToConversation({
          conversationId: conversation?._id,
          messages: [message]
        }))
    } catch (error) {
        console.log("error sending delivered notification", error)
    }                    
}

export const updateOnlineStatus = (isOnline: boolean, userId: string, dispatch: AppDispatch, timestamp?: Date) => {
    if(isOnline)
        dispatch(setUserOnline({userId:userId, timestamp: timestamp || new Date()}))
    else
        dispatch(setUserOffline({userId: userId, timestamp: timestamp || new Date()}))
}