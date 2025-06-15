import { ZodError, ZodIssue, ZodSchema } from "zod";
import ApiError from "./apiError";
import ApiResponse from "./apiResponse";

export const validateData = async (schema: ZodSchema, data: unknown) => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = (result.error as ZodError).errors.map((err: ZodIssue) => ({
      path: err.path.join("."),
      message: err.message,
    }));
    throw new ApiError(403, "Error while validating data", errors);
  }
};
