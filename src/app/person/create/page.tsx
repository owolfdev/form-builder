"use client";

import { GenericForm } from "@/components/forms/generic-form";
import { PersonSchema } from "@/schemas/person-schema";
import { createPerson } from "@/actions/person/create-person";

export default function CreatePersonPage() {
  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Create Person</h1>
      <GenericForm
        schema={PersonSchema}
        onSubmit={async (values) => {
          try {
            const newPerson = await createPerson(values);
            console.log("Success:", newPerson);
            // TODO: Show success toast or redirect
          } catch (error) {
            console.error("Failed to create person:", error);
          }
        }}
      />
    </div>
  );
}
