"use client";

import { toast } from "sonner"; // ✅ Add this
import { useRouter } from "next/navigation";
import { entityConfigs } from "./entities-config";
import DynamicForm from "./DynamicForm";
import type { EntityType } from "./entities-config";
import type { FieldConfig } from "./types";
import { insertEntity } from "./actions/insert-entity";

export function DynamicFormClientWrapper({
  type,
  fields,
}: {
  type: EntityType;
  fields: FieldConfig[];
}) {
  const router = useRouter(); // ✅ Optional for redirect
  const { schema } = entityConfigs[type];

  return (
    <DynamicForm
      schema={schema}
      fields={fields}
      defaultValues={{}}
      className="max-w-xl mx-auto px-4 py-20"
      onSubmit={async (data) => {
        const result = await insertEntity(type, data);

        if (result.error) {
          toast.error("Failed to create entity", {
            description: result.error,
          });
        } else {
          toast.success(`Created new ${type}`);
          // Optional redirect:
          router.push(`/${type}`);
        }
      }}
    />
  );
}
