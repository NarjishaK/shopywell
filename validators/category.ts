import {z} from "zod";

export const categorySchema = z.object({
  name: z
    .string({
      required_error: "Category name is required",
      invalid_type_error: "Category name must be a string",
    })
    .min(1, "Category name cannot be empty")
    .min(3, "Category name must be at least 3 characters")
    .max(50, "Category name cannot exceed 50 characters")
    .trim(),

  image: z
    .string({
      invalid_type_error: "Image URL must be a string",
    })
    .url("Please provide a valid URL")
    .optional(),
});

// Test function to validate the schema
export const testCategoryValidation = (data: any) => {
  console.log("Testing category validation with:", JSON.stringify(data, null, 2));
  const result = categorySchema.safeParse(data);
  if (!result.success) {
    console.log("Validation errors:", result.error.format());
  } else {
    console.log("Validation successful:", result.data);
  }
  return result;
};

