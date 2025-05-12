import { notFound } from "next/navigation";
import { getDynamicOptions } from "@/components/form-builder/actions/get-dynamic-options";
import { DynamicFormClientWrapper } from "@/components/form-builder/DynamicFormClientWrapper";
import {
  entityConfigs,
  entityTypes,
  type EntityType,
} from "@/components/form-builder/entities-config";

function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

type Props = { params: Promise<{ type: string }> };

export default async function NewEntityPage({ params }: Props) {
  const { type } = await params;
  const entityType = type as EntityType;

  if (!entityTypes.includes(entityType)) return notFound();

  const { fields: rawFields } = entityConfigs[entityType];
  const dynamicOptions = await getDynamicOptions(entityType, rawFields);

  const fields = rawFields.map((field) =>
    field.fetchFrom
      ? { ...field, options: dynamicOptions[field.name] ?? [] }
      : field
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Create new {capitalize(entityType)}
      </h1>
      <DynamicFormClientWrapper type={entityType} fields={fields} />
    </div>
  );
}
