import mongoose from "mongoose";
import { ICategory } from "../types/category";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
    },
  }
);

const Category = mongoose.model<ICategory>("Category", categorySchema);
export default Category;
