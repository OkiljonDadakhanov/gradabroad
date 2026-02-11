"use client";

import { useEffect, useState } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { InfoCard } from "@/components/ui/info-card";
import { CampusAddModal } from "./CampusAddModal";
import { CampusEditModal } from "./campus-edit-modal";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { CampusInfoData } from "@/types/profile";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { useTranslations } from "@/lib/i18n";

export function CampusInfoSection() {
  const t = useTranslations("campus");
  const tCommon = useTranslations("common");
  const [campusData, setCampusData] = useState<CampusInfoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchCampusData = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetchWithAuth(
        "/api/information-about-campus/"
      );

      if (res.status === 404) {
        setCampusData(null);
      } else if (!res.ok) {
        throw new Error("Failed to fetch campus information");
      } else {
        const data = await res.json();
        setCampusData({
          id: data.id,
          yearOfEstablishment: String(data.year_established || ""),
          numberOfGraduates: String(data.graduates_total || ""),
          proportionOfEmployedGraduates: String(data.graduates_employed || ""),
          rankingWithinCountry: String(data.ranking_local ?? ""), // Accepts both number & string
          globalRankingPosition: String(data.ranking_global ?? ""), // Same here
          hasDormitories: data.dormitory_available === "Yes",
          dormitoryFeeRangeMin:
            data.dormitory_fee?.split(" - ")[0]?.trim() || "",
          dormitoryFeeRangeMax:
            data.dormitory_fee?.split(" - ")[1]?.replace("USD", "").trim() ||
            "",
          aboutUniversity: {
            english: data.description || "",
          },
        });
      }
    } catch (err) {
      toast.error("Something went wrong while fetching campus info.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampusData();
  }, []);

  const saveCampusData = async (newData: CampusInfoData, isEdit = false) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const payload = {
      year_established: newData.yearOfEstablishment,
      graduates_total: newData.numberOfGraduates,
      graduates_employed: newData.proportionOfEmployedGraduates,
      ranking_local: newData.rankingWithinCountry,
      ranking_global: newData.globalRankingPosition,
      dormitory_fee: `${newData.dormitoryFeeRangeMin} - ${newData.dormitoryFeeRangeMax} USD`,
      dormitory_available: newData.hasDormitories ? "Yes" : null,
      description: newData.aboutUniversity.english,
    };

    try {
      const res = await fetchWithAuth(
        "/api/information-about-campus/",
        {
          method: isEdit ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
        
      );

      if (!res.ok) {
        const result = await res.json();
        toast.error(result.detail || "Failed to save campus data.");
        return;
      }

      toast.success(t("campusSaved"));
      await fetchCampusData();
    } catch (err) {
      toast.error("Unexpected error occurred.");
      console.error(err);
    }
  };

  return (
    <>
      <SectionHeader title={t("title")} />

      {loading ? (
        <div className="text-center text-sm text-gray-500">{tCommon("loading")}</div>
      ) : campusData ? (
        <>
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <p className="text-sm text-gray-500">{t("yearOfEstablishment")}</p>
                <p className="text-base font-medium text-gray-900">
                  {campusData.yearOfEstablishment}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t("numberOfGraduates")}</p>
                <p className="text-base font-medium text-gray-900">
                  {campusData.numberOfGraduates}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t("employedGraduates")}</p>
                <p className="text-base font-medium text-gray-900">
                  {campusData.proportionOfEmployedGraduates}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t("rankingLocal")}</p>
                <p className="text-base font-medium text-gray-900">
                  {campusData.rankingWithinCountry}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t("rankingGlobal")}</p>
                <p className="text-base font-medium text-gray-900">
                  {campusData.globalRankingPosition}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t("dormitory")}</p>
                <p className="text-base font-medium text-gray-900">
                  {campusData.hasDormitories ? tCommon("yes") : tCommon("no")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t("dormitoryFee")}</p>
                <p className="text-base font-medium text-gray-900">
                  {campusData.dormitoryFeeRangeMin} -{" "}
                  {campusData.dormitoryFeeRangeMax} USD
                </p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-sm text-gray-500">{t("aboutUniversity")}</p>
                <p className="text-base font-medium text-gray-900 whitespace-pre-line">
                  {campusData.aboutUniversity.english}
                </p>
              </div>
            </div>
          </div>

          <div className="text-right mt-4">
            <Button onClick={() => setIsEditModalOpen(true)}>{tCommon("edit")}</Button>
          </div>
        </>
      ) : (
        <div className="text-center mt-6">
          <p className="text-gray-600 mb-4">{t("noCampusInfo")}</p>
          <Button onClick={() => setIsAddModalOpen(true)}>
            {t("addInformation")}
          </Button>
        </div>
      )}

      <CampusAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={async (data) => {
          await saveCampusData(data, false);
          setIsAddModalOpen(false); // Close only after save & re-fetch
        }}
      />

      {campusData && (
        <CampusEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          initialData={campusData}
          onSuccess={(data) => {
            setCampusData(data);
            setIsEditModalOpen(false);
          }}
        />
      )}
    </>
  );
}
