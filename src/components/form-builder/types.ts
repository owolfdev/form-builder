import type { Path } from "react-hook-form";

export type FieldType =
  | "text"
  | "textarea"
  | "checkbox"
  | "select"
  | "multi-select" // ✅ new
  | "date"
  | "number";

export type FieldOption = {
  label: string;
  value: string;
};

export type FieldConfig<T = unknown> = {
  name: T extends object ? Path<T> : string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: FieldOption[];
  multiple?: boolean;
};
