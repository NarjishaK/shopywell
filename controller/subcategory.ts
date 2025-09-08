// controller/subcategory.ts
import SubCategory from "models/subcategory";
import asyncHandler from "express-async-handler";
import Category from "models/category";

//Create a new subcategory---------------------------------------------------------------------------------
export const createSubCategory = asyncHandler(async (req: any, res: any) => {
  try {
    const { name, mainCategory } = req.body;

    // Check if main category exists
    const categoryExists = await Category.findById(mainCategory);
    if (!categoryExists) {
      console.log("Main category does not exist");
      return res.status(400).json({
        success: false,
        message: "Main category does not exist",
        error: "Main category does not exist",
      });
    }

    // Check if subcategory already exists
    const subcategoryExists = await SubCategory.findOne({ name, mainCategory });
    if (subcategoryExists) {
      console.log("Subcategory already exists");
      return res.status(400).json({
        success: false,
        message: "Subcategory already exists",
        error: "Subcategory already exists",
      });
    }

    // Create new subcategory
    const subcategory = await SubCategory.create({
      name,
      mainCategory,
    });

    return res.status(201).json({
      success: true,
      message: "Subcategory created successfully",
      subcategory,
    });
  } catch (error: any) {
    console.error("Error creating subcategory:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
      error: "Server error",
    });
  }
});

//Get all subcategories---------------------------------------------------------------------------------
export const getAllSubCategories = asyncHandler(async (req: any, res: any) => {
  try {
    const subcategories = await SubCategory.find().populate(
      "mainCategory",
      "name"
    );
    return res.status(200).json({
      success: true,
      message: "Subcategories fetched successfully",
      subcategories,
    });
  } catch (error: any) {
    console.error("Error fetching subcategories:", error.message);
    return res.status(500).json({
      success: false,
      error: "Server error",
      message: error.message,
    });
  }
});
