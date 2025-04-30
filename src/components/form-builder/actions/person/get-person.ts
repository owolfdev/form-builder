// src/components/form-builder/actions/person/get-person.ts
"use server";

import { createClient } from "@/utils/supabase/server";

export async function getPerson(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("form_builder_person")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Failed to fetch person:", error.message);
    throw new Error("Could not fetch person");
  }

  return data;
}
