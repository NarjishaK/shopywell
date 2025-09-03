import asyncHandler from "express-async-handler";
import Users from "../models/user"; // Changed from .ts to .js
import { userSchema } from "../validators/user"; // Changed from .ts to .js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// register user
export const createUser = asyncHandler(async (req: any, res: any) => {
  try {
    // Validate request body with Zod
    const parsed = userSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Validation failed",
      });
    }
    
    const { name, email, password, addresses, phone } = parsed.data;
    
    // Check if user exists
    const userExists = await Users.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        error: "User already exists"
      });
    }
    
    // Create user (password will be hashed by the pre-save hook)
    const user = await Users.create({
      name,
      email,
      password, // Don't hash here - let the pre-save hook handle it
      addresses,
      phone,
    });
    
    if (user) {
      res.status(201).json({
        _id: user._id, // Fixed the syntax error
        name: user.name,
        email: user.email,
        addresses: user.addresses,
        phone: user.phone,
      });
    } else {
      res.status(400).json({
        error: "Invalid user data"
      });
    }
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      error: "Internal server error",
    //   message: error.message
    });
  }
});