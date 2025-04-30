// src/components/form-builder/actions/person/list-persons.ts
"use server";

import { createClient } from "@/utils/supabase/server";

export async function listPersons() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("form_builder_person")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to list persons:", error.message);
    throw new Error("Could not fetch persons");
  }

  return data;
}
