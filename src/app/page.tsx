import React from "react";
import Link from "next/link";
import { entityTypes } from "@/components/form-builder/entities-config";

function Page() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Form Builder</h1>
      <ul className="space-y-4">
        {entityTypes.map((type) => (
          <li key={type} className="flex flex-col">
            <Link
              href={`/admin/entities/${type}/new`}
              className="text-blue-600 hover:underline"
            >
              ➕ Create new {type}
            </Link>
            <Link href={`/${type}`} className="text-green-600 hover:underline">
              📄 View {type} entries
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Page;
