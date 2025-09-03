//jwt authentication middleware
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Users from "../models/user";
import asyncHandler from "express-async-handler";

dotenv.config();

interface JwtPayload {
  id: string;
}

export const protect = asyncHandler(async (req: any, res: any, next: any) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as JwtPayload;

      // Get user from the token
      req.user = await Users.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.error("Error in auth middleware:", error);
      res.status(401).json({ error: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ error: "Not authorized, no token" });
  }
});