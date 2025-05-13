"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "@/hooks/use-form"
import type { GalleryImage, GalleryImageFormData } from "@/types/gallery"
import { X, Upload } from "lucide-react"

interface GalleryImageModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: GalleryImage | GalleryImageFormData) => void
  initialData?: GalleryImage
  title: string
}

const defaultFormData: GalleryImageFormData = {
  title: "",
  description: "",
  imageUrl: "",
  altText: "",
  date: new Date().toISOString().split("T")[0],
}

export function GalleryImageModal({ isOpen, onClose, onSave, initialData, title }: GalleryImageModalProps) {
  const { values, handleChange, setValues, reset } = useForm<GalleryImageFormData>(initialData || defaultFormData)
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.imageUrl || null)
  const [fileName, setFileName] = useState<string>("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = () => {
    if (!previewUrl) {
      setError("Please upload an image")
      return
    }

    if (initialData) {
      onSave({
        ...values,
        id: initialData.id,
        imageUrl: previewUrl,
      })
    } else {
      onSave({
        ...values,
        imageUrl: previewUrl,
      })
    }
  }

  const handleCancel = () => {
    reset()
    setPreviewUrl(null)
    setFileName("")
    setError(null)
    onClose()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const maxSize = 5 * 1024 * 1024 // 5MB

      if (file.size > maxSize) {
        setError(`File is too large. Maximum size is 5MB.`)
        return
      }

      setFileName(file.name)

      // Create a preview URL for the selected image
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviewUrl(event.target.result as string)
          setValues({
            ...values,
            imageUrl: file.name, // Store the filename
            altText: values.altText || file.name.split(".")[0], // Use filename as default alt text if empty
          })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveFile = () => {
    setPreviewUrl(null)
    setFileName("")
    setValues({
      ...values,
      imageUrl: "",
    })
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleCancel()
      }}
    >
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div>
            <Label htmlFor="title">Image title *</Label>
            <Input id="title" name="title" value={values.title} onChange={handleChange} className="mt-1" required />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={values.description}
              onChange={handleChange}
              className="mt-1 resize-none"
              rows={3}
            />
          </div>

          <div>
            <Label>Image *</Label>
            <div
              className="border-2 border-dashed rounded-md p-6 mt-1 cursor-pointer"
              onClick={() => document.getElementById("image-upload")?.click()}
            >
              {previewUrl ? (
                <div className="space-y-2">
                  <img
                    src={previewUrl || "/placeholder.svg"}
                    alt="Preview"
                    className="max-h-48 mx-auto object-contain"
                  />
                  <div className="flex justify-between items-center bg-purple-100 rounded-md p-2">
                    <span className="text-sm truncate max-w-[80%]">{fileName}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveFile()
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <div className="bg-purple-700 text-white p-3 rounded-full mb-2">
                    <Upload size={24} />
                  </div>
                  <p className="text-sm font-medium">Click to upload</p>
                  <p className="text-xs text-gray-500">(Max file size: 5 MB)</p>
                </div>
              )}
            </div>
            <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </div>

          <div>
            <Label htmlFor="altText">Alt text (for accessibility) *</Label>
            <Input
              id="altText"
              name="altText"
              value={values.altText}
              onChange={handleChange}
              className="mt-1"
              placeholder="Brief description of the image for screen readers"
              required
            />
          </div>

          <div>
            <Label htmlFor="date">Date</Label>
            <Input id="date" name="date" type="date" value={values.date} onChange={handleChange} className="mt-1" />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-purple-900 hover:bg-purple-800">
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
