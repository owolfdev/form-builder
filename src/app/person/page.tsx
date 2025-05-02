// src/app/person/page.tsx

import Link from "next/link";
import { getAllRecords } from "@/components/form-builder/actions/get-all-records";
import { personConfig, type PersonSchema } from "./config/form-config";
import type { z } from "zod";

type Person = z.infer<typeof PersonSchema> & {
  id: string;
  created_at?: string;
  updated_at?: string;
};

export default async function PersonListPage() {
  const persons = await getAllRecords<Person>(personConfig);

  return (
    <div className="max-w-3xl mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">All Persons</h1>
        <Link
          href="/person/create"
          className="text-sm px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
        >
          + Create Person
        </Link>
      </div>

      <div className="space-y-4">
        {persons.map((p) => {
          if ("message" in p) {
            return (
              <div key={Math.random()} className="text-red-500">
                {p.message}
              </div>
            );
          }

          return (
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
          );
        })}
      </div>
    </div>
  );
}
