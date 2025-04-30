// src/app/person/page.tsx

import { GenericForm } from "@/components/forms/generic-form";
import { PersonSchema, type PersonType } from "@/schemas/person-schema";

export default function CreatePersonPage() {
  const handleSubmit = async (values: PersonType) => {
    console.log("Form Submitted:", values);
    // Later, you can send to API or Supabase here
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">Create Person</h1>
      <GenericForm
        schema={PersonSchema}
        onSubmit={handleSubmit}
        defaultValues={{
          name: "",
          age: 0,
          email: "",
          bio: "",
        }}
      />
    </div>
  );
}
