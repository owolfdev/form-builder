// src/components/form-builder/core/types.ts

import type { FieldValues, FieldPath, UseFormReturn } from "react-hook-form";

// Component-specific props for custom field inputs
export interface SpecialFieldProps<
  TValue = unknown,
  TFormValues extends FieldValues = FieldValues
> {
  value: TValue;
  onChange: (value: TValue) => void;
  name: FieldPath<TFormValues>;
  form?: UseFormReturn<TFormValues>;
}

// Dropdown/multi-select options
export interface FormFieldOption {
  id: string;
  name: string;
}

// Used in form configs like `personFields`
export interface FormFieldConfig {
  name: string;
  label: string;
  type: string;
  bucket?: string;
  multi?: boolean;
  options?: FormFieldOption[];
  optionsLoader?: () => Promise<FormFieldOption[]>;
}
