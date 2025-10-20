import { Request, Response, NextFunction } from "express";

/**
 * Placeholder auth middleware.
 * Replace with JWT validation against Auth Service when available.
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // allow for now
  next();
};