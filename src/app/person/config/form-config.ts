import { z } from "zod";

export const PersonSchema = z.object({
  name: z.string().min(1, "Name required"),
  email: z.string().email(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  active: z.boolean().optional(),
});

export type PersonType = z.infer<typeof PersonSchema>;

export type PersonRecord = PersonType & {
  id: string;
  created_at?: string;
  updated_at?: string;
};

export const personFields = [
  { name: "name", label: "Name", type: "text" },
  { name: "email", label: "Email", type: "text" },
  { name: "phone", label: "Phone", type: "text" },
  { name: "bio", label: "Bio", type: "textarea" },
  { name: "active", label: "Active", type: "switch" },
];

// person-form-config.ts
export const personConfig = {
  schema: PersonSchema,
  fields: personFields,
  table: "form_builder_person",
  columns: ["id", "name", "email", "phone", "bio", "active", "created_at"],
  displayFields: ["name", "email"], // optionally used
};
