// src/schemas/person-schema.ts

import { z } from "zod";

// ✅ Define the Zod Schema
export const PersonSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  age: z.number().min(0).max(120).optional(),
  bio: z.string().optional(),
  is_active: z.boolean().optional(),
});

// ✅ Generate TypeScript Type
export type PersonType = z.infer<typeof PersonSchema>;
