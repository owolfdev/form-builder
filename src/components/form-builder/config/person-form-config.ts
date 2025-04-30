// src/components/form-builder/config/person-form-config.ts
import { z } from "zod";

export const PersonSchema = z.object({
  name: z.string().min(1, "Name required"),
  email: z.string().email(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  active: z.boolean().optional(),
});

export type PersonType = z.infer<typeof PersonSchema>;

export const personFields = [
  { name: "name", label: "Name", type: "text" },
  { name: "email", label: "Email", type: "text" },
  { name: "phone", label: "Phone", type: "text" },
  { name: "bio", label: "Bio", type: "textarea" },
  { name: "active", label: "Active", type: "checkbox" },
];
