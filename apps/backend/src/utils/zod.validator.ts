import { ZodError, ZodIssue, ZodSchema } from "zod";
import ApiError from "./apiError";
import ApiResponse from "./apiResponse";

/**
 * 
 * @param schema zod schema to be passed through which data have to be validated
 * @param data data object that needs to be passed inside safeParse
 */
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
