import asyncHandler from "express-async-handler";
import Users from "../models/user";
import { sendSuccess, sendError } from "../utils/common.ts";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// register user --------------------------------------------------------------------------------
export const createUser = asyncHandler(async (req: any, res: any) => {
  try {
    const { name, email, password, addresses, phone } = req.body;

    // Check if user exists
    const userExists = await Users.findOne({ email });
    if (userExists) {
        console.log("User already exists");
      return sendError(res, 400, "User already exists");
    }

    // Create user
    const user = await Users.create({
      name,
      email,
      password,
      addresses,
      phone,
    });

    if (user) {
      return sendSuccess(res, 201, "User created successfully", {
        _id: user._id,
        name: user.name,
        email: user.email,
        addresses: user.addresses,
        phone: user.phone,
      });
    } else {
      console.log("Invalid user data");
      return sendError(res, 400, "Invalid user data");
    }
  } catch (error: any) {
    console.error("Error creating user:", error.message);
    return sendError(res, 500, error.message);
  }
});

//login user--------------------------------------------------------------------------------
export const loginUser = asyncHandler(async (req: any, res: any) => {
  const { email, password } = req.body;

  try {
    const user = await Users.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "1d",
        }
      );

      return sendSuccess(res, 200, "Login successful", {
        _id: user._id,
        name: user.name,
        email: user.email,
        addresses: user.addresses,
        phone: user.phone,
        token,
      });
    } else {
      console.log("Invalid email or password");
      return sendError(res, 401, "Invalid email or password");
    }
  } catch (error) {
    console.error("Error logging in user:", error);
    return sendError(res, 500, "Internal server error");
  }
});

//get user by id --------------------------------------------------------------------------------

export const getUserById = asyncHandler(async (req: any, res: any) => {
  try {
    const user = await Users.findById(req.params.id).select("-password");
    if (user) {
      console.log("User found:", user);
      return sendSuccess(res, 200, "User fetched successfully", user);
    } else {
      console.log("User not found");
      return sendError(res, 404, "User not found");
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return sendError(res, 500, "Internal server error");
  }
});
