// src/actions/person/get-all-persons.ts
import { createClient } from "@/utils/supabase/server";
import type { PersonType } from "@/components/form-builder/config/person-form-config";

export async function getAllPersons(): Promise<PersonType[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("form_builder_person")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase fetch error:", error.message);
    return [];
  }

  return data ?? [];
}
