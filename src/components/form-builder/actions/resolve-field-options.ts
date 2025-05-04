// src/components/form-builder/actions/resolve-field-options.ts
"use server";

type Field = {
  name: string;
  type: string;
  label: string;
  optionsLoader?: () => Promise<{ id: string; name: string }[]>;
  [key: string]: unknown;
};

export async function resolveFields(fields: Field[]) {
  return await Promise.all(
    fields.map(async (field) => {
      if (field.optionsLoader) {
        const options = await field.optionsLoader();
        return { ...field, options };
      }
      return field;
    })
  );
}
