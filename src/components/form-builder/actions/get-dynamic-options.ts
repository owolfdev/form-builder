"use server";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function getDynamicOptions(
  entityType: string,
  fields: { name: string; fetchFrom?: string }[]
) {
  const supabase = createServerComponentClient({ cookies });

  const optionTypes = fields.filter((f) => f.fetchFrom).map((f) => f.fetchFrom);

  if (optionTypes.length === 0) return {};

  const { data, error } = await supabase
    .from("form_builder_options")
    .select("entity_type, option_type, label, value");

  if (error) {
    console.error("❌ Failed to fetch form options:", error.message);
    return {};
  }

  const result: Record<string, { label: string; value: string }[]> = {};

  for (const field of fields) {
    const source = field.fetchFrom;
    if (!source) continue;

    result[field.name] = data
      .filter(
        (row) =>
          row.option_type === source &&
          (row.entity_type === entityType || row.entity_type === null)
      )
      .map((row) => ({
        label: row.label,
        value: row.value,
      }));
  }

  return result;
}
