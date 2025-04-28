// src/components/forms/adapters/image-uploader-adapter.tsx

"use client";

import ImageUploader from "@/components/images/image-uploader";
import type { SpecialFieldProps } from "@/components/forms/types";
import type { UploadedPhoto } from "@/components/images/image-uploader"; // import the type!

export function ImageUploaderAdapter({
  value,
  onChange,
  name,
}: SpecialFieldProps<UploadedPhoto[]>) {
  return <ImageUploader value={value ?? []} onChange={onChange} name={name} />;
}
