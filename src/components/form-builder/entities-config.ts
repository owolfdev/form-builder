// src/components/form-builder/entities-config.ts
import { z } from "zod";
import type { FieldConfig } from "./types";

export const entityTypes = [
  "product",
  "user",
  "location",
  "film",
  "document",
] as const;

export type EntityType = (typeof entityTypes)[number];

export type EntityConfig = {
  schema: z.ZodTypeAny;
  fields: FieldConfig[];
};

export const entityConfigs: Record<EntityType, EntityConfig> = {
  product: {
    schema: z.object({
      name: z.string().min(2),
      price: z.coerce.number(),
      inStock: z.boolean(),
    }),
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "price", label: "Price", type: "number" },
      { name: "inStock", label: "In Stock", type: "checkbox" },
    ],
  },
  user: {
    schema: z.object({
      name: z.string().min(2),
      email: z.string().email(),
      active: z.boolean(),
    }),
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "email", label: "Email", type: "text" },
      { name: "active", label: "Active", type: "checkbox" },
    ],
  },
  location: {
    schema: z.object({
      name: z.string().min(2),
      address: z.string(),
      capacity: z.coerce.number().optional(),
    }),
    fields: [
      { name: "name", label: "Location Name", type: "text" },
      { name: "address", label: "Address", type: "text" },
      { name: "capacity", label: "Capacity", type: "number" },
    ],
  },
  film: {
    schema: z.object({
      title: z.string().min(2),
      description: z.string(),
      releaseDate: z.coerce.date(),
      rating: z.coerce.number().min(0).max(10),
    }),
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "description", label: "Description", type: "text" },
      { name: "releaseDate", label: "Release Date", type: "date" },
      { name: "rating", label: "Rating", type: "number" },
    ],
  },
  document: {
    schema: z.object({
      title: z.string().min(2),
      description: z.string(),
      releaseDate: z.coerce.date(),
      rating: z.coerce.number().min(0).max(10),
      tags: z.array(z.string()).optional(),
    }),
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "description", label: "Description", type: "text" },
      { name: "releaseDate", label: "Release Date", type: "date" },
      { name: "rating", label: "Rating", type: "number" },
      { name: "tags", label: "Tags", type: "multi-select", fetchFrom: "tag" },
    ],
  },
};
