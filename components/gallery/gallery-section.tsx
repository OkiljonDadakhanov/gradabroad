"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { GalleryImage, GalleryImageFormData } from "@/types/gallery";
import { GalleryGrid } from "./gallery-grid";
import { GalleryDeleteDialog } from "./gallery-delete-dialog";
import { GalleryImageModal } from "./gallery-image-modal";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { useTranslations } from "@/lib/i18n";
import { createGalleryCategory } from "@/lib/gallery-categories";

interface CategoryGallery {
  id: number;
  name: string;
  images: GalleryImage[];
}

export function GallerySection() {
  const { toast } = useToast();
  const t = useTranslations("media");
  const tCommon = useTranslations("common");

  const [categories, setCategories] = useState<CategoryGallery[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryGallery | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<GalleryImage | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const fetchCategories = async (): Promise<boolean> => {
    const token = localStorage.getItem("accessToken");
    if (!token) return false;

    try {
      const res = await fetchWithAuth(
        "/api/media/gallery/categories/"
      );

      const data = await res.json();

      const mapped: CategoryGallery[] = data.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        images: (cat.images || []).map((img: any) => ({
          id: img.id.toString(),
          imageUrl: img.image_url,
          altText: img.alt_text || cat.name,
          title: img.title || "Untitled",
          description: img.description || "",
          date: img.uploaded_at || "",
        })),
      }));

      setCategories(mapped);
      return true;
    } catch (error) {
      toast({
        title: tCommon("error"),
        description: "Failed to fetch gallery categories",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddImage = async (
    data: GalleryImage | GalleryImageFormData | GalleryImageFormData[]
  ): Promise<boolean> => {
    if (!Array.isArray(data)) return false;
    const images = data;
    if (!selectedCategory) return false;
    const token = localStorage.getItem("accessToken");
    if (!token) return false;

    const failures: string[] = [];

    for (const img of images) {
      const formData = new FormData();
      formData.append("category_id", selectedCategory.id.toString());
      if (img.imageFile) formData.append("image", img.imageFile);
      formData.append("description", img.description);
      formData.append("alt_text", img.altText);
      formData.append("title", img.title);

      try {
        const res = await fetchWithAuth(
          "/api/media/gallery/images/",
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          }
        );

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(
            errorData.detail || errorData.image?.[0] || `Upload failed (${res.status})`
          );
        }
      } catch (error) {
        failures.push(
          `${img.title || "image"}: ${
            error instanceof Error ? error.message : "Upload failed"
          }`
        );
      }
    }

    const refreshed = await fetchCategories();

    if (failures.length > 0) {
      toast({
        title: "Upload failed",
        description: `Could not upload: ${failures.join(", ")}`,
        variant: "destructive",
      });
      return false;
    }

    if (!refreshed) return false;

    toast({
      title: t("uploadSuccessful"),
      description: `${t("uploadedImages")} ${selectedCategory.name}`,
      variant: "success",
    });

    return true;
  };

  const handleEditImage = async (
    image: GalleryImage | GalleryImageFormData | GalleryImageFormData[]
  ): Promise<boolean> => {
    if (Array.isArray(image)) return false;
    const token = localStorage.getItem("accessToken");
    if (!token || !("id" in image) || !image.id || !selectedCategory) return false;

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
        `/api/media/gallery/images/${image.id}/`,
        {
          method: "PATCH", // PATCH is safer for partial updates

          body: formData,
        }
      );

      if (!res.ok) throw new Error("Failed to update image");

      toast({ title: t("imageUpdated"), variant: "success" });
      await fetchCategories();
      return true;
    } catch (err) {
      toast({
        title: "Error",
        description: (err as Error).message,
        variant: "destructive",
      });
      return false;
    }
  };

  const handleDeleteImage = async () => {
    if (!currentImage) return;
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const res = await fetchWithAuth(
        `/api/media/gallery/images/${currentImage.id}/`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Delete failed");
      toast({ title: t("imageDeleted"), variant: "success" });
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
    const categoryName = newCategoryName.trim();
    if (!categoryName) return;
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      await createGalleryCategory(fetchWithAuth, categoryName);
      if (!(await fetchCategories())) return;
      setNewCategoryName("");
      toast({ title: t("categoryAdded"), variant: "success" });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to add new category",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-purple-900">{t("title")}</h2>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder={t("newCategoryPlaceholder")}
            className="border px-3 py-1 rounded-md"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <Button onClick={handleAddCategory} variant="outline">
            {t("addCategory")}
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
              <Plus className="mr-2 h-4 w-4" /> {t("uploadImage")}
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
        title={`${t("addImagesTo")} ${selectedCategory?.name}`}
        isMultiple
      />

      {currentImage && (
        <>
          <GalleryImageModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSave={handleEditImage}
            initialData={currentImage}
            title={t("editImage")}
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
