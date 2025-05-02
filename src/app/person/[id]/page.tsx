import { notFound } from "next/navigation";
import { getRecord } from "@/components/form-builder/actions/get-record";
import { personConfig, type PersonRecord } from "../config/form-config";
import Link from "next/link";
import ImageViewer from "@/components/images/image-viewer";

interface PersonPageProps {
  params: Promise<{ id: string }>;
}

export default async function PersonPage({ params }: PersonPageProps) {
  const { id } = await params;

  const person = await getRecord<PersonRecord>(personConfig, id);

  if (!person) return notFound();

  const photoUrls = Array.isArray(person.images)
    ? person.images.map((img) => img.url)
    : [];

  return (
    <div className="max-w-2xl mx-auto py-10 space-y-6">
      <div className="mb-4">
        <Link href="/person">{"<--"} Back to All Persons</Link>
      </div>

      <ImageViewer photoUrls={photoUrls} height={300} url={`/person/${id}`} />

      <h1 className="text-4xl font-bold">{person.name}</h1>
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
