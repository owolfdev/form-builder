// src/components/form-builder/core/auto-field-input.tsx

"use client";

import type { Control, FieldValues, Path } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  ZodString,
  ZodNumber,
  ZodBoolean,
  ZodOptional,
  type ZodTypeAny,
} from "zod";
import { fieldRegistry } from "@/components/form-builder/core/field-registry";

// components
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

// custom components
import { SbImageUploader } from "@/components/form-builder/custom-fields";
import type { UploadedPhoto } from "@/components/form-builder/custom-fields/sb-image-uploader";

interface AutoFieldInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  schema: ZodTypeAny;
  label?: string;
  fieldType?: string;
  bucket?: string;
  multi?: boolean;
}

export default function AutoFieldInput<T extends FieldValues>({
  name,
  control,
  schema,
  label,
  fieldType,
  bucket,
  multi,
}: AutoFieldInputProps<T>) {
  const RegisteredComponent = fieldRegistry[name as string];

  if (RegisteredComponent) {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label ?? formatLabel(name.toString())}</FormLabel>
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
          <FormLabel>{label ?? formatLabel(name.toString())}</FormLabel>
          <FormControl>
            {renderInputByType(
              unwrapSchema(schema),
              field,
              fieldType,
              bucket,
              multi
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function unwrapSchema(schema: ZodTypeAny): ZodTypeAny {
  return schema instanceof ZodOptional ? schema._def.innerType : schema;
}

function renderInputByType(
  schema: ZodTypeAny,
  field: { name: string; value: unknown; onChange: (value: unknown) => void },
  fieldType?: string,
  bucket?: string,
  multi?: boolean
) {
  if (schema instanceof ZodString) {
    const isLongText =
      field.name.toLowerCase().includes("description") ||
      field.name.toLowerCase().includes("bio") ||
      fieldType === "textarea";
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
    return fieldType === "checkbox" ? (
      // checkbox input
      <div className="flex items-center justify-start">
        <Checkbox
          id={field.name}
          checked={Boolean(field.value)}
          onCheckedChange={field.onChange}
          className="w-4 h-4"
        />
      </div>
    ) : (
      <div>
        <Switch
          id={field.name}
          checked={Boolean(field.value)}
          onCheckedChange={field.onChange}
        />
      </div>
    );
  }

  if (fieldType?.startsWith("image")) {
    const isMulti = multi ?? fieldType === "image-multi";

    return (
      <SbImageUploader
        name={field.name}
        value={
          isMulti
            ? ((field.value ?? []) as UploadedPhoto[])
            : ((field.value ?? "") as string)
        }
        onChange={field.onChange as (value: UploadedPhoto[] | string) => void}
        bucket={bucket ?? "default-bucket"}
        multi={isMulti}
      />
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
