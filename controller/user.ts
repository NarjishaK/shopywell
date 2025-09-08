import asyncHandler from "express-async-handler";
import Users from "../models/user";
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
      return res.status(400).json({ error: "User already exists" });
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
      return res.status(201).json({
        success: true,
        message: "User created successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          addresses: user.addresses,
          phone: user.phone,
        },
      });
    } else {
      console.log("Invalid user data");
      return res.status(400).json({
        success: false,
        error: "Invalid user data",
        message: "Invalid user data",
      });
    }
  } catch (error: any) {
    console.error("Error creating user:", error.message);
    res
      .status(500)
      .json({ success: false, error: "Server error", message: error.message });
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

      res.status(200).json({
        success: true,
        message: "User logged in successfully",
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
        error: "Invalid email or password",
      });
    }
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: "Internal server error",
    });
  }
});

//get user by id --------------------------------------------------------------------------------

export const getUserById = asyncHandler(async (req: any, res: any) => {
  try {
    const user = await Users.findById(req.params.id).select("-password");
    if (user) {
      console.log("User found:", user);
      res.json(user);
    } else {
      console.log("User not found");
      res.status(404).json({
        success: false,
        message: "User not found",
        error: "User not found",
      });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Internal server error",
        error: "Internal server error",
      });
  }
});
