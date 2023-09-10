import { Request } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import isInt from "validator/lib/isInt";
import { createHash, randomBytes } from "crypto";
import { User } from "../models/User.model";
import ServerError from "./error";

dotenv.config();
const HOUR = 60 * 60 * 1000;

if (!process.env.JWT_SECRET) {
  // .env file does not contain variabel "JWT_SECRET"
  throw new Error("AUTH__MISSING_JWT_SECRET");
}

export default class AuthService {
  static METHOD: "cookie" | "header" = "cookie";
  static HEADER_NAME = "Access-Token";
  static COOKIE_NAME = "access_token";
  static JWT_SECRET = process.env.JWT_SECRET as string;
  static JWT_EXPIRES = "2h";
  static COOKIE_MAXAGE = 2 * HOUR;

  public static async authenticate(
    req: Request,
    method: "cookie" | "header" = this.METHOD,
  ): Promise<User | null> {
    let token: string | null;

    if (method === "cookie") {
      token = this.getTokenCookie(req);
    } else if (method === "header") {
      token = this.getTokenHeader(req);
    } else {
      throw new ServerError("AUTH__INVALID_LOCATION");
    }

    const payload = this.verifyToken(token);
    const userId = payload.sub;
    if (!userId || !isInt(userId)) {
      throw new ServerError("AUTH__INVALID_SUB", 401);
    }

    return await User.findByPk(userId);
  }

  public static verifyToken(token: string | null | undefined) {
    if (!token) {
      throw new ServerError("AUTH__MISSING_TOKEN", 401);
    }

    const payload = jwt.verify(token, this.JWT_SECRET, {
      clockTolerance: 60,
    });

    if (typeof payload === "string") {
      throw new ServerError("AUTH__INVALID_PAYLOAD", 401);
    }

    return payload;
  }

  public static generateToken(userId: number | undefined) {
    if (!userId) {
      throw new ServerError("AUTH__INVALID_USER", 401);
    }
    return jwt.sign({ type: "access" }, this.JWT_SECRET, {
      subject: String(userId),
      expiresIn: this.JWT_EXPIRES,
    });
  }

  public static hashPassword(password: string, salt?: string) {
    if (!salt) salt = randomBytes(16).toString("hex");
    const hashed = createHash("SHA512")
      .update(password)
      .update(salt)
      .digest("hex");
    return [hashed, salt];
  }

  private static getTokenCookie(req: Request): string | null {
    const token = req.cookies?.[this.COOKIE_NAME];
    if (!token || typeof token !== "string") return null;
    const idx = token.indexOf("Bearer ");
    if (idx !== 0) return null;
    return token.slice(7) || null;
  }

  private static getTokenHeader(req: Request): string | null {
    const token = req.get(this.HEADER_NAME);
    if (!token || typeof token !== "string") return null;
    const idx = token.indexOf("Bearer ");
    if (idx !== 0) return null;
    return token.slice(7) || null;
  }
}
