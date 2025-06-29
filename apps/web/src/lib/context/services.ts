import { IConversation } from '@/types/conversations/conversation.types';
import { updateConversation } from '../store/slices/conversation.slice';
import { addConversationMessages, addMessageToConversation } from '../store/slices/message.slice';
import { AppDispatch } from '../store/store';
import { markMessageAsDelivered } from './../services/message.service';
import { IMessage } from "@/types/conversations/message.types";
import { setUserOffline, setUserOnline } from '../store/slices/status.slice';
import { IOnlineStatus } from '@/types/conversations/onlineStatus.type';
import { safeSend } from './safeSend';

export const markDelivered = async (message: IMessage, conversation: IConversation, userId: string, dispatch: AppDispatch ) => {
    try {
        if(message?.senderId.toString() !== userId && !message.deliveredTo?.some(id=>id.toString() === userId)){
            try {
                const result = await markMessageAsDelivered(message?.conversationId.toString(), message?._id , userId)
                console.log("delivered api response", result);
            } catch (error) {
                console.log(error);
            }        
        }
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

export const callOffer = async (
    peerConnection: RTCPeerConnection | null, 
    data:{type: string, message: { to: string, from: string, offer: RTCSessionDescriptionInit}},  
    currentUserId: string, 
    conversationId: string,
    initConnection: ()=>void,
    getOrCreatePeerConnection: ()=> RTCPeerConnection,
    ws: WebSocket,
)=>{
            if (data?.message?.from === currentUserId) {
              console.log("Ignoring own offer message.");
              return;
            }              
            
            if (!peerConnection) {
              console.warn("No peer connection available. Initializing...");
              initConnection();  // call your hook's method to create a connection
              // or ideally, wait and retry after it's ready
              
            }
            const pc = peerConnection || getOrCreatePeerConnection();
            console.log("Offer received, processing...", data);
            
            await pc?.setRemoteDescription(new RTCSessionDescription(data?.message?.offer));
            const answer = await pc?.createAnswer();
            await pc?.setLocalDescription(answer);

            console.log("Answer created and set. Sending via signaling server...");

            safeSend(ws, {
              type: "call:answer",
              callInfo: {
                conversationId,
                from: currentUserId,
                answer
              }
            });
              
}
export const callAnswer = async (
    data:{type: string, message: { to: string, from: string, answer: RTCSessionDescriptionInit}},  
    currentUserId: string, 
    peerConnection: RTCPeerConnection
) => {
    console.log("Answer received:", data);
    if (data?.message?.from === currentUserId) {
        console.log("Ignoring own answer message.");
        return;
      }   
    await peerConnection?.setRemoteDescription(new RTCSessionDescription(data?.message?.answer));
    console.log("Remote description (answer) set");
}

export const addIceCandidate = async (data: any, currentUserId: string, peerConnection: RTCPeerConnection, ) => {
    console.log("Received ICE candidate", data);
        if (data?.message?.from === currentUserId) {
            console.log("Ignoring own ICE candidate");
            return;
        }

        if (!peerConnection) {
            console.warn("No peer connection available.");
            return;
        }

        await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
        console.log("ICE candidate added.");
}

export const fetchConversationMessage = (
    conversationId: string, 
    messages: IMessage[], 
    dispatch: AppDispatch,
    userId: string,
) => {
    // if(messages)
    messages.forEach( async (message)=>{
        if(message?.senderId.toString() !== userId && !message.deliveredTo?.some(id=>id.toString() === userId)){
            try {
                const result = await markMessageAsDelivered(message?.conversationId.toString(), message?._id , userId)
                console.log("delivered api response", result);
            } catch (error) {
                console.log(error);
            }        
        }
    })
    dispatch(addConversationMessages({conversationId: conversationId, messages: messages}));
}