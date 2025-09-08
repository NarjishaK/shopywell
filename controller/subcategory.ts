// controller/subcategory.ts
import SubCategory from "models/subcategory";
import asyncHandler from "express-async-handler";
import Category from "models/category";
import { sendSuccess, sendError } from "../utils/common.ts";


//Create a new subcategory---------------------------------------------------------------------------------
export const createSubCategory = asyncHandler(async (req: any, res: any) => {
  try {
    const { name, mainCategory } = req.body;

    // Check if main category exists
    const categoryExists = await Category.findById(mainCategory);
    if (!categoryExists) {
      console.log("Main category does not exist");
      return sendError(res, 400, "Main category does not exist");
    }

    // Check if subcategory already exists
    const subcategoryExists = await SubCategory.findOne({ name, mainCategory });
    if (subcategoryExists) {
      console.log("Subcategory already exists");
      return sendError(res, 400, "Subcategory already exists");
    }

    // Create new subcategory
    const subcategory = await SubCategory.create({
      name,
      mainCategory,
    });

    return sendSuccess(res, 201, "Subcategory created successfully", { subcategory });
  } catch (error: any) {
    console.error("Error creating subcategory:", error.message);
    return sendError(res, 500, error.message);
  }
});

//Get all subcategories---------------------------------------------------------------------------------
export const getAllSubCategories = asyncHandler(async (req: any, res: any) => {
  try {
    const subcategories = await SubCategory.find().populate(
      "mainCategory",
      "name"
    );
    return sendSuccess(res, 200, "Subcategories fetched successfully", { subcategories });
  } catch (error: any) {
    console.error("Error fetching subcategories:", error.message);
    return sendError(res, 500, error.message);
  }
});


// Delete a subcategory by ID -------------------------------------------------------------------------------
export const deleteSubCategory = asyncHandler(async (req: any, res: any) => {
  try {
    const subcategoryId = req.params.id;

    // Check if subcategory exists
    const subcategory = await SubCategory.findById(subcategoryId);
    if (!subcategory) {
      console.log("Subcategory not found");
      return sendError(res, 404, "Subcategory not found");
    }

    // Delete the subcategory
    await SubCategory.findByIdAndDelete(subcategoryId);
    return sendSuccess(res, 200, "Subcategory deleted successfully");
  } catch (error: any) {
    console.error("Error deleting subcategory:", error.message);
    return sendError(res, 500, error.message);
  }
});