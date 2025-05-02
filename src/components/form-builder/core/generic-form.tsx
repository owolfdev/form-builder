"use client";

import { useForm, type DefaultValues, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodObject, ZodRawShape, TypeOf } from "zod";
import { Form } from "@/components/ui/form";
import AutoFieldInput from "@/components/form-builder/core/auto-field-input";

interface FieldConfig {
  name: string;
  label?: string;
  type?: string;
  bucket?: string;
  multi?: boolean;
}

interface GenericFormProps<T extends ZodObject<ZodRawShape>> {
  schema: T;
  fields: FieldConfig[];
  defaultValues?: DefaultValues<TypeOf<T>>;
  onSubmit: (values: TypeOf<T>) => Promise<void> | void;
  bucket?: string;
  multi?: boolean;
}

export function GenericForm<T extends ZodObject<ZodRawShape>>({
  schema,
  fields,
  defaultValues,
  onSubmit,
}: GenericFormProps<T>) {
  const form = useForm<TypeOf<T>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  if (!fields || !Array.isArray(fields)) {
    console.warn("⚠️ GenericForm: 'fields' prop is missing or not an array");
    return <p className="text-red-500">Missing form field configuration.</p>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((field) => (
          <AutoFieldInput<TypeOf<T>>
            key={field.name}
            name={field.name as Path<TypeOf<T>>}
            control={form.control}
            schema={schema.shape[field.name]}
            fieldType={field.type}
            label={field.label}
            bucket={field.bucket} // ✅ field-specific bucket
            multi={field.multi} // ✅ field-specific multi
          />
        ))}

        <button
          type="submit"
          className="px-6 py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition"
        >
          Submit
        </button>
      </form>
    </Form>
  );
}
