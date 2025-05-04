// src/components/form-builder/actions/create-record.ts
"use server";

import { createClient } from "@/utils/supabase/server";

interface CreateRecordConfig {
  table: string;
}

export async function createRecord<T extends { id: string }>(
  config: CreateRecordConfig,
  values: {
    tags?: string[];
    categories?: string[];
    [key: string]: unknown;
  }
): Promise<T> {
  const supabase = await createClient();

  const { tags, categories, ...baseValues } = values;

  // Step 1: Insert person
  const { data: person, error } = await supabase
    .from(config.table)
    .insert([baseValues])
    .select("*")
    .single();

  if (error) {
    console.error("❌ Supabase Insert Error:", error.message, error.details);
    throw new Error("Failed to create record.");
  }

  const personId = person.id;

  // Step 2: Insert tag relationships
  if (Array.isArray(tags) && tags.length > 0) {
    await supabase.from("form_builder_person_tags").insert(
      tags.map((tagId: string) => ({
        person_id: personId,
        tag_id: Number(tagId),
      }))
    );
  }

  // Step 3: Insert category relationships
  if (Array.isArray(categories) && categories.length > 0) {
    await supabase.from("form_builder_person_categories").insert(
      categories.map((categoryId: string) => ({
        person_id: personId,
        category_id: Number(categoryId),
      }))
    );
  }

  return person as T;
}
