"use client";

import { entityConfigs } from "./entities-config";
import DynamicForm from "./DynamicForm";
import type { EntityType } from "./entities-config";
import type { FieldConfig } from "./types";

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
      onSubmit={(data) => {
        console.log(`✅ Submitted new ${type}:`, data);
      }}
    />
  );
}
