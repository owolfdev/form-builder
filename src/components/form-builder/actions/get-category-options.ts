// src/components/form-builder/actions/get-category-options.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { categoryStoreTable } from "@/app/person/config/form-config"; // ✅

export async function getCategoryOptions() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(categoryStoreTable)
    .select("id, name")
    .order("name", { ascending: true });

  if (error) throw new Error(`Failed to fetch categories: ${error.message}`);

  return data ?? [];
}
