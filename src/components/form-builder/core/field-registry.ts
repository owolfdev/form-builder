// src/components/form-builder/core/field-registry.ts

import type { FieldValues } from "react-hook-form";
import type { FC } from "react";
import type { SpecialFieldProps } from "./types";

export const fieldRegistry: Record<
  string,
  FC<SpecialFieldProps<unknown, FieldValues>>
> = {};
