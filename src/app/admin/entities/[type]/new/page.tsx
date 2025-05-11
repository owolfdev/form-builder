// app/admin/entities/[type]/new/page.tsx
import { notFound } from "next/navigation";
import { getDynamicOptions } from "@/components/form-builder/actions/get-dynamic-options";
import { DynamicFormClientWrapper } from "@/components/form-builder/DynamicFormClientWrapper";
import {
  entityConfigs,
  entityTypes,
  type EntityType,
} from "@/components/form-builder/entities-config";

export default async function NewEntityPage({
  params,
}: {
  params: { type: string };
}) {
  const type = params.type as EntityType;

  if (!entityTypes.includes(type)) return notFound();

  const { fields: rawFields } = entityConfigs[type];
  const dynamicOptions = await getDynamicOptions(type, rawFields);

  const fields = rawFields.map((field) =>
    field.fetchFrom
      ? { ...field, options: dynamicOptions[field.name] ?? [] }
      : field
  );

  return <DynamicFormClientWrapper type={type} fields={fields} />;
}
