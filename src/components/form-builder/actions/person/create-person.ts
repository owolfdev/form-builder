"use server";

import { createClient } from "@/utils/supabase/server";
import {
  PersonSchema,
  type PersonType,
} from "@/components/form-builder/config/person-form-config";

export async function createPerson(values: unknown) {
  const supabase = await createClient();

  const parse = PersonSchema.safeParse(values);

  if (!parse.success) {
    console.error("❌ Zod validation failed:", parse.error.format());
    throw new Error("Invalid form data.");
  }

  const payload: PersonType = parse.data;

  const { data, error } = await supabase
    .from("form_builder_person") // make sure this matches your actual table
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error("❌ Supabase Insert Error:", error.message, error.details);
    throw new Error("Failed to create person.");
  }

  return data;
}
