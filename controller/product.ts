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


// Get all products with pagination 10 products per page------------------------------------------------------------------------------------------------
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const products = await Product.find()
      .populate('category', 'name') 
      .populate('subCategory', 'name') 
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);

    return res.status(200).json({
      message: "Products fetched successfully",
      products,
      page,
      totalPages,
      totalProducts
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

// Get product by ID------------------------------------------------------------------------------------------------
export const getProductById = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId)
      .populate('category', 'name') 
      .populate('subCategory', 'name');

    if (!product) {
      console.log("Product not found with ID:", productId);
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Product fetched successfully",
      product
    });
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};