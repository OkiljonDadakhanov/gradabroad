"use client";

import type React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Upload } from "lucide-react";
import type { GalleryImage, GalleryImageFormData } from "@/types/gallery";

interface GalleryImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    data: GalleryImage | GalleryImageFormData | GalleryImageFormData[]
  ) => void;
  initialData?: GalleryImage;
  title: string;
  isMultiple?: boolean;
}

export function GalleryImageModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  title,
  isMultiple = false,
}: GalleryImageModalProps) {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [formValues, setFormValues] = useState<GalleryImageFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    imageUrl: initialData?.imageUrl || "",
    altText: initialData?.altText || "",
    date: initialData?.date || new Date().toISOString().split("T")[0], // YYYY-MM-DD
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    if (files.length > 10) {
      setError("You can upload up to 10 images at once.");
      return;
    }

    const validFiles: File[] = [];
    setPreviews([]); // Reset previous

    files.forEach((file) => {
      if (file.size <= 5 * 1024 * 1024) {
        validFiles.push(file);

        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setPreviews((prev) => [...prev, event.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      }
    });

    setImages(validFiles);
    setError(null);
  };

  const handleRemoveFile = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (isMultiple) {
      if (!images.length) {
        setError("Please upload at least one image.");
        return;
      }

      const multipleImages: GalleryImageFormData[] = images.map(
        (file, index) => ({
          title: formValues.title || file.name,
          description: formValues.description,
          imageUrl: "", // Will be set after upload
          altText: formValues.altText || file.name.split(".")[0],
          date: formValues.date,
          imageFile: file,
        })
      );

      onSave(multipleImages);
    } else {
      if (!images[0] && !initialData) {
        setError("Please upload an image.");
        return;
      }

      onSave({
        ...formValues,
        id: initialData?.id,
        imageUrl: initialData?.imageUrl || images[0]?.name || "",
      });
    }

    handleCancel(); // Clean up
  };

  const handleCancel = () => {
    setImages([]);
    setPreviews([]);
    setError(null);
    setFormValues({
      title: "",
      description: "",
      imageUrl: "",
      altText: "",
      date: new Date().toISOString().split("T")[0],
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div>
            <Label htmlFor="title">Image title</Label>
            <Input
              id="title"
              name="title"
              value={formValues.title}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formValues.description}
              onChange={handleChange}
              className="mt-1 resize-none"
              rows={3}
            />
          </div>

          <div>
            <Label>Upload Image{isMultiple ? "s" : ""} *</Label>
            <div
              className="border-2 border-dashed rounded-md p-6 mt-1 cursor-pointer"
              onClick={() => document.getElementById("image-upload")?.click()}
            >
              {previews.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {previews.map((preview, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-32 object-contain rounded-md border"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile(idx);
                        }}
                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <div className="bg-purple-700 text-white p-3 rounded-full mb-2">
                    <Upload size={24} />
                  </div>
                  <p className="text-sm font-medium">
                    Click to upload{" "}
                    {isMultiple ? "up to 10 images" : "an image"}
                  </p>
                  <p className="text-xs text-gray-500">
                    (Max file size: 5 MB each)
                  </p>
                </div>
              )}
            </div>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple={isMultiple}
              className="hidden"
              onChange={handleFileChange}
            />
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </div>

          <div>
            <Label htmlFor="altText">Alt text *</Label>
            <Input
              id="altText"
              name="altText"
              value={formValues.altText}
              onChange={handleChange}
              className="mt-1"
              placeholder="Brief description for screen readers"
            />
          </div>

          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formValues.date}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-purple-900 hover:bg-purple-800"
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
