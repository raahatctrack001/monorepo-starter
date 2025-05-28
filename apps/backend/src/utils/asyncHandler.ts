import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Wraps an async request handler to catch errors and pass them to Express error middleware.
 *
 * @param requestHandler - The async Express route handler
 * @returns A request handler wrapped with error handling
 */
const asyncHandler = (requestHandler: (req: Request, res: Response, next: NextFunction) => Promise<any>): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch(next);
  };
};

export { asyncHandler };