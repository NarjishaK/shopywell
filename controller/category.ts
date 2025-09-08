// controller/category.ts
import Category from "models/category";
import asyncHandler from "express-async-handler";
import { sendSuccess, sendError } from "utils/common";

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

    const { name, image } = categoryData;
    // Check if category already exists
    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      console.log("Category already exists");
      return sendError(res, 400, "Category already exists");
    }

    // Create new category
    const category = await Category.create({
      name,
      image,
    });

    return sendSuccess(res, 201, "Category created successfully", { category });
  } catch (error: any) {
    console.error("Error creating category:", error.message);
    return sendError(res, 500, error.message);
  }
});

//Get all categories---------------------------------------------------------------------------------
export const getAllCategories = asyncHandler(async (req: any, res: any) => {
  try {
    const categories = await Category.find();
    return sendSuccess(res, 200, "Categories fetched successfully", { categories });
  } catch (error: any) {
    console.error("Error fetching categories:", error.message);
    return sendError(res, 500, error.message);
  }
});
