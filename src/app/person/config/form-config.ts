import { z } from "zod";

export const PersonSchema = z.object({
  name: z.string().min(1, "Name required"),
  email: z.string().email(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  active: z.boolean().optional(),
  images: z
    .array(
      z.object({
        url: z.string().url(),
        caption: z.string().optional(),
      })
    )
    .optional(), // <-- This makes the entire "images" field optional
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
  { name: "active", label: "Active", type: "checkbox" },
  {
    name: "images",
    label: "Images",
    type: "image-multi",
    bucket: "person-images",
  },
];

// person-form-config.ts
export const personConfig = {
  schema: PersonSchema,
  fields: personFields,
  table: "form_builder_person",
  columns: ["id", "name", "email", "phone", "bio", "active", "created_at"],
  displayFields: ["name", "email"], // optionally used
};
