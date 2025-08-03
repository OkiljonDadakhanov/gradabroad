"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { GalleryImage } from "@/types/gallery";
import { GalleryGrid } from "./gallery-grid";
import { GalleryDeleteDialog } from "./gallery-delete-dialog";
import { GalleryImageModal } from "./gallery-image-modal";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

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

  const fetchCategories = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const res = await fetchWithAuth(
        "https://api.gradabroad.net/api/media/gallery/categories/"
      );

      const data = await res.json();

      const mapped: CategoryGallery[] = data.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        images: (cat.images || []).map((img: any) => ({
          id: img.id.toString(),
          imageUrl: img.image_url,
          altText: img.alt_text || cat.name,
          // title: img.title || "Untitled",
          description: img.description || "",
          // date: img.uploaded_at,
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

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddImage = async (images: GalleryImageFormData[]) => {
    if (!selectedCategory) return;
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    for (const img of images) {
      const formData = new FormData();
      formData.append("category_id", selectedCategory.id.toString());
      formData.append("image", img.imageFile!);
      formData.append("description", img.description);
      formData.append("alt_text", img.altText);
      formData.append("title", img.title);

      try {
        const res = await fetchWithAuth(
          "https://api.gradabroad.net/api/media/gallery/images/",
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          }
        );

        if (!res.ok) throw new Error("Upload failed");
      } catch (err) {
        toast({
          title: "Upload failed",
          description: (err as Error).message,
          variant: "destructive",
        });
      }
    }

    toast({
      title: "Upload successful",
      description: `Uploaded ${images.length} image(s) to ${selectedCategory.name}`,
      variant: "success",
    });

    setIsAddModalOpen(false);
    await fetchCategories();
  };

  const handleEditImage = async (
    image: GalleryImage | GalleryImageFormData
  ) => {
    const token = localStorage.getItem("accessToken");
    if (!token || !image.id || !selectedCategory) return;

    const formData = new FormData();
    formData.append("category_id", selectedCategory.id.toString());

    if ("imageFile" in image && image.imageFile) {
      formData.append("image", image.imageFile);
    }

    // formData.append("title", image.title || "");
    formData.append("description", image.description || "");
    formData.append("alt_text", image.altText || "");

    try {
      const res = await fetchWithAuth(
        `https://api.gradabroad.net/api/media/gallery/images/${image.id}/`,
        {
          method: "PATCH", // PATCH is safer for partial updates

          body: formData,
        }
      );

      if (!res.ok) throw new Error("Failed to update image");

      toast({ title: "Image updated", variant: "success" });
      await fetchCategories();
    } catch (err) {
      toast({
        title: "Error",
        description: (err as Error).message,
        variant: "destructive",
      });
    }

    setIsEditModalOpen(false);
  };

  const handleDeleteImage = async () => {
    if (!currentImage) return;
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const res = await fetchWithAuth(
        `https://api.gradabroad.net/api/media/gallery/images/${currentImage.id}/`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Delete failed");
      toast({ title: "Image deleted", variant: "success" });
      await fetchCategories();
      setCurrentImage(null);
    } catch (err) {
      toast({
        title: "Error",
        description: (err as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const res = await fetchWithAuth(
        "https://api.gradabroad.net/api/media/gallery/categories/",
        {
          method: "POST",
         
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
            onEdit={(img) => {
              setCurrentImage(img);
              setIsEditModalOpen(true);
            }}
            onDelete={(img) => {
              setCurrentImage(img);
              setIsDeleteDialogOpen(true);
            }}
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
        <>
          <GalleryImageModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSave={handleEditImage}
            initialData={currentImage}
            title="Edit Image"
          />

          <GalleryDeleteDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onConfirm={handleDeleteImage}
            imageTitle={currentImage.title}
          />
        </>
      )}
    </div>
  );
}
