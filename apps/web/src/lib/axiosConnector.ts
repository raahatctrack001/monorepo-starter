import { ApiConnectorParams } from "@/types/apiConnector.type"
import axios, { AxiosResponse } from "axios";

export const axiosInstance = axios.create({})

export const apiConnector = async <T>(
  apiData: ApiConnectorParams
): Promise<AxiosResponse<T>> => {
  return axiosInstance({
    method: apiData.method,
    url: apiData.url,
    data: apiData.bodyData || null,
    headers: apiData.headers || undefined,
    params: apiData.params || undefined,
    withCredentials: apiData.credentials === "include" ? true : false, // 👈 here it reads your config
  });
};
