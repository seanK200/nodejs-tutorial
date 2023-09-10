import { Request, Response, NextFunction } from "express";
import isEmail from "validator/lib/isEmail";
import { User } from "../models/User.model";

export const validateLoginEmail = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.body) throw new Error("AUTH__MISSING_BODY");
    const email = req.body.email;
    if (typeof email !== "string") throw new Error("AUTH__INVALID_EMAIL_TYPE");
    if (!isEmail(email)) throw new Error("AUTH__INVALID_EMAIL");
    const password = req.body.password;
    if (typeof password !== "string") throw new Error("AUTH__INVALID_PW_TYPE");
    if (password.length === 0 || password.length > 128)
      throw new Error("AUTH__INVALID_PW");

    next(); // validation success
  } catch (error) {
    if (error instanceof Error) {
      // validation fail
      res.status(400).json({ success: false, error: error.message });
    } else {
      res.status(500).json({ success: false, error: String(error) });
      throw error;
    }
  }
};

export const validateCreateAccount = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.body) throw new Error("ACCOUNT__MISSING_BODY");

    const email = req.body.email;
    const password = req.body.password;

    if (!email || typeof email !== "string" || !isEmail(email)) {
      throw new Error("ACCOUNT__INVALID_EMAIL");
    }

    if (!password || typeof password !== "string") {
      throw new Error("ACCOUNT__MISSING_PW");
    }

    if (password.length < 5) {
      throw new Error("ACCOUNT__PW_TOO_SHORT");
    }

    if (password.length > 64) {
      throw new Error("ACCOUNT__PW_TOO_LONG");
    }

    const emailExists = await User.findOne({ where: { email } });
    if (emailExists) {
      throw new Error("ACCOUNT__EMAIL_ALREADY_EXISTS");
    }

    next(); // validation success
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, error: error.message });
    } else {
      res.status(500).json({ success: false, error: String(error) });
      throw error;
    }
  }
};
