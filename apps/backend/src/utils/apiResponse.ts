class ApiResponse<T> {
    statusCode: number;
    message: string;
    data: T;
    success: boolean;
  
    constructor(
      statusCode: number = 500,
      message: string = "Something went wrong",
      data: T,
      success?: boolean
    ) {
      this.statusCode = statusCode;
      this.message = message;
      this.data = data;
      this.success = statusCode < 400 ? true : false;
    }
  }
  
  export default ApiResponse;
  