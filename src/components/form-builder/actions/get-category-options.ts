// src/components/form-builder/actions/get-category-options.ts
"use server";

import { createClient } from "@/utils/supabase/server";

export async function getCategoryOptions() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("form_builder_person_category_store")
    .select("id, name")
    .order("name", { ascending: true });

  if (error) throw new Error(`Failed to fetch categories: ${error.message}`);

  return data ?? [];
}
