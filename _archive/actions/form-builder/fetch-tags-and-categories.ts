// src/actions/form-builder/fetch-tags-and-categories.ts

"use server";

import { createClient } from "@/utils/supabase/server";

const supabase = await createClient();

export async function fetchTags() {
  const { data, error } = await supabase
    .from("form_builder_tags")
    .select("id, name");
  if (error) throw error;
  return data ?? [];
}

export async function fetchCategories() {
  const { data, error } = await supabase
    .from("form_builder_categories")
    .select("id, name");
  if (error) throw error;
  return data ?? [];
}
