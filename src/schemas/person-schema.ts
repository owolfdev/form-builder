// src/schemas/person-schema.ts
import { z } from "zod";

export const PersonSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  bio: z.string().optional(),
  // active: z.boolean().optional(),
});

export type PersonType = z.infer<typeof PersonSchema>;
