// src/actions/person/create-person.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { PersonSchema } from "@/schemas/person-schema";

export async function createPerson(values: unknown) {
  const supabase = await createClient();

  const parsed = PersonSchema.safeParse(values);
  if (!parsed.success) {
    console.error(parsed.error.flatten());
    throw new Error("Invalid form values.");
  }

  const { data, error } = await supabase.from("form_builder_person").insert([
    {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      bio: parsed.data.bio,
    },
  ]);

  if (error) {
    console.error("Supabase Insert Error:", error.message, error.details);
    throw new Error("Failed to create person.");
  }

  return data;
}
