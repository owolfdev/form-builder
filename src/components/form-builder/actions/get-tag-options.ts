// src/components/form-builder/actions/get-tag-options.ts
"use server";

import { createClient } from "@/utils/supabase/server";

export async function getTagOptions() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("form_builder_person_tag_store")
    .select("id, name")
    .order("name", { ascending: true });

  if (error) throw new Error(`Failed to fetch tags: ${error.message}`);

  return data ?? [];
}
