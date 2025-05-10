// app/admin/entities/[type]/new/page.tsx
"use client";

import { notFound, useParams } from "next/navigation";
import DynamicForm from "@/components/form-builder/DynamicForm";
import type { FieldConfig } from "@/components/form-builder/types";
import { z } from "zod";

// 1. Define valid entity types
const entityTypes = ["product", "user", "location", "film"] as const;
type EntityType = (typeof entityTypes)[number];

// 2. Define Zod schemas
const schemas: Record<EntityType, z.ZodTypeAny> = {
  product: z.object({
    name: z.string().min(2),
    price: z.coerce.number(),
    inStock: z.boolean(),
  }),
  user: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    active: z.boolean(),
  }),
  location: z.object({
    name: z.string().min(2),
    address: z.string(),
    capacity: z.coerce.number().optional(),
  }),
  film: z.object({
    title: z.string().min(2),
    description: z.string(),
    releaseDate: z.coerce.date(),
    rating: z.coerce.number().min(0).max(10),
  }),
};

// 3. Define form field configs
const fieldsMap: Record<EntityType, FieldConfig<unknown>[]> = {
  product: [
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "Enter product name",
    },
    { name: "price", label: "Price", type: "number", placeholder: "0.00" },
    { name: "inStock", label: "In Stock", type: "checkbox" },
  ],
  user: [
    { name: "name", label: "Name", type: "text" },
    { name: "email", label: "Email", type: "text" },
    { name: "active", label: "Active", type: "checkbox" },
  ],
  location: [
    { name: "name", label: "Location Name", type: "text" },
    { name: "address", label: "Address", type: "text" },
    {
      name: "capacity",
      label: "Capacity",
      type: "number",
      placeholder: "Optional",
    },
  ],
  film: [
    { name: "title", label: "Title", type: "text" },
    { name: "description", label: "Description", type: "text" },
    { name: "releaseDate", label: "Release Date", type: "date" },
    { name: "rating", label: "Rating", type: "number" },
  ],
};

// 4. Main page component
export default function NewEntityPage() {
  const { type } = useParams() as { type: string };

  if (!entityTypes.includes(type as EntityType)) {
    return notFound();
  }

  const schema = schemas[type as EntityType];
  const fields = fieldsMap[type as EntityType];

  return (
    <DynamicForm
      schema={schema}
      fields={fields}
      defaultValues={{}}
      className="max-w-xl mx-auto px-4 py-20"
      onSubmit={(data) => {
        console.log(`✅ Submitted new ${type}:`, data);
        // TODO: connect to backend
      }}
    />
  );
}
