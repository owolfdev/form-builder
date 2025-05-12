// src/components/form-builder/actions/insert-entity.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import type { entityConfigs, EntityType } from "../entities-config";
import type { z } from "zod";

// 1. Generate types for each entity
type EntityInputMap = {
  [K in EntityType]: z.infer<(typeof entityConfigs)[K]["schema"]>;
};

// 2. Transform camelCase keys to snake_case
function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

function transformKeys<T extends Record<string, unknown>>(
  obj: T
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key in obj) {
    const snake = camelToSnake(key);
    result[snake] = obj[key];
  }
  return result;
}

// 3. Typed insertEntity
export async function insertEntity<K extends EntityType>(
  type: K,
  values: EntityInputMap[K]
): Promise<{ data: EntityInputMap[K] | null; error: string | null }> {
  const supabase = await createClient();
  const tableName = `form_builder_${type}`;
  const transformed = transformKeys(values);

  // 🔧 Add type explicitly
  const withType = {
    ...transformed,
    type, // use the same string as the entity type (e.g., "document")
  };

  const { data, error } = await supabase
    .from(tableName)
    .insert([withType])
    .select()
    .single();

  if (error) {
    console.error("❌ Supabase insert error:", error);
    return { data: null, error: error.message };
  }

  return { data: data as EntityInputMap[K], error: null };
}
