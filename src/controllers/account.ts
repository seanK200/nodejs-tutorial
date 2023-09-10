import { Request, Response, NextFunction } from "express";
import ServerError from "../services/error";
import AuthService from "../services/auth";
import { User } from "../models/User.model";

const accountController = {
  viewMyAccount: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) throw new ServerError("UNAUTHENTICATED", 401);
      res.status(200).json({
        success: true,
        user: user.toResponse(),
      });
    } catch (error) {
      next(error);
    }
  },
  createAccount: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const email = req.body.email;
      const password = req.body.password;

      const [hashed, salt] = AuthService.hashPassword(password);

      const user = await User.create({
        email: email,
        password: hashed,
        salt: salt,
      });

      const token = AuthService.generateToken(user.id);

      const response = {
        success: true,
        token: "",
        user: user.toResponse(),
      };

      res.status(201);
      if (AuthService.METHOD === "header") {
        response.token = token;
      } else {
        res.cookie(AuthService.COOKIE_NAME, `Bearer ${token}`, {
          maxAge: AuthService.COOKIE_MAXAGE,
          httpOnly: true,
        });
      }
      res.json(response);
    } catch (error) {
      next(error);
    }
  },
};

export default accountController;
