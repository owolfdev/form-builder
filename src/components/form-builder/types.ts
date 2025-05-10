import type { Path } from "react-hook-form";

export type FieldType =
  | "text"
  | "textarea"
  | "checkbox"
  | "select"
  | "date"
  | "number";

export type FieldConfig<T> = {
  name: Path<T>; // ✅ schema-safe
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: { label: string; value: string }[]; // for select
};
