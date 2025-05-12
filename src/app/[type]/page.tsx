// src/app/[type]/page.tsx
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import {
  entityTypes,
  type EntityType,
} from "@/components/form-builder/entities-config";

type Props = { params: Promise<{ type: string }> };

export default async function EntityPage({ params }: Props) {
  const { type } = await params;

  const supabase = await createClient();

  if (!entityTypes.includes(type as EntityType)) {
    notFound();
  }

  try {
    const { data, error } = await supabase
      .from(`form_builder_${type}`)
      .select("*");

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      notFound();
    }

    return (
      <pre className="p-4 whitespace-pre-wrap break-words">
        {JSON.stringify(data, null, 2)}
      </pre>
    );
  } catch (err) {
    return (
      <pre className="text-red-600 p-4">Error loading data: {String(err)}</pre>
    );
  }
}
