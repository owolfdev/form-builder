import { notFound } from "next/navigation";
import { getRecord } from "@/components/form-builder/actions/get-record";
import { personConfig, type PersonRecord } from "../config/form-config";
import Link from "next/link";

interface PersonPageProps {
  params: {
    id: string;
  };
}

export default async function PersonPage({ params }: PersonPageProps) {
  const person = await getRecord<PersonRecord>(personConfig, params.id);

  if (!person) return notFound();

  return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="mb-8">
        <Link href="/person">{"<--"} Back to All Persons</Link>
      </div>
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
