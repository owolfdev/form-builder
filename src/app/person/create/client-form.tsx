// src/app/person/create/client-form.tsx
"use client";

import { useRouter } from "next/navigation";
import { DynamicForm } from "@/components/form-builder/core/dynamic-form";
import { createRecord } from "@/components/form-builder/actions/create-record";
import { PersonSchema, personConfig } from "../config/form-config";
import type { PersonRecord } from "../config/form-config";
import type { FormFieldConfig } from "@/components/form-builder/core/types";

interface Props {
  fields: FormFieldConfig[];
}

export default function CreatePersonClientForm({ fields }: Props) {
  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Create Person</h1>
      <DynamicForm
        schema={PersonSchema}
        fields={fields}
        onSubmit={async (values) => {
          console.log("🧾 Submitted values:", values);

          try {
            const newPerson = await createRecord<PersonRecord>(
              personConfig,
              values
            );
            router.push(`/person/${newPerson.id}`);
          } catch (error) {
            console.error("❌ Failed to create person:", error);
          }
        }}
      />
    </div>
  );
}
