import mongoose from "mongoose";    
import { ISubCategory } from "../types/subcategory";

const subcategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
       mainCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        }
    }
);
const SubCategory = mongoose.model<ISubCategory>("SubCategory", subcategorySchema);
export default SubCategory;