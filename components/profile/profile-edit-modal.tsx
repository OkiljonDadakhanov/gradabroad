"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUpload } from "@/components/ui/file-upload"
import { useForm } from "@/hooks/use-form"
import type { ProfileData } from "@/types/profile"
import { Check } from "lucide-react"

interface ProfileEditModalProps {
  isOpen: boolean
  onClose: () => void
  initialData: ProfileData
  onSave: (data: ProfileData) => void
}

export function ProfileEditModal({ isOpen, onClose, initialData, onSave }: ProfileEditModalProps) {
  const { values, handleChange, handleSelectChange, setValues, reset } = useForm<ProfileData>(initialData)

  const handleSubmit = () => {
    onSave(values)
  }

  const handleCancel = () => {
    reset()
    onClose()
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
          <DialogTitle className="text-xl font-bold">Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-2">
            <div className="w-24 h-24 rounded-full overflow-hidden">
              <img
                src={values.avatar || "/placeholder.svg"}
                alt="University Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Update your avatar by clicking the image beside.</p>
              <p className="text-xs text-gray-500">288x288 px size recommended in PNG</p>
              <p className="text-xs text-gray-500">or JPG format only.</p>
            </div>
          </div>

          {/* University Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name of the university or institution *</Label>
              <Input id="name" name="name" value={values.name} onChange={handleChange} className="mt-1" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Type *</Label>
                <Select value={values.type} onValueChange={(value) => handleSelectChange("type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Public">Public</SelectItem>
                    <SelectItem value="Private">Private</SelectItem>
                    <SelectItem value="Charter">Charter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="classification">Classification *</Label>
                <Select
                  value={values.classification}
                  onValueChange={(value) => handleSelectChange("classification", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select classification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="University">University</SelectItem>
                    <SelectItem value="College">College</SelectItem>
                    <SelectItem value="Institute">Institute</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Address Info */}
            <div>
              <Label htmlFor="address">Address *</Label>
              <Input id="address" name="address" value={values.address} onChange={handleChange} className="mt-1" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" value={values.city} onChange={handleChange} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="zipCode">Zip code</Label>
                <Input id="zipCode" name="zipCode" value={values.zipCode} onChange={handleChange} className="mt-1" />
              </div>
            </div>

            {/* Coordinates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude">Latitude *</Label>
                <Input id="latitude" name="latitude" value={values.latitude} onChange={handleChange} className="mt-1" />
              </div>
              <div className="relative">
                <Label htmlFor="longitude">Longitude *</Label>
                <Input
                  id="longitude"
                  name="longitude"
                  value={values.longitude}
                  onChange={handleChange}
                  className="mt-1"
                />
                <div className="absolute right-0 top-7">
                  <div className="bg-green-500 text-white p-2 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <Label htmlFor="email">Email address *</Label>
              <div className="relative">
                <Input id="email" name="email" value={values.email} onChange={handleChange} className="mt-1" />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Check className="text-green-500" size={20} />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="telephone">Telephone number *</Label>
              <div className="flex">
                <div className="flex items-center border rounded-l px-3 bg-white">
                  <span className="text-green-600 mr-1">🇺🇿</span>
                  <span>+</span>
                </div>
                <Input
                  id="telephone"
                  name="telephone"
                  value={values.telephone.replace("+", "")}
                  onChange={(e) =>
                    setValues({
                      ...values,
                      telephone: "+" + e.target.value,
                    })
                  }
                  className="rounded-l-none"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="accreditationNumber">Accreditation number *</Label>
              <Input
                id="accreditationNumber"
                name="accreditationNumber"
                value={values.accreditationNumber}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            {/* Document Upload */}
            <FileUpload
              label="Accreditation document *"
              value={values.accreditationDocument}
              onChange={(fileName) =>
                setValues({
                  ...values,
                  accreditationDocument: fileName,
                })
              }
            />

            {/* Social Media Links */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="telegramLink">Telegram link</Label>
                <Input
                  id="telegramLink"
                  name="telegramLink"
                  value={values.telegramLink}
                  onChange={handleChange}
                  className="mt-1"
                  placeholder="https://t.me/username"
                />
              </div>
              <div>
                <Label htmlFor="instagramLink">Instagram link</Label>
                <Input
                  id="instagramLink"
                  name="instagramLink"
                  value={values.instagramLink}
                  onChange={handleChange}
                  className="mt-1"
                  placeholder="Instagram link"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="youtubeLink">Youtube link</Label>
                <Input
                  id="youtubeLink"
                  name="youtubeLink"
                  value={values.youtubeLink}
                  onChange={handleChange}
                  className="mt-1"
                  placeholder="Youtube link"
                />
              </div>
              <div>
                <Label htmlFor="facebookLink">Facebook link</Label>
                <Input
                  id="facebookLink"
                  name="facebookLink"
                  value={values.facebookLink}
                  onChange={handleChange}
                  className="mt-1"
                  placeholder="Facebook link"
                />
              </div>
            </div>
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

