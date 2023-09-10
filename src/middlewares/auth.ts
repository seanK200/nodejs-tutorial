import { Request, Response, NextFunction } from "express";
import AuthService from "../services/auth";

export const checkAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = await AuthService.authenticate(req);
  if (user) req.user = user;
  next();
};

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = await AuthService.authenticate(req);

  if (user) {
    req.user = user;
    next();
  } else {
    res.status(401).json({ success: false, error: "UNAUTHENTICATED" });
  }
};
