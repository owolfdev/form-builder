// src/components/form-builder/actions/create-record.ts
"use server";

import { createClient } from "@/utils/supabase/server";

interface RelationConfig {
  table: string;
  sourceKey: string; // e.g. 'entity_id'
  targetKey: string; // e.g. 'tag_id' or 'category_id'
}

interface CreateRecordConfig {
  table: string;
  tagRelation?: RelationConfig;
  categoryRelation?: RelationConfig;
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

  const { data: record, error } = await supabase
    .from(config.table)
    .insert([baseValues])
    .select("*")
    .single();

  if (error) {
    console.error("❌ Supabase Insert Error:", error.message, error.details);
    throw new Error("Failed to create record.");
  }

  const recordId = record.id;

  if (Array.isArray(tags) && tags.length > 0 && config.tagRelation) {
    const { table, sourceKey, targetKey } = config.tagRelation;
    const { error: tagInsertError } = await supabase.from(table).insert(
      tags.map((tagId: string) => ({
        [sourceKey]: recordId,
        [targetKey]: Number(tagId),
      }))
    );

    if (tagInsertError) {
      console.error("❌ Failed to insert tags:", tagInsertError.message);
    }
  }

  if (
    Array.isArray(categories) &&
    categories.length > 0 &&
    config.categoryRelation
  ) {
    const { table, sourceKey, targetKey } = config.categoryRelation;
    await supabase.from(table).insert(
      categories.map((categoryId: string) => ({
        [sourceKey]: recordId,
        [targetKey]: Number(categoryId),
      }))
    );
  }

  return record as T;
}
