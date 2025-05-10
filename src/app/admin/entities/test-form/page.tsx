// app/admin/entities/test-form/page.tsx
"use client";

import { z } from "zod";
import DynamicForm from "@/components/form-builder/DynamicForm";
import type { FieldConfig } from "@/components/form-builder/types";

const schema = z.object({
  name: z.string().min(2),
  age: z.number(),
  active: z.boolean(),
  bio: z.string().optional(),
  role: z.string(),
  startDate: z.string(),
});

type SchemaType = z.infer<typeof schema>;

const fields: FieldConfig<SchemaType>[] = [
  {
    name: "name",
    label: "Full Name",
    type: "text",
    placeholder: "Enter your name",
  },
  { name: "age", label: "Age", type: "number", placeholder: "18" },
  { name: "active", label: "Is Active?", type: "checkbox" },
  {
    name: "bio",
    label: "Biography",
    type: "textarea",
    placeholder: "Write something...",
  },
  {
    name: "role",
    label: "Role",
    type: "select",
    options: [
      { label: "Admin", value: "admin" },
      { label: "Editor", value: "editor" },
      { label: "Viewer", value: "viewer" },
    ],
  },
  { name: "startDate", label: "Start Date", type: "date" },
];

export default function TestFormPage() {
  return (
    <DynamicForm
      schema={schema}
      fields={fields}
      className="max-w-xl mx-auto px-4 py-20"
      defaultValues={{
        name: "",
        age: 0,
        active: false,
        bio: "",
        role: "",
        startDate: "",
      }}
      onSubmit={(data) => {
        console.log("🧪 Test Form Submitted:", data);
      }}
    />
  );
}
