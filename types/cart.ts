// types/cart.ts
import { Document } from "mongoose";

export interface ICartItem {
  product: string;
  quantity: number;
}

export interface ICart extends Document {
  user: string;
  products: ICartItem[];
}
