type ErrorDetail = string | Error | Record<string, any>;

class ApiError extends Error {
  statusCode: number;
  errors: ErrorDetail[];
  data: any; //to keep data for contextual data
  success: boolean;

  constructor(
    statusCode: number,
    message: string = "Something went WRONG!",
    errors: ErrorDetail[] = [],
    stack: string = ""
  ) {
    super(message);

    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.data = null;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export const apiErrorFunction = async (statusCode:number, message: string) => {
  throw new ApiError(statusCode, message);
}

export default ApiError;
