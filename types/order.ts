import { Document } from "mongoose";
export interface IOrderItem {
 user: string;
    product: string;
    quantity: number;
    price: number;
    status: string;
  }
  
  export interface IOrder extends Document {
    user: string;
    products: IOrderItem[];
    totalAmount: number;
    status: string;
  } 