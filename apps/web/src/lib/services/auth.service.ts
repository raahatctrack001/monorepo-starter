import { authApi } from "@/lib/apiEndPoints/authEndPints";
import { apiConnector } from "@/lib/axiosConnector";
import { ApiConnectorParams, ApiResponse } from "@/types/apiConnector.type";
import { LoginUserSchema, RegisterUserSchema } from "@/types/user.validator";

export const registerUserService = async (data: RegisterUserSchema) => {
    const apiData: ApiConnectorParams = {
      url: authApi.registerUser(),
      method: "POST",
      bodyData: data,
      credentials: "include",
    };
    
    const response = await apiConnector<ApiResponse>(apiData);
    const result = response.data;
  
    if (!result.success) {
      throw new Error(result.message || "Registration failed!");
    }
  
    return result;  
};

export const loginUserService = async (data: LoginUserSchema) => {
    const apiData: ApiConnectorParams = {
      url: authApi.loginUser(),
      method: "POST",
      bodyData: data,
      credentials: "include",

    };
    
    const response = await apiConnector<ApiResponse>(apiData);
    const result = response.data;
  
    if (!result.success) {
      throw new Error(result.message || "Login failed!");
    }
  
    return result;  
};

export const logoutUserService = async (data: {token: string}) => {
    const apiData: ApiConnectorParams = {
      url: authApi.logoutUser(),
      method: "POST",
      bodyData: JSON.stringify(data),
      credentials: "include",

    };
    
    const response = await apiConnector<ApiResponse>(apiData);
    const result = response.data;
  
    if (!result.success) {
      throw new Error(result.message || "Logout failed!");
    }
  
    return result;  
};


