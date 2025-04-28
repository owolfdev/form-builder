// src/components/forms/adapters/multi-select-adapter.tsx

"use client";

import { MultiSelect } from "@/components/multi-select/multi-select";
import type { SpecialFieldProps } from "@/components/forms/types";

export function MultiSelectAdapter({
  value,
  onChange,
  name,
}: SpecialFieldProps<string[]>) {
  const options = [
    { value: "student", label: "Student" },
    { value: "professional", label: "Professional" },
    { value: "doctor", label: "Doctor" },
    { value: "business_person", label: "Business Person" },
  ];

  return (
    <MultiSelect
      options={options}
      selectedValues={value ?? []}
      setSelectedValues={onChange}
      placeholder={`Select ${String(name)}`}
    />
  );
}
