import { Document } from "mongoose";
export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  category: string;
  subCategory?: string;
  images?: string[];
    size?: string;
    color?: string;
    discount?: number;
}