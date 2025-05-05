import { z } from "zod";
import { getTagOptions } from "@/components/form-builder/actions/get-tag-options";
import { getCategoryOptions } from "@/components/form-builder/actions/get-category-options";

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
  tags: z.array(z.string()).default([]),
  categories: z.array(z.string()).default([]),
});

export type PersonType = z.infer<typeof PersonSchema>;

export type PersonRecord = PersonType & {
  id: string;
  created_at?: string;
  updated_at?: string;
  tags: string[];
  categories: string[];
  images: {
    url: string;
    caption: string;
  }[];
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
  {
    name: "tags",
    label: "Tags",
    type: "multi-select",
    optionsLoader: getTagOptions,
  },
  {
    name: "categories",
    label: "Categories",
    type: "multi-select",
    optionsLoader: getCategoryOptions,
  },
];

export const categoryStoreTable = "form_builder_person_category_store";
export const tagStoreTable = "form_builder_person_tag_store";

// person-form-config.ts
export const personConfig = {
  schema: PersonSchema,
  fields: personFields,
  table: "form_builder_person",
  columns: ["id", "name", "email", "phone", "bio", "active", "created_at"],
  displayFields: ["name", "email"], // optionally used
};
