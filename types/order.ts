import { Document } from "mongoose";

export interface IAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface IOrderItem {
  product: string;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  user: string;
  products: IOrderItem[];
  shippingAddress: IAddress;
  totalAmount: number;
  status: string;
}