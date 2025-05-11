"use client";

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
  const { schema } = entityConfigs[type]; // loaded client-side

  return (
    <DynamicForm
      schema={schema}
      fields={fields}
      defaultValues={{}}
      className="max-w-xl mx-auto px-4 py-20"
      onSubmit={async (data) => {
        console.log(`📤 Submitting new ${type}:`, data);
        const result = await insertEntity(type, data);
        if (result.error) {
          console.error("❌ Insert failed:", result.error);
        } else {
          console.log("✅ Insert successful:", result.data);
        }
      }}
    />
  );
}
