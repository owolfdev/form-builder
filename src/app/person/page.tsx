// src/app/person/page.tsx

import Link from "next/link";
import { getAllPersons } from "@/actions/person/get-all-persons";

export default async function PersonListPage() {
  const persons = await getAllPersons();

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">All Persons</h1>

      <div className="space-y-4">
        {persons.map((p) => (
          <div
            key={p.id}
            className="border rounded-lg p-4 shadow-sm hover:bg-gray-50 transition"
          >
            <h2 className="text-xl font-semibold">{p.name}</h2>
            <p className="text-gray-600 text-sm">{p.email}</p>
            <Link
              href={`/person/${p.id}`}
              className="text-blue-500 text-sm underline mt-2 inline-block"
            >
              View Profile
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
