export interface GalleryImage {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  altText: string;
  date: string;
  imageFile?: File;
}

export type GalleryImageFormData = Omit<GalleryImage, "id">;
