import { createClient } from "@/utils/supabase/server";

interface Config {
  table: string;
  select?: string;
}

type ErrorMessage = { message: string };

export async function getAllRecords<T>(
  config: Config
): Promise<T[] | ErrorMessage[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from(config.table)
    .select(config.select ?? "*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ Supabase fetch error:", error.message);
    return [{ message: error.message }];
  }

  return (data ?? []) as T[];
}
