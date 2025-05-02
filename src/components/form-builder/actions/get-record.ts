// src/components/form-builder/actions/get-record.ts
"use server";

import { createClient } from "@/utils/supabase/server";

interface Config {
  table: string;
  select?: string;
}

export async function getRecord<T>(
  config: Config,
  id: string
): Promise<T | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from(config.table)
    .select(config.select ?? "*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("❌ Supabase fetch error:", error.message);
    return null;
  }

  return data as T;
}
