// src/components/form-builder/actions/create-record.ts
"use server";

import { createClient } from "@/utils/supabase/server";

interface CreateRecordConfig {
  table: string;
}

export async function createRecord<T extends { id: string }>(
  config: CreateRecordConfig,
  values: unknown
): Promise<T> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from(config.table)
    .insert([values])
    .select("*") // include `id` in response
    .single();

  if (error) {
    console.error("❌ Supabase Insert Error:", error.message, error.details);
    throw new Error("Failed to create record.");
  }

  return data as T;
}
