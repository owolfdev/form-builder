"use client";

import { useEffect } from "react";
import { useForm, type DefaultValues, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodObject, ZodRawShape, TypeOf } from "zod";
import { Form } from "@/components/ui/form";
import AutoFieldInput from "@/components/form-builder/core/auto-field-input";
import type { PersonType } from "@/app/person/config/form-config";

interface FieldConfig {
  name: string;
  label?: string;
  type?: string;
  bucket?: string;
  multi?: boolean;
  options?: { id: string; name: string }[];
}

interface DynamicFormProps<T extends ZodObject<ZodRawShape>> {
  schema: T;
  fields: FieldConfig[];
  defaultValues?: DefaultValues<TypeOf<T>>;
  onSubmit: (values: TypeOf<T>) => Promise<void> | void;
  bucket?: string;
  multi?: boolean;
}

export const getDefaultPersonValues = (): DefaultValues<PersonType> => ({
  name: "",
  email: "",
  phone: "",
  bio: "",
  active: false,
  tags: [],
  categories: [],
  images: [],
});

export function DynamicForm<T extends ZodObject<ZodRawShape>>({
  schema,
  fields,
  defaultValues,
  onSubmit,
}: DynamicFormProps<T>) {
  const form = useForm<TypeOf<T>>({
    resolver: zodResolver(schema),
    defaultValues:
      (defaultValues as DefaultValues<TypeOf<T>>) ??
      (getDefaultPersonValues() as DefaultValues<TypeOf<T>>),
  });

  if (!fields || !Array.isArray(fields)) {
    console.warn("⚠️ DynamicForm: 'fields' prop is missing or not an array");
    return <p className="text-red-500">Missing form field configuration.</p>;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const subscription = form.watch((values) => {
      console.log("📦 Live form values:", values);
    });
    return () => subscription.unsubscribe();
  }, [form]);

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
            bucket={field.bucket}
            multi={field.multi}
            options={field.options}
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
