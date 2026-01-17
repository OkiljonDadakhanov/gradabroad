"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SectionHeader } from "@/components/ui/section-header";
import { InfoCard } from "@/components/ui/info-card";
import { ProfileEditModal } from "./profile-edit-modal";
import type { ProfileData } from "@/types/profile";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export function ProfileSection() {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [docLoading, setDocLoading] = useState(false);

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

  // Step 2: Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetchWithAuth(
          "https://api.gradabroad.net/api/auth/universities/me/"
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
          signed_accreditation_document_url: null, // will fetch on demand
          logo_url: raw.logo_url || null,
          representativeName: raw.university_admission_representetive_name,
          representativeEmail: raw.university_admission_representetive_email,
          website: raw.website,
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

  const handleFetchAccreditationUrl = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    setDocLoading(true);

    try {
      const res = await fetchWithAuth(
        "https://api.gradabroad.net/api/auth/universities/me/accreditation-url/"
      );

      if (!res.ok) {
        toast.error("Failed to load accreditation document.");
        return;
      }

      const json = await res.json();
      const signedUrl = json?.signed_url;
      if (signedUrl) {
        window.open(signedUrl, "_blank");
      } else {
        toast.error("No document URL received.");
      }
    } catch (err) {
      console.error("Error fetching accreditation doc URL:", err);
      toast.error("Something went wrong.");
    } finally {
      setDocLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!profileData) return null;

  return (
    <div className="max-w-4xl">
      <SectionHeader
        title="University Profile"
        subtitle="Manage your institution's information"
        onEdit={handleEditClick}
      />

      {/* Profile Header Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-xl overflow-hidden bg-purple-100 flex items-center justify-center">
            {profileData.logo_url ? (
              <img
                src={profileData.logo_url}
                alt="University Logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-purple-600">
                {profileData.name?.charAt(0) || "U"}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{profileData.name}</h3>
            <p className="text-gray-500">{profileData.type} • {profileData.classification}</p>
            {profileData.website && (
              <a
                href={profileData.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-purple-600 hover:underline mt-1 inline-block"
              >
                {profileData.website}
              </a>
            )}
          </div>
        </div>
      </div>

      <InfoCard
        title="Location"
        items={[
          { label: "Address", value: profileData.address },
          { label: "City", value: profileData.city },
          { label: "Zip Code", value: profileData.zipCode },
        ]}
      />

      <InfoCard
        title="Contact Information"
        items={[
          { label: "Email", value: profileData.email },
          { label: "Phone", value: profileData.telephone },
          { label: "Representative", value: profileData.representativeName },
          { label: "Representative Email", value: profileData.representativeEmail },
        ]}
      />

      <InfoCard
        title="Accreditation"
        items={[
          {
            label: "Accreditation Number",
            value: profileData.accreditationNumber,
          },
          {
            label: "Document",
            value: (
              <button
                onClick={handleFetchAccreditationUrl}
                className="text-purple-600 hover:text-purple-700 font-medium disabled:opacity-50"
                disabled={docLoading}
              >
                {docLoading ? "Loading..." : "View Document →"}
              </button>
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
    </div>
  );
}
