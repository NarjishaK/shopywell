import mongoose from "mongoose";
import { IProduct } from "../types/product";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    size: {
      type: String,
    },
    color: {
      type: String,
    },
    discount: {
      type: Number,
      default: 0,
    }
    },  
    { timestamps: true }
);
const Product = mongoose.model<IProduct>("Product", productSchema);
export default Product;