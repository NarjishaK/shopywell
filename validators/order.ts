import { z } from "zod";

const orderItemSchema = z.object({
  product: z
    .string({
      required_error: "Product ID is required",
      invalid_type_error: "Product ID must be a string",
    })
    .trim(),
  quantity: z
    .number({
      invalid_type_error: "Quantity must be a number",
    })
    .min(1, "Quantity must be at least 1")
    .default(1),
});

const addressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "ZIP code is required"),
  country: z.string().min(1, "Country is required"),
});

export const orderSchema = z.object({
  user: z
    .string({
      required_error: "User ID is required",
      invalid_type_error: "User ID must be a string",
    })
    .trim(),

  products: z
    .array(orderItemSchema)
    .min(1, "Order must have at least one item"),

  // Option 1: Accept full address object
  shippingAddress: addressSchema,

  // Option 2: Accept address index (alternative approach)
  // addressIndex: z.number().min(0, "Address index must be non-negative").optional(),

  totalAmount: z.number().optional().default(0),

  status: z
    .enum(["Pending", "Shipped", "Delivered", "Cancelled"])
    .optional()
    .default("Pending"),
});
