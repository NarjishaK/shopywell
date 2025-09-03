import { Document } from "mongoose";

export interface ISubCategory extends Document {
    name: string;
    mainCategory: string;
}

