// controller/category.ts
import Category from "models/category";
import asyncHandler from "express-async-handler";

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
      return res
        .status(400)
        .json({
          success: false,
          message: "Category already exists",
          error: "Category already exists",
        });
    }

    // Create new category
    const category = await Category.create({
      name,
      image,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error: any) {
    console.error("Error creating category:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
      error: "Server error",
    });
  }
});

//Get all categories---------------------------------------------------------------------------------
export const getAllCategories = asyncHandler(async (req: any, res: any) => {
  try {
    const categories = await Category.find();
    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      categories,
    });
  } catch (error: any) {
    console.error("Error fetching categories:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
      error: "Server error",
    });
  }
});
