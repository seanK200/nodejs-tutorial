import { Request, Response, NextFunction } from "express";
import { Post } from "../models/Post.model";
import isInt from "validator/lib/isInt";
import ServerError from "../services/error";
import { User } from "../models/User.model";
import { Friend } from "../models/Friend.model";

const postController = {
  viewPosts: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const posts = await Post.findAll({ include: [User, Friend] });
      const postRes = posts.map((p) => p.toResponse());

      res.status(200).json({
        success: true,
        posts: postRes,
      });
    } catch (error) {
      next(error);
    }
  },
  createPost: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) throw new ServerError("UNAUTHENTICATED", 401);
      const post = await Post.create({
        content: req.body.content as string,
        createdById: user.id,
      });
      await post.reload({ include: [User] });
      res.status(201).json({
        success: true,
        post: post.toResponse(),
      });
    } catch (error) {
      next(error);
    }
  },
  editPost: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) throw new ServerError("UNAUTHENTICATED", 401);

      const postId = req.params.id;
      if (!postId) throw new ServerError("POST__MISSING_ID", 400);

      const post = await Post.findOne({
        where: { id: postId },
        include: [User],
      });
      if (!post) {
        throw new ServerError("POST__NOT_FOUND", 404);
      }

      const content = req.body.content as string;
      post.set("content", content);

      await post.save();

      res.status(200).json({
        success: true,
        post: post.toResponse(),
      });
    } catch (error) {
      next(error);
    }
  },
  deletePost: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId = req.params.id;
      if (!postId) {
        throw new ServerError("POST__MISSING_ID", 400);
      }
      const deletedCount = await Post.destroy({ where: { id: postId } });
      if (deletedCount === 0) {
        throw new ServerError("POST__NOT_FOUND", 404);
      }

      res.status(200).json({ success: true });
    } catch (error) {
      next(error);
    }
  },
};

export default postController;
