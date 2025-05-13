"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GalleryGrid } from "./gallery-grid"
import { GalleryImageModal } from "./gallery-image-modal"
import { GalleryDeleteDialog } from "./gallery-delete-dialog"
import { useToast } from "@/hooks/use-toast"
import type { GalleryImage } from "@/types/gallery"
import { generateId } from "@/lib/utils"


export function GallerySection() {
  const { toast } = useToast()
  const [images, setImages] = useState<GalleryImage[]>([
    {
      id: "img-1",
      title: "Academic Conference",
      description: "International academic conference on higher education",
      imageUrl: '/images/demo.jpg',
      altText: "Academic conference with panel speakers",
      date: "2023-05-15",
    },
    {
      id: "img-2",
      title: "Graduation Ceremony",
      description: "Annual graduation ceremony for the class of 2023",
      imageUrl: '/images/demo.jpg',
      altText: "Students at graduation ceremony",
      date: "2023-06-20",
    },
    {
      id: "img-3",
      title: "Campus Tour",
      description: "International delegates touring the university campus",
      imageUrl: '/images/demo.jpg',
      altText: "Group of people touring the campus",
      date: "2023-04-10",
    },
    {
      id: "img-4",
      title: "Guest Lecture",
      description: "Distinguished guest lecture on artificial intelligence",
      imageUrl: '/images/demo.jpg',
      altText: "Guest lecturer presenting to audience",
      date: "2023-07-05",
    },
    {
      id: "img-5",
      title: "Military Band Performance",
      description: "Special performance by the military band during national day celebrations",
      imageUrl: '/images/demo.jpg',
      altText: "Military band performing on campus",
      date: "2023-08-31",
    },
    {
      id: "img-6",
      title: "MOU Signing Ceremony",
      description: "Memorandum of Understanding signing ceremony with partner universities",
      imageUrl: '/images/demo.jpg',
      altText: "Officials at MOU signing ceremony",
      date: "2023-09-15",
    },
  ])

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState<GalleryImage | null>(null)

  const handleAddImage = (image: Omit<GalleryImage, "id">) => {
    const newImage = {
      ...image,
      id: generateId(),
    }

    setImages([...images, newImage])
    setIsAddModalOpen(false)

    toast({
      title: "Image added",
      description: "The image has been successfully added to the gallery.",
      variant: "success",
    })
  }

  const handleEditImage = (image: GalleryImage) => {
    setImages(images.map((img) => (img.id === image.id ? image : img)))
    setIsEditModalOpen(false)

    toast({
      title: "Image updated",
      description: "The image has been successfully updated.",
      variant: "success",
    })
  }

  const handleDeleteImage = () => {
    if (currentImage) {
      setImages(images.filter((img) => img.id !== currentImage.id))
      setIsDeleteDialogOpen(false)

      toast({
        title: "Image deleted",
        description: "The image has been successfully deleted from the gallery.",
        variant: "success",
      })

      setCurrentImage(null)
    }
  }

  const handleOpenEditModal = (image: GalleryImage) => {
    setCurrentImage(image)
    setIsEditModalOpen(true)
  }

  const handleOpenDeleteDialog = (image: GalleryImage) => {
    setCurrentImage(image)
    setIsDeleteDialogOpen(true)
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-purple-900">Gallery</h2>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-purple-900 hover:bg-purple-800">
          <Plus className="mr-2 h-4 w-4" /> Add
        </Button>
      </div>

      <GalleryGrid images={images} onEdit={handleOpenEditModal} onDelete={handleOpenDeleteDialog} />

      {/* Add Image Modal */}
      <GalleryImageModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddImage}
        title="Add Image"
      />

      {/* Edit Image Modal */}
      {currentImage && (
        <GalleryImageModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleEditImage}
          initialData={currentImage}
          title="Edit Image"
        />
      )}

      {/* Delete Confirmation Dialog */}
      {currentImage && (
        <GalleryDeleteDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteImage}
          imageTitle={currentImage.title}
        />
      )}
    </>
  )
}
