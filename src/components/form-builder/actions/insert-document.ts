"use server";

import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

const InsertDocumentSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  releaseDate: z.coerce.date(),
  rating: z.number().min(0).max(10),
  tags: z.array(z.string()),
  images: z.array(
    z.object({
      url: z.string().url(),
      caption: z.string().optional(),
    })
  ),
});

export async function insertDocument(data: unknown) {
  const parsed = InsertDocumentSchema.safeParse(data);

  if (!parsed.success) {
    return { error: "Validation failed", details: parsed.error.flatten() };
  }

  const supabase = await createClient();
  const { data: inserted, error } = await supabase
    .from("documents")
    .insert([
      {
        title: parsed.data.title,
        description: parsed.data.description,
        release_date: parsed.data.releaseDate,
        rating: parsed.data.rating,
        tags: parsed.data.tags,
        images: parsed.data.images,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("❌ Insert error:", error.message);
    return { error: error.message };
  }

  return { data: inserted };
}
