import { NextFunction, Request, Response } from "express";
import { verifyFace } from "../services/face";

const faceRecController = {
  verifyFace: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await verifyFace();

      res.status(200).json({
        success: true,
        result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        result: null,
      });
    }
  },
};

export default faceRecController;
