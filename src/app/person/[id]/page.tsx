// src/app/person/[id]/page.tsx

import { notFound } from "next/navigation";
import { getPerson } from "@/components/form-builder/actions/person/get-person";

interface PersonPageProps {
  params: {
    id: string;
  };
}

export default async function PersonPage({ params }: PersonPageProps) {
  const person = await getPerson(params.id);

  if (!person) return notFound();

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">{person.name}</h1>
      <ul className="space-y-4 text-lg">
        <li>
          <strong>Email:</strong> {person.email || "N/A"}
        </li>
        <li>
          <strong>Phone:</strong> {person.phone || "N/A"}
        </li>
        <li>
          <strong>Bio:</strong> {person.bio || "N/A"}
        </li>
        <li>
          <strong>Active:</strong> {person.active ? "Yes" : "No"}
        </li>
      </ul>
    </div>
  );
}
