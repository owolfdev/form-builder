"use client";

import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@/utils/supabase/client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import Image from "next/image";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

export interface UploadedPhoto {
  url: string;
  caption?: string;
}

interface SbImageUploaderProps {
  value: UploadedPhoto[] | string;
  onChange: (value: UploadedPhoto[] | string) => void;
  name: string;
  bucket?: string;
  multi?: boolean;
}

const SortablePhoto = ({
  id,
  index,
  photo,
  onRemove,
  onMoveUp,
  onMoveDown,
  onCaptionChange,
  isFirst,
  isLast,
}: {
  id: string;
  index: number;
  photo: UploadedPhoto;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onCaptionChange: (caption: string) => void;
  isFirst: boolean;
  isLast: boolean;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="relative border p-2 rounded-md shadow-sm flex flex-col"
    >
      <div {...listeners} className="cursor-grab absolute top-1 left-1">
        <GripVertical
          size={26}
          className="py-1 px-0 rounded-md shadow-sm bg-primary text-primary-foreground"
        />
      </div>

      <Image
        src={photo.url}
        alt={`Uploaded Preview ${index + 1}`}
        className="w-full h-32 object-cover rounded-md"
        width={300}
        height={128}
      />

      <Button
        type="button"
        variant="destructive"
        size="sm"
        onClick={onRemove}
        className="absolute top-1 right-1"
      >
        X
      </Button>

      <div className="flex justify-between items-center mt-2 space-x-2">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={isFirst}
          onClick={onMoveUp}
        >
          ↑
        </Button>
        <Textarea
          placeholder="Enter caption (optional)"
          value={photo.caption}
          onChange={(e) => onCaptionChange(e.target.value)}
          className="mt-2 text-sm"
        />
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={isLast}
          onClick={onMoveDown}
        >
          ↓
        </Button>
      </div>
    </div>
  );
};

export default function SbImageUploader({
  value,
  onChange,
  name,
  bucket = "uploads",
  multi = true,
}: SbImageUploaderProps) {
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  const supabase = createClient();
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    if (multi) {
      setPhotos(Array.isArray(value) ? value : []);
    } else {
      setPhotos(typeof value === "string" && value ? [{ url: value }] : []);
    }
  }, [value, multi]);

  const updatePhotos = (newPhotos: UploadedPhoto[]) => {
    setPhotos(newPhotos);
    if (multi) {
      onChange(newPhotos);
    } else {
      onChange(newPhotos[0]?.url || "");
    }
  };

  const uploadFiles = async (files: FileList | File[]) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024;

    const validFiles = Array.from(files).filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        setError(`Unsupported file type: ${file.name}`);
        return false;
      }
      if (file.size > maxSize) {
        setError(`File too large: ${file.name} (Max: 5MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setUploading(true);
    try {
      const uploadedPhotos: UploadedPhoto[] = [];

      for (const file of validFiles) {
        const fileName = `${uuidv4()}_${file.name}`;
        const filePath = `${fileName}`;

        // console.log("Uploading to bucket:", bucket);

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file);

        if (uploadError) throw new Error(uploadError.message);

        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

        if (!data.publicUrl) throw new Error("Failed to retrieve public URL");

        uploadedPhotos.push({ url: data.publicUrl, caption: "" });
      }

      const newPhotos = multi
        ? [...photos, ...uploadedPhotos]
        : [uploadedPhotos[0]];

      updatePhotos(newPhotos);
    } catch (uploadError: unknown) {
      setError(
        typeof uploadError === "object" &&
          uploadError !== null &&
          "message" in uploadError
          ? String(uploadError.message)
          : "An unknown error occurred"
      );
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = event.target.files;
    if (!files || files.length === 0) {
      setError("Please select at least one file.");
      return;
    }
    uploadFiles(files);
  };

  const handleAddUrl = () => {
    if (!imageUrl) return;
    try {
      new URL(imageUrl);
    } catch {
      setError("Invalid URL format.");
      return;
    }

    const newPhotos = multi
      ? [...photos, { url: imageUrl, caption: "" }]
      : [{ url: imageUrl, caption: "" }];

    updatePhotos(newPhotos);
    setImageUrl("");
  };

  const movePhoto = (from: number, to: number) => {
    if (to < 0 || to >= photos.length) return;
    const updated = [...photos];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    updatePhotos(updated);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = photos.findIndex((_, i) => `photo-${i}` === active.id);
      const newIndex = photos.findIndex((_, i) => `photo-${i}` === over?.id);
      updatePhotos(arrayMove(photos, oldIndex, newIndex));
    }
  };

  const removePhoto = (index: number) => {
    const updated = photos.filter((_, i) => i !== index);
    updatePhotos(updated);
  };

  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor={`${name}-file-upload`} className="cursor-pointer">
        Upload Image{multi ? "s" : ""}
      </label>

      <div className="flex items-center gap-4">
        <label
          htmlFor={`${name}-file-upload`}
          className={buttonVariants({
            variant: "outline",
            className: `cursor-pointer border p-2 rounded-md hover:bg-muted ${
              uploading ? "opacity-50 cursor-not-allowed" : ""
            }`,
          })}
        >
          {uploading
            ? "Uploading..."
            : multi
            ? "Upload Images"
            : "Upload Image"}
        </label>
        <input
          id={`${name}-file-upload`}
          type="file"
          accept="image/*"
          multiple={multi}
          onChange={handleImageUpload}
          disabled={uploading}
          className="hidden"
        />
      </div>

      <div className="flex items-center space-x-2 pb-2">
        <Input
          type="url"
          placeholder="Enter Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <Button onClick={handleAddUrl} disabled={!imageUrl.trim()}>
          Add
        </Button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {photos.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={photos.map((_, i) => `photo-${i}`)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid grid-cols-2 gap-4">
              {photos.map((photo, index) => (
                <SortablePhoto
                  key={`photo-${
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    index
                  }`}
                  id={`photo-${index}`}
                  index={index}
                  photo={photo}
                  onRemove={() => removePhoto(index)}
                  onMoveUp={() => movePhoto(index, index - 1)}
                  onMoveDown={() => movePhoto(index, index + 1)}
                  onCaptionChange={(caption) => {
                    const updated = [...photos];
                    updated[index].caption = caption;
                    updatePhotos(updated);
                  }}
                  isFirst={index === 0}
                  isLast={index === photos.length - 1}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
