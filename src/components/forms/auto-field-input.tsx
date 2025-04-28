// src/components/forms/auto-field-input.tsx

"use client";

import type { Control, FieldValues, Path } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { type ZodTypeAny, ZodString, ZodNumber, ZodBoolean } from "zod";
import { fieldRegistry } from "@/components/forms/field-registry";

interface AutoFieldInputProps<T extends FieldValues> {
  name: Path<T>; // more precise typing!
  control: Control<T>;
  schema: ZodTypeAny;
}

export default function AutoFieldInput<T extends FieldValues>({
  name,
  control,
  schema,
}: AutoFieldInputProps<T>) {
  const RegisteredComponent = fieldRegistry[name as string];

  if (RegisteredComponent) {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{formatLabel(name.toString())}</FormLabel>
            <FormControl>
              <RegisteredComponent {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{formatLabel(name.toString())}</FormLabel>
          <FormControl>{renderInputByType(schema, field)}</FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function renderInputByType(
  schema: ZodTypeAny,
  field: { name: string; value: unknown; onChange: (value: unknown) => void }
) {
  if (schema instanceof ZodString) {
    const isLongText =
      field.name.toLowerCase().includes("description") ||
      field.name.toLowerCase().includes("bio");
    return isLongText ? (
      <Textarea
        placeholder={`Enter ${field.name}`}
        name={field.name}
        value={typeof field.value === "string" ? field.value : ""}
        onChange={(e) => field.onChange(e.target.value)}
        className="h-40"
      />
    ) : (
      <Input
        placeholder={`Enter ${field.name}`}
        name={field.name}
        value={typeof field.value === "string" ? field.value : ""}
        onChange={(e) => field.onChange(e.target.value)}
      />
    );
  }
  if (schema instanceof ZodNumber) {
    return (
      <Input
        type="number"
        placeholder={`Enter ${field.name}`}
        name={field.name}
        value={typeof field.value === "number" ? field.value : ""}
        onChange={(e) => {
          const parsed = Number(e.target.value);
          field.onChange(Number.isNaN(parsed) ? undefined : parsed);
        }}
      />
    );
  }
  if (schema instanceof ZodBoolean) {
    return (
      <Switch checked={Boolean(field.value)} onCheckedChange={field.onChange} />
    );
  }
  return (
    <Input
      placeholder={`Enter ${field.name}`}
      name={field.name}
      value={typeof field.value === "string" ? field.value : ""}
      onChange={(e) => field.onChange(e.target.value)}
    />
  );
}

function formatLabel(name: string) {
  return name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
