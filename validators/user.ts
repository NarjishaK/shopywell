// validators/user.ts
import { z } from 'zod';

const addressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
});

export const userSchema = z.object({
  name: z.string().min(3, "Name is required").max(100, "Name too long"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  addresses: z.array(addressSchema).optional(),
  //if phone is provided, it must be a string of digits with length between 7 and 15
  phone: z.string().optional().refine((val) => !val || /^\d{7,15}$/.test(val), {
    message: "Phone number must be between 7 and 15 digits",
  }),
});