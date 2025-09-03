// validators/cart.ts
import { z } from "zod";

const cartItemSchema = z.object({
  product: z
    .string({
      required_error: "Product ID is required",
      invalid_type_error: "Product ID must be a string",
    })
    .trim(),
  // quantity defaults to 1 if not provided
  quantity: z
    .number({
      invalid_type_error: "Quantity must be a number",
    })
    .min(1, "Quantity must be at least 1")
    .default(1),
});

export const cartSchema = z.object({
  products: z.array(cartItemSchema).min(1, "Cart must have at least one item"),
});

// Test function to validate the schema
export const testValidation = (data: any) => {
  console.log("Testing validation with:", JSON.stringify(data, null, 2));
  const result = cartSchema.safeParse(data);
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
