"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SectionHeader } from "@/components/ui/section-header";
import { InfoCard } from "@/components/ui/info-card";
import { ProfileEditModal } from "./profile-edit-modal";
import type { ProfileData } from "@/types/profile";
import { fetchWithAuth, setAuthCookie, clearAuthCookie } from "@/lib/fetchWithAuth";
import { useTranslations } from "@/lib/i18n";
import { API_BASE } from "@/lib/constants";

export function ProfileSection() {
  const router = useRouter();
  const t = useTranslations("profile");
  const tCommon = useTranslations("common");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [docLoading, setDocLoading] = useState(false);

  // Step 1: Extract and store tokens, clean URL
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const queryToken = searchParams.get("token");
    const queryRefresh = searchParams.get("refresh");

    if (queryToken) {
      localStorage.setItem("accessToken", queryToken);
      setAuthCookie(queryToken);
      if (queryRefresh) {
        localStorage.setItem("refreshToken", queryRefresh);
      }
      document.title = "GradAbroad – University Application";
      router.replace("/profile");
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
          `${API_BASE}/api/auth/universities/me/`
        );

        if (res.status === 401) {
          toast.error("Session expired. Please log in again.");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          clearAuthCookie();
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
          representativeName: raw.university_admission_representative_name,
          representativeEmail: raw.university_admission_representative_email,
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
        `${API_BASE}/api/auth/universities/me/accreditation-url/`
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
        title={t("title")}
        subtitle={t("subtitle")}
        onEdit={handleEditClick}
      />

      {/* Profile Header Card */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-xl overflow-hidden bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            {profileData.logo_url ? (
              <img
                src={profileData.logo_url}
                alt="University Logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {profileData.name?.charAt(0) || "U"}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{profileData.name}</h3>
            <p className="text-gray-500 dark:text-gray-400">{profileData.type} • {profileData.classification}</p>
            {profileData.website && (
              <a
                href={profileData.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-purple-600 dark:text-purple-400 hover:underline mt-1 inline-block"
              >
                {profileData.website}
              </a>
            )}
          </div>
        </div>
      </div>

      <InfoCard
        title={t("location")}
        items={[
          { label: t("address"), value: profileData.address },
          { label: t("city"), value: profileData.city },
          { label: t("zipCode"), value: profileData.zipCode },
        ]}
      />

      <InfoCard
        title={t("contactInfo")}
        items={[
          { label: tCommon("email"), value: profileData.email },
          { label: tCommon("phone"), value: profileData.telephone },
          { label: t("representative"), value: profileData.representativeName },
          { label: t("representativeEmail"), value: profileData.representativeEmail },
        ]}
      />

      <InfoCard
        title={t("accreditation")}
        items={[
          {
            label: t("accreditationNumber"),
            value: profileData.accreditationNumber,
          },
          {
            label: t("document"),
            value: (
              <button
                onClick={handleFetchAccreditationUrl}
                className="text-purple-600 hover:text-purple-700 font-medium disabled:opacity-50"
                disabled={docLoading}
              >
                {docLoading ? tCommon("loading") : `${t("viewDocument")} →`}
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
