"use client";

import { useEffect, useState } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { InfoCard } from "@/components/ui/info-card";
import { CampusAddModal } from "./CampusAddModal";
import { CampusEditModal } from "./campus-edit-modal";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { CampusInfoData } from "@/types/profile";

export function CampusInfoSection() {
  const [campusData, setCampusData] = useState<CampusInfoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchCampusData = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetch(
        "https://api.gradabroad.net/api/information-about-campus/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
          rankingWithinCountry: String(data.ranking_local || ""),
          globalRankingPosition: String(data.ranking_global || ""),
          hasDormitories: data.dormitory_available === "Yes",
          dormitoryFeeRangeMin:
            data.dormitory_info?.split(" - ")[0]?.trim() || "",
          dormitoryFeeRangeMax:
            data.dormitory_info?.split(" - ")[1]?.replace("USD", "").trim() ||
            "",
          aboutUniversity: {
            english: data.description || "",
          },
        });
      }
    } catch (err: any) {
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
      year_established: Number(newData.yearOfEstablishment),
      graduates_total: Number(newData.numberOfGraduates),
      graduates_employed: Number(newData.proportionOfEmployedGraduates),
      ranking_local: Number(newData.rankingWithinCountry),
      ranking_global: Number(newData.globalRankingPosition),
      dormitory_info: `${newData.dormitoryFeeRangeMin} - ${newData.dormitoryFeeRangeMax} USD`,
      dormitory_available: newData.hasDormitories ? "Yes" : null,
      description: newData.aboutUniversity.english,
    };

    try {
      const res = await fetch(
        "https://api.gradabroad.net/api/information-about-campus/",
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

      toast.success("Campus information saved.");
      await fetchCampusData();
    } catch (err: any) {
      toast.error("Unexpected error occurred.");
      console.error(err);
    }
  };

  return (
    <>
      <SectionHeader title="Information about campus" />

      {loading ? (
        <div className="text-center text-sm text-gray-500">Loading...</div>
      ) : campusData ? (
        <>
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <p className="text-sm text-gray-500">Year of establishment</p>
                <p className="text-base font-medium text-gray-900">
                  {campusData.yearOfEstablishment}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Number of graduates</p>
                <p className="text-base font-medium text-gray-900">
                  {campusData.numberOfGraduates}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Employed graduates (%)</p>
                <p className="text-base font-medium text-gray-900">
                  {campusData.proportionOfEmployedGraduates}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ranking (Local)</p>
                <p className="text-base font-medium text-gray-900">
                  {campusData.rankingWithinCountry}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ranking (Global)</p>
                <p className="text-base font-medium text-gray-900">
                  {campusData.globalRankingPosition}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Dormitory?</p>
                <p className="text-base font-medium text-gray-900">
                  {campusData.hasDormitories ? "Yes" : "No"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Dormitory Fee</p>
                <p className="text-base font-medium text-gray-900">
                  {campusData.dormitoryFeeRangeMin} -{" "}
                  {campusData.dormitoryFeeRangeMax} USD
                </p>
              </div>
              
              <div className="sm:col-span-2">
                <p className="text-sm text-gray-500">About the university</p>
                <p className="text-base font-medium text-gray-900 whitespace-pre-line">
                  {campusData.aboutUniversity.english}
                </p>
              </div>
            </div>
          </div>

          <div className="text-right mt-4">
            <Button onClick={() => setIsEditModalOpen(true)}>Edit</Button>
          </div>
        </>
      ) : (
        <div className="text-center mt-6">
          <p className="text-gray-600 mb-4">No campus information found.</p>
          <Button onClick={() => setIsAddModalOpen(true)}>
            Add Information
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
