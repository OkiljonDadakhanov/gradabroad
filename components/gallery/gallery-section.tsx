"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { GalleryImage } from "@/types/gallery";
import { GalleryGrid } from "./gallery-grid";
import { GalleryDeleteDialog } from "./gallery-delete-dialog";
import { GalleryImageModal } from "./gallery-image-modal";

interface CategoryGallery {
  id: number;
  name: string;
  images: GalleryImage[];
}

export function GallerySection() {
  const { toast } = useToast();

  const [categories, setCategories] = useState<CategoryGallery[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryGallery | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<GalleryImage | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // 🔁 Fetch from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          "https://api.gradabroad.net/api/media/gallery/categories/"
        );
        const data = await res.json();
        const mapped = data.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          images: cat.images.map((img: any) => ({
            id: img.id.toString(),
            imageUrl: img.image_url,
            altText: cat.name,
            title: "",
            description: "",
            date: img.uploaded_at,
          })),
        }));
        setCategories(mapped);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch gallery categories",
          variant: "destructive",
        });
      }
    };

    fetchCategories();
  }, []);

  // Add image locally (not API integrated yet)
  const handleAddImage = async (images: GalleryImageFormData[]) => {
    if (!selectedCategory) return;

    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast({
        title: "Authentication Error",
        description: "Access token is missing.",
        variant: "destructive",
      });
      return;
    }

    const uploadedImages: GalleryImage[] = [];

    for (const img of images) {
      if (!img.imageFile) continue;

      const formData = new FormData();
      formData.append("category_id", selectedCategory.id.toString());
      formData.append("image", img.imageFile);

      try {
        const res = await fetch(
          "https://api.gradabroad.net/api/media/gallery/images/",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (!res.ok) throw new Error("Upload failed");

        const result = await res.json();

        uploadedImages.push({
          id: result.id.toString(),
          imageUrl: result.image_url,
          altText: img.altText,
          title: img.title,
          description: img.description,
          date: result.uploaded_at,
        });
      } catch (err) {
        toast({
          title: "Upload failed",
          description: (err as Error).message,
          variant: "destructive",
        });
      }
    }

    if (uploadedImages.length > 0) {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === selectedCategory.id
            ? { ...cat, images: [...cat.images, ...uploadedImages] }
            : cat
        )
      );
      toast({
        title: "Upload successful",
        description: `Uploaded ${uploadedImages.length} image(s) to ${selectedCategory.name}`,
        variant: "success",
      });
    }

    setIsAddModalOpen(false);
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
    if (!currentImage || !selectedCategory) return;
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === selectedCategory.id
          ? {
              ...cat,
              images: cat.images.filter((img) => img.id !== currentImage.id),
            }
          : cat
      )
    );
    setIsDeleteDialogOpen(false);
    setCurrentImage(null);
    toast({ title: "Image deleted", variant: "success" });
  };

  const handleOpenEditModal = (image: GalleryImage) => {
    setCurrentImage(image);
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteDialog = (image: GalleryImage) => {
    setCurrentImage(image);
    setIsDeleteDialogOpen(true);
  };

  // ✅ POST new category to backend
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      const res = await fetch(
        "https://api.gradabroad.net/api/media/gallery/categories/",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newCategoryName.trim() }),
        }
      );
      const data = await res.json();
      setCategories((prev) => [
        ...prev,
        { id: data.id, name: data.name, images: [] },
      ]);
      setNewCategoryName("");
      toast({ title: "Category added", variant: "success" });
    } catch {
      toast({
        title: "Error",
        description: "Failed to add new category",
        variant: "destructive",
      });
    }
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
        <div key={category.id} className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-purple-800">
              {category.name}
            </h3>
            <Button
              onClick={() => {
                setSelectedCategory(category);
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
        title={`Add Images to ${selectedCategory?.name}`}
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
