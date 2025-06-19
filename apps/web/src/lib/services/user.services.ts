import { ApiConnectorParams, ApiResponse } from "@/types/apiConnector.type";
import { userApi } from "../apiEndPoints/userEndpoints";
import { apiConnector } from "../axiosConnector";

export const getUserProfile = async (userId: string) => {
    const apiData: ApiConnectorParams = {
      url: userApi.getUserProfile(userId),
      method: "GET",
      credentials: "include"
    };
    
    const response = await apiConnector<ApiResponse>(apiData);
    const result = response.data;
  
    if (!result.success) {
      throw new Error(result.message || "Get User Fetching failed!");
    }  

    return result;  
};

export const getAllUserProfile = async (userId: string) => {
    const apiData: ApiConnectorParams = {
      url: userApi.getAllUserProfile(userId),
      method: "GET",
      credentials: "include"
    };
    
    const response = await apiConnector<ApiResponse>(apiData);
    const result = response.data;
  
    if (!result.success) {
      throw new Error(result.message || "Get Users Fetching failed!");
    }  

    return result;  
};