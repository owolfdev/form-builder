// src/components/form-builder/actions/get-tag-options.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { tagStoreTable } from "@/app/person/config/form-config"; // ✅ import from config

export async function getTagOptions() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(tagStoreTable)
    .select("id, name")
    .order("name", { ascending: true });

  if (error) throw new Error(`Failed to fetch tags: ${error.message}`);

  return data ?? [];
}
