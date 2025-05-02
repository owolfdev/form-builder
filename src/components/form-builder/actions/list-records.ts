// src/components/form-builder/actions/list-records.ts
"use server";

import { createClient } from "@/utils/supabase/server";

export async function listRecords<T = unknown>(table: string): Promise<T[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from(table)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(`❌ Failed to list from ${table}:`, error.message);
    throw new Error("Could not list records.");
  }

  return data ?? [];
}
