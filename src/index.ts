import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./services/database";
import { checkAuth, requireAuth } from "./middlewares/auth";
import {
  validateCreateAccount,
  validateLoginEmail,
} from "./middlewares/validators";
import accountController from "./controllers/account";
import authController from "./controllers/auth";
import postController from "./controllers/post";
import { errorHandler } from "./controllers/error";

// Config
dotenv.config();
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// Controllers
app
  .route("/account")
  .get(requireAuth, accountController.viewMyAccount)
  .post(validateCreateAccount, accountController.createAccount);
app.post("/auth/email", validateLoginEmail, authController.loginEmail);
app
  .route("/posts")
  .get(checkAuth, postController.viewPosts)
  .post(requireAuth, postController.createPost);
app
  .route("/post/:id")
  .put(requireAuth, postController.editPost)
  .delete(requireAuth, postController.deletePost);

// Error Handler (ALWAYS last)
app.use(errorHandler);

// Server start
const startServer = async () => {
  await connectDB();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`✅ Server started at port ${PORT}`));
};
startServer();
