"use client";

import { useRouter } from "next/navigation";
import { GenericForm } from "@/components/form-builder/core/generic-form";
import { createRecord } from "@/components/form-builder/actions/create-record";
import {
  personConfig,
  PersonSchema,
  personFields,
} from "../config/form-config";

import type { PersonRecord } from "../config/form-config";

export default function CreatePersonPage() {
  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Create Person</h1>
      <GenericForm
        schema={PersonSchema}
        fields={personFields}
        onSubmit={async (values) => {
          try {
            const newPerson = await createRecord<PersonRecord>(
              personConfig,
              values
            );
            router.push(`/person/${newPerson.id}`);
          } catch (error) {
            console.error("❌ Failed to create person:", error);
          }
        }}
      />
    </div>
  );
}
