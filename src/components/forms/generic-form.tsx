// src/components/forms/generic-form.tsx

"use client";

import { useForm, type DefaultValues, type Path } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodObject, ZodRawShape, TypeOf } from "zod";
import { Form } from "@/components/ui/form";
import AutoFieldInput from "@/components/forms/auto-field-input";

interface GenericFormProps<T extends ZodObject<ZodRawShape>> {
  schema: T;
  defaultValues?: DefaultValues<TypeOf<T>>;
  onSubmit: (values: TypeOf<T>) => Promise<void> | void;
}

export function GenericForm<T extends ZodObject<ZodRawShape>>({
  schema,
  defaultValues,
  onSubmit,
}: GenericFormProps<T>) {
  const form = useForm<TypeOf<T>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {Object.keys(schema.shape).map((fieldName) => (
          <AutoFieldInput<TypeOf<T>>
            key={fieldName}
            name={fieldName as Path<TypeOf<T>>}
            control={form.control}
            schema={schema.shape[fieldName]}
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
