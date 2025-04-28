// src/components/forms/types.ts
import type { FieldValues, FieldPath, UseFormReturn } from "react-hook-form";

export interface SpecialFieldProps<
  TValue = unknown,
  TFormValues extends FieldValues = FieldValues,
> {
  value: TValue;
  onChange: (value: TValue) => void;
  name: FieldPath<TFormValues>;
  form?: UseFormReturn<TFormValues>;
}
