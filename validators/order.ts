import {z} from "zod";

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

  // totalAmount is calculated server-side, so it's optional here
  totalAmount: z.number().optional().default(0),

  status: z
    .enum(["Pending", "Shipped", "Delivered", "Cancelled"])
    .optional()
    .default("Pending"),
});

// Test function to validate the schema
export const testValidation = (data: any) => {
  console.log("Testing validation with:", JSON.stringify(data, null, 2));
  const result = orderSchema.safeParse(data);
  if (!result.success) {
    console.log(
      "Validation errors:",
      JSON.stringify(result.error.format(), null, 2)
    );
  } else {
    console.log("Validation successful:", result.data);
  }
  return result;
};