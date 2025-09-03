import { z } from "zod";

const addressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
});

export const userSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .min(1, "Name cannot be empty")
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name cannot exceed 100 characters")
    .trim(),

  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email("Please provide a valid email address")
    .toLowerCase()
    .trim(),

  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .min(6, "Password must be at least 6 characters")
    .max(8, "Password cannot exceed 8 characters"),

  addresses: z.array(addressSchema).optional().default([]),

  phone: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val === "") return true; 
        return /^\d{7,15}$/.test(val);
      },
      {
        message: "Phone number must be between 7 and 15 digits (numbers only)",
      }
    ),
});

// Test function to validate the schema
export const testValidation = (data: any) => {
  console.log("Testing validation with:", JSON.stringify(data, null, 2));
  const result = userSchema.safeParse(data);
  if (!result.success) {
    console.log(
      "Validation errors:",
      JSON.stringify(result.error.errors, null, 2)
    );
  } else {
    console.log("Validation passed:", JSON.stringify(result.data, null, 2));
  }
  return result;
};
