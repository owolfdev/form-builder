"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

type ImageViewerProps = {
  photoUrls: string[];
  height?: number;
  url: string;
};

function ImageViewer({ photoUrls, height = 300, url }: ImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  if (!photoUrls || photoUrls.length === 0) {
    return (
      <Link href={url}>
        <div
          className="flex items-center justify-center bg-cover bg-center text-white"
          style={{
            height,
            backgroundImage: "url('/images/locations/placeholder.jpg')",
          }}
        >
          No Image Available
        </div>
      </Link>
    );
  }

  const nextImage = () =>
    setCurrentIndex((prevIndex) => (prevIndex + 1) % photoUrls.length);

  const prevImage = () =>
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? photoUrls.length - 1 : prevIndex - 1
    );

  return (
    <div className="relative w-full overflow-hidden" style={{ height }}>
      <Link href={url}>
        <div className="relative w-full h-full">
          {(isLoading || error) && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-cover bg-center text-white"
              style={{
                backgroundImage: "url('/images/locations/placeholder.jpg')",
              }}
            >
              {error ? "Failed to load image" : "Loading..."}
            </div>
          )}
          {!error && (
            <Image
              src={photoUrls[currentIndex]}
              alt={`item-${currentIndex + 1}`}
              className={`object-cover rounded-md transition-opacity ${
                isLoading ? "opacity-0" : "opacity-100"
              }`}
              fill
              priority={currentIndex === 0}
              onLoadingComplete={() => setIsLoading(false)}
              onError={() => {
                setError(true);
                setIsLoading(false);
              }}
            />
          )}
        </div>
      </Link>

      {/* Image Count */}
      <div className="absolute bottom-2 right-2 bg-black/40 text-muted-foreground text-xs px-2 py-1 rounded">
        {currentIndex + 1} of {photoUrls.length}
      </div>

      {photoUrls.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={prevImage}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-200/50 p-1 rounded-full"
          >
            ◀
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={nextImage}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-200/50 rounded-full p-1"
          >
            ▶
          </Button>
        </>
      )}
    </div>
  );
}

export default ImageViewer;
