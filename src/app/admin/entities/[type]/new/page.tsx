import { z } from "zod";
import DynamicForm from "@/components/form-builder/DynamicForm";
import type { FieldConfig } from "@/components/form-builder/types";

const productSchema = z.object({
  name: z.string().min(2),
  price: z.number(),
  inStock: z.boolean().default(true),
});

const productFields: FieldConfig[] = [
  {
    name: "name",
    label: "Name",
    type: "text",
    placeholder: "Enter product name",
  },
  { name: "price", label: "Price", type: "number", placeholder: "0.00" },
  { name: "inStock", label: "In Stock", type: "checkbox" },
];

export default function NewEntityPage() {
  return (
    <DynamicForm
      schema={productSchema}
      fields={productFields}
      onSubmit={(data) => {
        console.log("🧾 Mock Submitted:", data);
      }}
      defaultValues={{ name: "", price: 0, inStock: false }}
    />
  );
}
