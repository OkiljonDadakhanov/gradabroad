"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileUpload } from "@/components/ui/file-upload";
import { useForm } from "@/hooks/use-form";
import type { ProfileData } from "@/types/profile";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { useRef } from "react";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: ProfileData;
  onSave: (data: ProfileData) => void;
}

export function ProfileEditModal({
  isOpen,
  onClose,
  initialData,
  onSave,
}: ProfileEditModalProps) {
  const { values, handleChange, handleSelectChange, setValues, reset } =
    useForm<ProfileData>(initialData);

  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    const formData = new FormData();

    formData.append("university_name", values.name);
    formData.append("types_of_schools", values.type);
    formData.append("classification", values.classification);
    formData.append("address", values.address);
    formData.append("city", values.city);
    formData.append("zip_code", values.zipCode);
    formData.append("university_admission_email_address", values.email);
    formData.append("university_office_phone", values.telephone);
    formData.append("accreditation_number", values.accreditationNumber);
    formData.append("website", values.website);
    formData.append(
      "university_admission_representetive_name",
      values.representativeName
    );
    formData.append(
      "university_admission_representetive_email",
      values.representativeEmail
    );

    if (values.signed_accreditation_document_url instanceof File) {
      formData.append(
        "accreditation_document",
        values.signed_accreditation_document_url
      );
    }

    if (values.logo_url instanceof File) {
      formData.append("logo", values.logo_url);
    }

    try {
      const response = await fetch(
        "https://api.gradabroad.net/api/auth/universities/me/",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const err = await response.json();
        console.error(err);
        toast.error("Failed to update profile.");
        return;
      }

      const raw = await response.json();

      const mapped: ProfileData = {
        name: raw.university_name,
        type: raw.types_of_schools,
        classification: raw.classification,
        address: raw.address,
        city: raw.city,
        zipCode: raw.zip_code,
        telephone: raw.university_office_phone,
        email: raw.university_admission_email_address,
        accreditationNumber: raw.accreditation_number,
        signed_accreditation_document_url: raw.accreditation_document,
        logo_url: raw.logo_url ?? raw.logo ?? null,
        website: raw.website,
        representativeName: raw.university_admission_representetive_name,
        representativeEmail: raw.university_admission_representetive_email,
        telegramLink: "",
        instagramLink: "",
        youtubeLink: "",
        facebookLink: "",
      };

      onSave(mapped);
      toast.success("Profile updated successfully!");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while saving changes.");
    }
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleCancel();
      }}
    >
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center space-y-2">
            <label
              htmlFor="avatar-upload"
              className="cursor-pointer w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 hover:border-purple-700 transition-all"
            >
              <img
                src={
                  values.logo_url instanceof File
                    ? URL.createObjectURL(values.logo_url)
                    : values.logo_url || "/placeholder.svg"
                }
                alt="University Avatar"
                className="w-full h-full object-cover"
              />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                ref={avatarInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setValues({ ...values, logo_url: file });
                  }
                }}
              />
            </label>
            <p className="text-sm text-gray-500 text-center">
              Click the image to upload a new avatar. <br />
              288x288 px PNG or JPG recommended.
            </p>
          </div>

          {/* Fields */}
          <div className="space-y-4">
            <div>
              <Label>Name of the university or institution *</Label>
              <Input name="name" value={values.name} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type *</Label>
                <Select
                  value={values.type}
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="University">University</SelectItem>
                    <SelectItem value="College">College</SelectItem>
                    <SelectItem value="Institute">Institute</SelectItem>
                    <SelectItem value="Academy">Academy</SelectItem>
                    <SelectItem value="Graduate School">
                      Graduate School
                    </SelectItem>
                    <SelectItem value="Foreign Branch Campus">
                      Foreign Branch Campus
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Classification *</Label>
                <Select
                  value={values.classification}
                  onValueChange={(value) =>
                    handleSelectChange("classification", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select classification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="National">National</SelectItem>
                    <SelectItem value="Public">Public</SelectItem>
                    <SelectItem value="Private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Label>Address *</Label>
            <Input
              name="address"
              value={values.address}
              onChange={handleChange}
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>City</Label>
                <Input
                  name="city"
                  value={values.city}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>Zip code</Label>
                <Input
                  name="zipCode"
                  value={values.zipCode}
                  onChange={handleChange}
                />
              </div>
            </div>

            <Label>Email address *</Label>
            <div className="relative">
              <Input
                name="email"
                value={values.email}
                onChange={handleChange}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Check className="text-green-500" size={20} />
              </div>
            </div>

            <Label>Telephone number *</Label>
            <div className="flex">
              <div className="flex items-center border rounded-l px-3 bg-white">
                <span className="text-green-600 mr-1">🇺🇿</span>
                <span>+</span>
              </div>
              <Input
                name="telephone"
                value={(values.telephone ?? "").replace("+", "")}
                onChange={(e) =>
                  setValues({ ...values, telephone: "+" + e.target.value })
                }
                className="rounded-l-none"
              />
            </div>

            <Label>Accreditation number *</Label>
            <Input
              name="accreditationNumber"
              value={values.accreditationNumber}
              onChange={handleChange}
            />

            <FileUpload
              label="Accreditation document *"
              value={values.signed_accreditation_document_url}
              onChange={(file: File) =>
                setValues({
                  ...values,
                  signed_accreditation_document_url: file,
                })
              }
            />

            {/* 🔹 NEW FIELDS */}
            <Label>University Website</Label>
            <Input
              name="website"
              value={values.website}
              onChange={handleChange}
            />

            <Label>Representative Name</Label>
            <Input
              name="representativeName"
              value={values.representativeName}
              onChange={handleChange}
            />

            <Label>Representative Email</Label>
            <Input
              name="representativeEmail"
              value={values.representativeEmail}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-purple-900 hover:bg-purple-800"
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
