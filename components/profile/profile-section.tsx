"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SectionHeader } from "@/components/ui/section-header";
import { InfoCard } from "@/components/ui/info-card";
import { ProfileEditModal } from "./profile-edit-modal";
import type { ProfileData } from "@/types/profile";
export const metadata = {
  title: "GradAbroad – University Application",
};

export function ProfileSection() {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Step 1: Extract and store token, clean URL
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const queryToken = searchParams.get("token");

    if (queryToken) {
      localStorage.setItem("accessToken", queryToken);

      // ✅ Clean the URL immediately
      const cleanUrl = window.location.origin + window.location.pathname;
      document.title = "GradAbroad – University Application";
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, []);

  // ✅ Step 2: Fetch profile using token
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

        const data = await res.json();
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
              <span className="text-blue-500">
                {profileData.accreditationDocument}
              </span>
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
