// src/components/form-builder/actions/person/create-person.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { PersonSchema } from "@/components/form-builder/config/person-form-config";

export async function createPerson(formValues: unknown) {
  const supabase = await createClient();

  const parse = PersonSchema.safeParse(formValues);
  if (!parse.success) {
    throw new Error("Validation failed");
  }

  const { data, error } = await supabase
    .from("form_builder_person")
    .insert([parse.data]);

  if (error) {
    console.error("Supabase Insert Error:", error.message, error.details);
    throw new Error("Failed to create person.");
  }

  return data;
}
