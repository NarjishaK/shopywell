import asyncHandler from "express-async-handler";
import Users from "../models/user";
import { userSchema } from "../validators/user";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

//register user--------------------------------------------------------------------------------
export const createUser = asyncHandler(async (req: any, res: any) => {
  try {
    // Check if body exists
    if (!req.body || Object.keys(req.body).length === 0) {
      console.log(" Empty request body");
      return res.status(400).json({
        error: "Request body is empty",
      });
    }

    // Validate request body with Zod
    console.log("Starting validation...");
    const parsed = userSchema.safeParse(req.body);

    if (!parsed.success) {
      console.log("Validation failed!");
      console.log(
        "Validation errors:",
        JSON.stringify(parsed.error.errors, null, 2)
      );

      // Format validation errors nicely
      const formattedErrors = parsed.error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
        received:
          err.code === "invalid_type"
            ? typeof (err as any).received
            : undefined,
      }));

      return res.status(400).json({
        error: "Validation failed",
        details: formattedErrors,
        raw_errors: parsed.error.errors,
      });
    }

    console.log("Validation passed!");
    console.log("Parsed data:", JSON.stringify(parsed.data, null, 2));

    const { name, email, password, addresses, phone } = parsed.data;

    // Check if user exists
    console.log("Checking if user exists...");
    const userExists = await Users.findOne({ email });
    if (userExists) {
      console.log(" User already exists");
      return res.status(400).json({
        error: "User already exists",
      });
    }

    console.log("User doesn't exist, creating new user...");
    const user = await Users.create({
      name,
      email,
      password,
      addresses,
      phone,
    });

    console.log(" User created successfully!");
    console.log("User ID:", user._id);

    if (user) {
      res.status(201).json({
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
      console.log(" User creation failed");
      res.status(400).json({
        error: "Invalid user data",
      });
    }
  } catch (error: any) {
    console.error("Error creating user:");
    console.error("Error message:", error.message);
    res.status(500).json({
      error: "Internal server error",
    });
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
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
      });
    } else {
      res.status(401).json({
        error: "Invalid email or password",
      });
    }
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({
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
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
