"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SectionHeader } from "@/components/ui/section-header";
import { InfoCard } from "@/components/ui/info-card";
import { ProfileEditModal } from "./profile-edit-modal";
import type { ProfileData } from "@/types/profile";

export function ProfileSection() {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  // Step 1: Extract and store token, clean URL
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const queryToken = searchParams.get("token");

    if (queryToken) {
      localStorage.setItem("accessToken", queryToken);
      const cleanUrl = window.location.origin + window.location.pathname;
      document.title = "GradAbroad – University Application";
      window.history.replaceState({}, document.title, cleanUrl);
    } else {
      document.title = "GradAbroad – University Application";
    }
  }, []);

  // Step 2: Fetch and map profile data
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch(
          "https://api.gradabroad.net/api/auth/universities/me/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 401) {
          toast.error("Session expired. Please log in again.");
          localStorage.removeItem("accessToken");
          router.push("/login");
          return;
        }

        if (!res.ok) {
          toast.error("Failed to load profile");
          return;
        }

        const raw = await res.json();

        if (raw.id) {
          localStorage.setItem("universityId", String(raw.id));
        }

        // ✅ Map raw backend fields to frontend ProfileData
        const data: ProfileData = {
          name: raw.university_name,
          type: raw.types_of_schools,
          classification: raw.classification,
          address: raw.address,
          city: raw.city,
          zipCode: raw.zip_code,
          telephone: raw.university_office_phone,
          email: raw.university_admission_email_address,
          accreditationNumber: raw.accreditation_number,
          accreditationDocument: raw.accreditation_document,
          avatar: raw.logo || null,

          telegramLink: "",
          instagramLink: "",
          youtubeLink: "",
          facebookLink: "",
        };

        setProfileData(data);
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleEditClick = () => setIsEditModalOpen(true);
  const handleSave = (updatedData: ProfileData) => {
    setProfileData(updatedData);
    setIsEditModalOpen(false);
  };

  if (loading) return <p className="text-white">Loading...</p>;
  if (!profileData) return null;

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
          {
            label: "Name of the university or institution",
            value: profileData.name,
            highlight: true,
          },
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
        items={[
          { label: "Email address", value: profileData.email, highlight: true },
          { label: "Telephone number", value: profileData.telephone },
          {
            label: "Accreditation number",
            value: profileData.accreditationNumber,
          },
        ]}
      />

      <InfoCard
        items={[
          {
            label: "Accreditation document",
            value: (
              <a
                href={profileData.accreditationDocument}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                View document
              </a>
            ),
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
  );
}
