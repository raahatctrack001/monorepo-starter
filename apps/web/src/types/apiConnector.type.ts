export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface ApiConnectorParams {
  url: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  bodyData?: any;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  credentials?: string
}
