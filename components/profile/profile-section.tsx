"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ProfileEditModal } from "./profile-edit-modal";
import type { ProfileData } from "@/types/profile";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { useTranslations } from "@/lib/i18n";
import { API_BASE } from "@/lib/constants";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Award,
  FileText,
  User,
  ExternalLink,
  Edit3,
  Loader2,
  CheckCircle2,
  MapPinned,
  AtSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProfileSection() {
  const router = useRouter();
  const t = useTranslations("profile");
  const tCommon = useTranslations("common");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [docLoading, setDocLoading] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const queryToken = searchParams.get("token");
    const queryRefresh = searchParams.get("refresh");

    if (queryToken) {
      localStorage.setItem("accessToken", queryToken);
      if (queryRefresh) {
        localStorage.setItem("refreshToken", queryRefresh);
      }
      const cleanUrl = window.location.origin + window.location.pathname;
      document.title = "K-GradAbroad – University Application";
      window.history.replaceState({}, document.title, cleanUrl);
    } else {
      document.title = "K-GradAbroad – University Application";
    }
  }, []);

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
          signed_accreditation_document_url: null,
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
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) return null;

  const InfoRow = ({ icon, label, value, isLink = false, href = "" }: {
    icon: React.ReactNode;
    label: string;
    value: string | React.ReactNode;
    isLink?: boolean;
    href?: string;
  }) => (
    <div className="flex items-start gap-4 py-3">
      <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
          {label}
        </p>
        {isLink && href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-purple-600 hover:text-purple-700 hover:underline flex items-center gap-1"
          >
            {value}
            <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <p className="text-sm font-medium text-gray-900">
            {value || <span className="text-gray-300">Not provided</span>}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
          <p className="text-gray-500 mt-1">{t("subtitle")}</p>
        </div>
        <Button
          onClick={handleEditClick}
          className="bg-purple-600 hover:bg-purple-700 shadow-sm"
        >
          <Edit3 className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      {/* Profile Hero Card */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-8 mb-6 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative flex items-start gap-6">
          {/* Logo */}
          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white/20 backdrop-blur flex items-center justify-center border border-white/30 shadow-lg flex-shrink-0">
            {profileData.logo_url ? (
              <img
                src={profileData.logo_url}
                alt="University Logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <Building2 className="h-12 w-12 text-white/80" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">{profileData.name}</h2>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {profileData.type && (
                <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-sm font-medium">
                  {profileData.type}
                </span>
              )}
              {profileData.classification && (
                <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-sm font-medium">
                  {profileData.classification}
                </span>
              )}
              {profileData.accreditationNumber && (
                <span className="px-3 py-1 bg-green-500/30 backdrop-blur rounded-full text-sm font-medium flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Accredited
                </span>
              )}
            </div>
            {profileData.website && (
              <a
                href={profileData.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white/90 hover:text-white text-sm"
              >
                <Globe className="h-4 w-4" />
                {profileData.website}
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Location Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <MapPin className="h-4 w-4 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">{t("location")}</h3>
          </div>
          <div className="p-5 divide-y divide-gray-100">
            <InfoRow
              icon={<MapPinned className="h-4 w-4 text-purple-600" />}
              label={t("address")}
              value={profileData.address}
            />
            <InfoRow
              icon={<Building2 className="h-4 w-4 text-purple-600" />}
              label={t("city")}
              value={profileData.city}
            />
            <InfoRow
              icon={<MapPin className="h-4 w-4 text-purple-600" />}
              label={t("zipCode")}
              value={profileData.zipCode}
            />
          </div>
        </div>

        {/* Contact Info Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <Phone className="h-4 w-4 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">{t("contactInfo")}</h3>
          </div>
          <div className="p-5 divide-y divide-gray-100">
            <InfoRow
              icon={<Mail className="h-4 w-4 text-purple-600" />}
              label={tCommon("email")}
              value={profileData.email}
              isLink={!!profileData.email}
              href={`mailto:${profileData.email}`}
            />
            <InfoRow
              icon={<Phone className="h-4 w-4 text-purple-600" />}
              label={tCommon("phone")}
              value={profileData.telephone}
              isLink={!!profileData.telephone}
              href={`tel:${profileData.telephone}`}
            />
          </div>
        </div>

        {/* Representative Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <User className="h-4 w-4 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Admission Representative</h3>
          </div>
          <div className="p-5 divide-y divide-gray-100">
            <InfoRow
              icon={<User className="h-4 w-4 text-purple-600" />}
              label={t("representative")}
              value={profileData.representativeName}
            />
            <InfoRow
              icon={<AtSign className="h-4 w-4 text-purple-600" />}
              label={t("representativeEmail")}
              value={profileData.representativeEmail}
              isLink={!!profileData.representativeEmail}
              href={`mailto:${profileData.representativeEmail}`}
            />
          </div>
        </div>

        {/* Accreditation Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <Award className="h-4 w-4 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">{t("accreditation")}</h3>
          </div>
          <div className="p-5 divide-y divide-gray-100">
            <InfoRow
              icon={<Award className="h-4 w-4 text-purple-600" />}
              label={t("accreditationNumber")}
              value={profileData.accreditationNumber}
            />
            <div className="flex items-start gap-4 py-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                <FileText className="h-4 w-4 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
                  {t("document")}
                </p>
                <button
                  onClick={handleFetchAccreditationUrl}
                  disabled={docLoading}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium text-sm rounded-lg transition-colors disabled:opacity-50"
                >
                  {docLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {tCommon("loading")}
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4" />
                      {t("viewDocument")}
                      <ExternalLink className="h-3 w-3" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={profileData}
        onSave={handleSave}
      />
    </div>
  );
}
