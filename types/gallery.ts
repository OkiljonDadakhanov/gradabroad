export interface GalleryImage {
  id: string
  title: string
  description: string
  imageUrl: string
  altText: string
  date: string
}

export type GalleryImageFormData = Omit<GalleryImage, "id">
