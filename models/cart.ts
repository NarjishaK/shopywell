// models/cart.ts
import mongoose from "mongoose";
import { ICart } from "../types/cart";

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],
  },
  { timestamps: true }
);

const Cart = mongoose.model<ICart>("Cart", cartSchema);
export default Cart;
