import Product from "models/product";
import Category from "models/category";
import SubCategory from "models/subcategory";
import { IProduct } from "types/product";
import { Request, Response } from "express";

// Create a new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, category, subCategory, size, color, discount } = req.body;
    
    // Validate required fields
    if (!name || !description || !price || !category || !subCategory) {
      console.log("Name, description, price, category, and subCategory are required.");
      return res.status(400).json({ message: "Name, description, price, category, and subCategory are required." });
    }

    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
        console.log("Category does not exist.");
      return res.status(400).json({ message: "Category does not exist." });
    }

    // Check if subcategory exists
    const subCategoryExists = await SubCategory.findById(subCategory);
    if (!subCategoryExists) {
      console.log("SubCategory does not exist.");
      return res.status(400).json({ message: "SubCategory does not exist." });
    }

    // Extract S3 image URLs from uploaded files
    let images: string[] = [];
    if (req.files && (req.files as any).images) {
      const uploadedFiles = (req.files as any).images;
      images = uploadedFiles.map((file: any) => file.location); // S3 URL is in file.location
    }

    // Create new product
    const newProduct: IProduct = new Product({
      name,
      description,
      price,
      category,
      subCategory,
      images, 
      size,
      color,
      discount
    });

    await newProduct.save();
    return res.status(201).json({ 
      message: "Product created successfully", 
      product: newProduct 
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};