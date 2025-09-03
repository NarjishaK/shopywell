import asyncHandler from "express-async-handler";
import Users from "../models/user";
import { userSchema } from "../validators/user";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// register user
export const createUser = asyncHandler(async (req: any, res: any) => {
  try {
    // Validate request body with Zod
    const parsed = userSchema.safeParse(req.body);
    if (!parsed.success) {
      console.log("Validation errors:", parsed.error.errors);
      return res.status(400).json({
        error: "Validation failed",
      });
    }

    const { name, email, password, addresses, phone } = parsed.data;

    // Check if user exists
    const userExists = await Users.findOne({ email });
    if (userExists) {
      console.log("User already exists");
      return res.status(400).json({
        error: "User already exists",
      });
    }

    // Create user (password will be hashed by the pre-save hook)
    const user = await Users.create({
      name,
      email,
      password,
      addresses,
      phone,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        addresses: user.addresses,
        phone: user.phone,
      });
    } else {
      console.log("Invalid user data");
      res.status(400).json({
        error: "Invalid user data",
      });
    }
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

//get user by id
export const getUserById = asyncHandler(async (req: any, res: any) => {
  try {
    const user = await Users.findById(req.params.id).select("-password");
    if (user) {
        console.log("User found:", user);
      res.json(user);
    } else {
      console.log("User not found");
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
