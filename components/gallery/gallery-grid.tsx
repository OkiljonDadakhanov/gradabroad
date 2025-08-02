"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import type { GalleryImage } from "@/types/gallery";
import { Button } from "@/components/ui/button";

interface GalleryGridProps {
  images: GalleryImage[];
  onEdit: (image: GalleryImage) => void;
  onDelete: (image: GalleryImage) => void;
}

export function GalleryGrid({ images, onEdit, onDelete }: GalleryGridProps) {
  const [hoveredImageId, setHoveredImageId] = useState<string | null>(null);

  if (images.length === 0) {
    return (
      <div className="col-span-3 text-center py-12 text-gray-500">
        No images found. Click the Add button to upload images to the gallery.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {images.map((image) => (
        <div
          key={image.id}
          className="relative rounded-lg overflow-hidden bg-white shadow-md"
          onMouseEnter={() => setHoveredImageId(image.id)}
          onMouseLeave={() => setHoveredImageId(null)}
        >
          <div className="aspect-video relative">
            <img
              src={image.imageUrl || "/placeholder.svg"}
              alt={image.altText}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "/placeholder.svg?height=300&width=500";
              }}
            />

            {hoveredImageId === image.id && (
              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-purple-200 hover:bg-purple-300"
                  onClick={() => onEdit(image)}
                >
                  <Pencil className="h-5 w-5 text-purple-700" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-purple-200 hover:bg-purple-300"
                  onClick={() => onDelete(image)}
                >
                  <Trash2 className="h-5 w-5 text-purple-700" />
                </Button>
              </div>
            )}
          </div>

          <div className="p-4">
            {/* <h3 className="font-medium text-lg text-purple-900 truncate">
              {image.title || "Untitled"}
            </h3> */}
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
              {image.description || "No description provided."}
            </p>
            {/* <p className="text-gray-500 text-xs mt-2">
              {new Date(image.date).toLocaleDateString()}
            </p> */}
          </div>
        </div>
      ))}
    </div>
  );
}
