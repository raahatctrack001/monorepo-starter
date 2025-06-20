import { ApiConnectorParams, ApiResponse } from "@/types/apiConnector.type";
import { apiConnector } from "../axiosConnector";
import { messageApi } from "../apiEndPoints/messageEndPoints";
import { IMessage } from "@/types/conversations/message.types";


export const createMessage = async (body: any, conversationId: string, userId: string) => {
    const apiData: ApiConnectorParams = {
      url: messageApi.createMessage(conversationId, userId),
      method: "POST",
      credentials: "include",
      bodyData: body
    };
    
    const response = await apiConnector<ApiResponse>(apiData);
    const result = response.data;
  
    if (!result.success) {
      throw new Error(result.message || "Failed to create message by conversation...");
    }  

    return result;  
};

export const getMessageByConversation = async (conversationId: string, userId: string) => {
    const apiData: ApiConnectorParams = {
      url: messageApi.getMessagesByConversation(conversationId, userId),
      method: "GET",
      credentials: "include"
    };
    
    const response = await apiConnector<ApiResponse>(apiData);
    const result = response.data;
  
    if (!result.success) {
      throw new Error(result.message || "Failed to get message by conversation...");
    }  

    return result;  
};