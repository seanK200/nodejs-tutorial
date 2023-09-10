import { Request, Response, NextFunction } from "express";
import { User } from "../models/User.model";
import AuthService from "../services/auth";

const authController = {
  loginEmail: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const email = req.body.email as string;
      const password = req.body.password as string;

      const user = await User.findOne({
        where: { email },
        rejectOnEmpty: true,
      });

      const [hashed] = AuthService.hashPassword(password, user.salt);
      if (hashed !== user.password) {
        throw new Error("AUTH__PW_MISMATCH");
      }

      const token = AuthService.generateToken(user.id);

      if (AuthService.METHOD === "header") {
        // Header Authorization
        res
          .status(200)
          .json({ success: true, token: token, user: user.toResponse() });
      } else {
        // Cookie Authorization
        res
          .status(200)
          .cookie(AuthService.COOKIE_NAME, `Bearer ${token}`, {
            maxAge: AuthService.COOKIE_MAXAGE,
            httpOnly: true,
          })
          .json({ success: true, user: user.toResponse() });
      }
    } catch (error) {
      console.error(error);
      res.status(401).json({ success: false });
    }
  },
};

export default authController;
