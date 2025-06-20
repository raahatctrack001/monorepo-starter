import { ApiConnectorParams, ApiResponse } from "@/types/apiConnector.type";
import { conversationApi } from "../apiEndPoints/conversationEndpoints";
import { apiConnector } from "../axiosConnector";
import { messageApi } from "../apiEndPoints/messageEndPoints";

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