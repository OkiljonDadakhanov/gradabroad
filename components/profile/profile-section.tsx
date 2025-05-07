"use client"

import { useState } from "react"
import { SectionHeader } from "@/components/ui/section-header"
import { InfoCard } from "@/components/ui/info-card"
import { ProfileEditModal } from "./profile-edit-modal"
import type { ProfileData } from "@/types/profile"

export function ProfileSection() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "New Uzbekistan University",
    type: "Public",
    classification: "University",
    address: "1A, Mirzo Ulugbek district, Tashkent city",
    city: "Tashkent",
    zipCode: "135000",
    latitude: "41.31578945559221",
    longitude: "69.29544925689699",
    email: "shamshiev.education@gmail.com",
    telephone: "+998 91 779 25 25",
    accreditationNumber: "AA2455755",
    accreditationDocument: "wdi_master_s_degree.jpg",
    telegramLink: "https://t.me/newuzbekistanuniversity",
    instagramLink: "",
    youtubeLink: "",
    facebookLink: "",
    avatar: "/placeholder.svg?height=288&width=288",
  })

  const handleEditClick = () => {
    setIsEditModalOpen(true)
  }

  const handleSave = (updatedData: ProfileData) => {
    setProfileData(updatedData)
    setIsEditModalOpen(false)
  }

  return (
    <>
      <SectionHeader title="My profile" onEdit={handleEditClick} />

      <div className="mb-6">
        <div className="w-24 h-24 rounded-full overflow-hidden">
          <img
            src={profileData.avatar || "/placeholder.svg"}
            alt="University Avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <InfoCard
        items={[
          { label: "Name of the university or institution", value: profileData.name, highlight: true },
          { label: "Type", value: profileData.type },
          { label: "Classification", value: profileData.classification },
        ]}
      />

      <InfoCard
        items={[
          { label: "Address", value: profileData.address, highlight: true },
          { label: "City", value: profileData.city },
          { label: "Zip code", value: profileData.zipCode },
        ]}
      />

      <InfoCard
        className="mb-6"
        items={[
          {
            label: "Latitude/Longitude",
            value: `${profileData.latitude} - ${profileData.longitude}`,
          },
        ]}
      />

      <InfoCard
        items={[
          { label: "Email address", value: profileData.email, highlight: true },
          { label: "Telephone number", value: profileData.telephone },
          { label: "Accreditation number", value: profileData.accreditationNumber },
        ]}
      />

      <InfoCard
        items={[
          {
            label: "Accreditation document",
            value: <span className="text-blue-500">{profileData.accreditationDocument}</span>,
          },
        ]}
      />

      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={profileData}
        onSave={handleSave}
      />
    </>
  )
}

