"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { useForm } from "@/hooks/use-form"
import type { SponsoredContent, SponsoredContentFormData } from "@/types/sponsored-content"
import { Upload, X } from "lucide-react"

interface SponsoredContentModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: SponsoredContent | SponsoredContentFormData) => void
  initialData: SponsoredContent | SponsoredContentFormData
  title: string
}

export function SponsoredContentModal({ isOpen, onClose, onSave, initialData, title }: SponsoredContentModalProps) {
  const { values, handleChange, handleNestedChange, handleCheckboxChange, reset } = useForm<SponsoredContentFormData>(
    initialData as SponsoredContentFormData,
  )
  const [activeTab, setActiveTab] = useState("english")
  const [imagePreview, setImagePreview] = useState<string | null>(initialData.imageUrl || null)
  const [imageFileName, setImageFileName] = useState<string>("")
  const [videoPreview, setVideoPreview] = useState<string | null>(initialData.videoUrl || null)
  const [videoFileName, setVideoFileName] = useState<string>("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = () => {
    if (!values.name.english.trim()) {
      setError("Ad name in English is required")
      return
    }

    if ("id" in initialData) {
      onSave({
        ...values,
        id: initialData.id,
        imageUrl: imagePreview || "",
        videoUrl: videoPreview || "",
      })
    } else {
      onSave({
        ...values,
        imageUrl: imagePreview || "",
        videoUrl: videoPreview || "",
      })
    }
  }

  const handleCancel = () => {
    reset()
    setImagePreview(initialData.imageUrl || null)
    setVideoPreview(initialData.videoUrl || null)
    setImageFileName("")
    setVideoFileName("")
    setError(null)
    onClose()
  }

  const handleNameChange = (lang: string, value: string) => {
    handleNestedChange("name", lang, value)
  }

  const handleDescriptionChange = (lang: string, value: string) => {
    handleNestedChange("description", lang, value)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const maxSize = 5 * 1024 * 1024 // 5MB

      if (file.size > maxSize) {
        setError(`File is too large. Maximum size is 5MB.`)
        return
      }

      setImageFileName(file.name)

      // Create a preview URL for the selected image
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreview(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const maxSize = 50 * 1024 * 1024 // 50MB

      if (file.size > maxSize) {
        setError(`File is too large. Maximum size is 50MB.`)
        return
      }

      setVideoFileName(file.name)

      // Create a preview URL for the selected video
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setVideoPreview(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    setImageFileName("")
  }

  const handleRemoveVideo = () => {
    setVideoPreview(null)
    setVideoFileName("")
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleCancel()
      }}
    >
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div>
            <Label>Ad name *</Label>
            <Tabs defaultValue="english" className="mt-2" onValueChange={setActiveTab}>
              <TabsList className="bg-purple-100">
                <TabsTrigger
                  value="english"
                  className="data-[state=active]:bg-purple-700 data-[state=active]:text-white"
                >
                  English
                </TabsTrigger>
                <TabsTrigger
                  value="korean"
                  className="data-[state=active]:bg-purple-700 data-[state=active]:text-white"
                >
                  한국어
                </TabsTrigger>
                <TabsTrigger
                  value="russian"
                  className="data-[state=active]:bg-purple-700 data-[state=active]:text-white"
                >
                  Русский
                </TabsTrigger>
                <TabsTrigger value="uzbek" className="data-[state=active]:bg-purple-700 data-[state=active]:text-white">
                  O'zbek
                </TabsTrigger>
              </TabsList>

              <TabsContent value="english" className="mt-2">
                <Input
                  placeholder="Ad name"
                  value={values.name.english}
                  onChange={(e) => handleNameChange("english", e.target.value)}
                  required
                />
              </TabsContent>
              <TabsContent value="korean" className="mt-2">
                <Input
                  placeholder="광고 이름"
                  value={values.name.korean}
                  onChange={(e) => handleNameChange("korean", e.target.value)}
                />
              </TabsContent>
              <TabsContent value="russian" className="mt-2">
                <Input
                  placeholder="Название рекламы"
                  value={values.name.russian}
                  onChange={(e) => handleNameChange("russian", e.target.value)}
                />
              </TabsContent>
              <TabsContent value="uzbek" className="mt-2">
                <Input
                  placeholder="Reklama nomi"
                  value={values.name.uzbek}
                  onChange={(e) => handleNameChange("uzbek", e.target.value)}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Label>Description</Label>
            <Tabs defaultValue="english" className="mt-2" onValueChange={setActiveTab}>
              <TabsList className="bg-purple-100">
                <TabsTrigger
                  value="english"
                  className="data-[state=active]:bg-purple-700 data-[state=active]:text-white"
                >
                  English
                </TabsTrigger>
                <TabsTrigger
                  value="korean"
                  className="data-[state=active]:bg-purple-700 data-[state=active]:text-white"
                >
                  한국어
                </TabsTrigger>
                <TabsTrigger
                  value="russian"
                  className="data-[state=active]:bg-purple-700 data-[state=active]:text-white"
                >
                  Русский
                </TabsTrigger>
                <TabsTrigger value="uzbek" className="data-[state=active]:bg-purple-700 data-[state=active]:text-white">
                  O'zbek
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <RichTextEditor
              value={{
                english: values.description.english,
                korean: values.description.korean,
                russian: values.description.russian,
                uzbek: values.description.uzbek,
              }}
              onChange={handleDescriptionChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Upload image</Label>
              <div
                className="border-2 border-dashed rounded-md p-6 mt-1 cursor-pointer"
                onClick={() => document.getElementById("image-upload")?.click()}
              >
                {imagePreview ? (
                  <div className="space-y-2">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="max-h-48 mx-auto object-contain"
                    />
                    <div className="flex justify-between items-center bg-purple-100 rounded-md p-2">
                      <span className="text-sm truncate max-w-[80%]">{imageFileName}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveImage()
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
              <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </div>

            <div>
              <Label>Upload video</Label>
              <div
                className="border-2 border-dashed rounded-md p-6 mt-1 cursor-pointer"
                onClick={() => document.getElementById("video-upload")?.click()}
              >
                {videoPreview ? (
                  <div className="space-y-2">
                    <video src={videoPreview} controls className="max-h-48 mx-auto" />
                    <div className="flex justify-between items-center bg-purple-100 rounded-md p-2">
                      <span className="text-sm truncate max-w-[80%]">{videoFileName}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveVideo()
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
                    <p className="text-xs text-gray-500">(Max file size: 50 MB)</p>
                  </div>
                )}
              </div>
              <input id="video-upload" type="file" accept="video/*" className="hidden" onChange={handleVideoChange} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={values.startDate}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="endDate">End date</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={values.endDate}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="targetUrl">Target URL</Label>
            <Input
              id="targetUrl"
              name="targetUrl"
              type="url"
              value={values.targetUrl}
              onChange={handleChange}
              className="mt-1"
              placeholder="https://example.com"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={values.isActive}
              onCheckedChange={(checked) => {
                handleCheckboxChange("isActive", checked as boolean)
              }}
            />
            <Label htmlFor="isActive" className="font-normal">
              Active
            </Label>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

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
