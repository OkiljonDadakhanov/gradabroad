"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { GalleryImage } from "@/types/gallery";
import { generateId } from "@/lib/utils";
import { GalleryGrid } from "./gallery-grid";
import { GalleryDeleteDialog } from "./gallery-delete-dialog";
import { GalleryImageModal } from "./gallery-image-modal";

const DEFAULT_CATEGORIES = [
  "Research Centers",
  "Library",
  "Sports Facilities",
  "Dormitories",
  "Cafeterias",
  "Computer Labs",
  "Campus",
];

interface CategoryGallery {
  name: string;
  images: GalleryImage[];
}

export function GallerySection() {
  const { toast } = useToast();

  const [categories, setCategories] = useState<CategoryGallery[]>(
    DEFAULT_CATEGORIES.map((name) => ({ name, images: [] }))
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<GalleryImage | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleAddImage = (images: Omit<GalleryImage, "id">[]) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.name === selectedCategory
          ? {
              ...cat,
              images: [
                ...cat.images,
                ...images.map((img) => ({ ...img, id: generateId() })),
              ],
            }
          : cat
      )
    );
    setIsAddModalOpen(false);
    toast({
      title: "Images added",
      description: `Successfully added ${images.length} image(s) to ${selectedCategory}.`,
      variant: "success",
    });
  };

  const handleEditImage = (image: GalleryImage) => {
    setCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        images: cat.images.map((img) => (img.id === image.id ? image : img)),
      }))
    );
    setIsEditModalOpen(false);
    toast({ title: "Image updated", variant: "success" });
  };

  const handleDeleteImage = () => {
    if (!currentImage) return;
    setCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        images: cat.images.filter((img) => img.id !== currentImage.id),
      }))
    );
    setIsDeleteDialogOpen(false);
    toast({ title: "Image deleted", variant: "success" });
    setCurrentImage(null);
  };

  const handleOpenEditModal = (image: GalleryImage) => {
    setCurrentImage(image);
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteDialog = (image: GalleryImage) => {
    setCurrentImage(image);
    setIsDeleteDialogOpen(true);
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    setCategories((prev) => [
      ...prev,
      { name: newCategoryName.trim(), images: [] },
    ]);
    setNewCategoryName("");
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-purple-900">Gallery</h2>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="New category name"
            className="border px-3 py-1 rounded-md"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <Button onClick={handleAddCategory} variant="outline">
            Add Category
          </Button>
        </div>
      </div>

      {categories.map((category) => (
        <div key={category.name} className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-purple-800">
              {category.name}
            </h3>
            <Button
              onClick={() => {
                setSelectedCategory(category.name);
                setIsAddModalOpen(true);
              }}
              className="bg-purple-900 hover:bg-purple-800"
            >
              <Plus className="mr-2 h-4 w-4" /> Upload Images
            </Button>
          </div>
          <GalleryGrid
            images={category.images}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDeleteDialog}
          />
        </div>
      ))}

      <GalleryImageModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddImage}
        title={`Add Images to ${selectedCategory}`}
        isMultiple
      />

      {currentImage && (
        <GalleryImageModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleEditImage}
          initialData={currentImage}
          title="Edit Image"
        />
      )}

      {currentImage && (
        <GalleryDeleteDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteImage}
          imageTitle={currentImage.title}
        />
      )}
    </div>
  );
}
