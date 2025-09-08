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


//getAllUsers--------------------------------------------------------------------------------
export const getAllUsers = asyncHandler(async (req: any, res: any) => {
  try {
    const users = await Users.find();
    return sendSuccess(res, 200, "Users fetched successfully", { users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return sendError(res, 500, "Internal server error");
  }
});

//delete user by id--------------------------------------------------------------------------------
export const deleteUser = asyncHandler(async (req: any, res: any) => {
  try {
    const user = await Users.findByIdAndDelete(req.params.id);
    if (user) {
      console.log("User deleted:", user);
      return sendSuccess(res, 200, "User deleted successfully", {});
    } else {
      console.log("User not found");
      return sendError(res, 404, "User not found");
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    return sendError(res, 500, "Internal server error");
  }
});

//update user by id--------------------------------------------------------------------------------
export const updateUser = asyncHandler(async (req: any, res: any) => {
  try {
    const user = await Users.findById(req.params.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.addresses = req.body.addresses || user.addresses;
      user.phone = req.body.phone || user.phone;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      return sendSuccess(res, 200, "User updated successfully", {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        addresses: updatedUser.addresses,
        phone: updatedUser.phone,
      });
    } else {
      console.log("User not found");
      return sendError(res, 404, "User not found");
    }
  } catch (error) {
    console.error("Error updating user:", error);
    return sendError(res, 500, "Internal server error");
  }
});