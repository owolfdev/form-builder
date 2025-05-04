// src/app/person/create/page.tsx
import { resolveFields } from "@/components/form-builder/actions/resolve-field-options";
import {
  personFields,
  // PersonSchema,
  // personConfig,
} from "../config/form-config";
import CreatePersonClientForm from "./client-form";

export default async function CreatePersonPage() {
  const resolvedFields = await resolveFields(personFields);

  return <CreatePersonClientForm fields={resolvedFields} />;
}
