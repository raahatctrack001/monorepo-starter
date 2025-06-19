import { ApiConnectorParams, ApiResponse } from "@/types/apiConnector.type";
import { conversationApi } from "../apiEndPoints/conversationEndpoints";
import { apiConnector } from "../axiosConnector";
import { IConversation } from "@/types/conversations/conversation.types";

export const createConversation = async (creatorId: string) => {
    const apiData: ApiConnectorParams = {
      url: conversationApi.createConversation(creatorId),
      method: "POST",
      credentials: "include"
    };
    
    const response = await apiConnector<ApiResponse>(apiData);
    const result = response.data;
  
    if (!result.success) {
      throw new Error(result.message || "Failed to initiate conversation...");
    }  

    return result;  
};

export const getAllConversation = async (creatorId: string) => {
    const apiData: ApiConnectorParams = {
      url: conversationApi.getAllConversations(creatorId), //created by this user or is a participants
      method: "GET",
      credentials: "include"
    };
    
    const response = await apiConnector<ApiResponse>(apiData);
    const result = response.data;
  
    if (!result.success) {
      throw new Error(result.message || "Failed to get conversation...");
    }  
    return result;  
};

export const handleSelectedConversation = async (conversation: IConversation) => {
  console.log("conversation selected", conversation)
  const apiData: ApiConnectorParams = {
      url: conversationApi.getConversationById(conversation?._id as string), //created by this user or is a participants
      method: "GET",
      credentials: "include"
    };
    
    const response = await apiConnector<ApiResponse>(apiData);
    const result = response.data;
  
    if (!result.success) {
      throw new Error(result.message || "Failed to get conversation...");
    }  
    return result;
}