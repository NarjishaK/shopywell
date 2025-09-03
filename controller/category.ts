// controller/category.ts
import Category from "models/category";
import asyncHandler from "express-async-handler";
import { categorySchema } from "validators/category";

//Create a new category---------------------------------------------------------------------------------
export const createCategory = asyncHandler(async (req: any, res: any) => {
  try {
    //  Extract image URL from S3
    let imageUrl: string | undefined;
    if (req.files && req.files.image && req.files.image[0]) {
      imageUrl = (req.files.image[0] as any).location;
    }

    const categoryData = {
      ...req.body,
      image: imageUrl,
    };

    // Validate request body with Zod
    const parsed = categorySchema.safeParse(categoryData);
    if (!parsed.success) {
      console.log("Validation failed:", parsed.error.errors);
      return res.status(400).json({
        error: "Validation failed",
        details: parsed.error.errors,
      });
    }

    const { name, image } = parsed.data;
    // Check if category already exists
    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      console.log("Category already exists");
      return res.status(400).json({ error: "Category already exists" });
    }

    // Create new category
    const category = await Category.create({
      name,
      image,
    });

    return res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error: any) {
    console.error("Error creating category:", error.message);
    return res.status(500).json({
      error: "Server error",
      message: error.message,
    });
  }
});



//Get all categories---------------------------------------------------------------------------------
export const getAllCategories = asyncHandler(async (req: any, res: any) => {
  try {
    const categories = await Category.find();
    return res.status(200).json(categories);
  } catch (error: any) {
    console.error("Error fetching categories:", error.message);
    return res.status(500).json({
      error: "Server error",
      message: error.message,
    });
  }
});