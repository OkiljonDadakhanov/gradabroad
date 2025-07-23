"use client";

import { useEffect, useState } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { InfoCard } from "@/components/ui/info-card";
import { Card } from "@/components/ui/card";
import { CampusEditModal } from "./campus-edit-modal";
import { CampusAddModal } from "./CampusAddModal";
import type { CampusInfoData } from "@/types/profile";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

export function CampusInfoSection() {
  const [universityId, setUniversityId] = useState<number | null>(null);
  const [campusData, setCampusData] = useState<CampusInfoData | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedId = localStorage.getItem("universityId");
    if (storedId) {
      setUniversityId(Number(storedId));
    } else {
      setError("University ID not found in localStorage.");
      setLoading(false);
    }
  }, []);

  const fetchCampusData = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://api.gradabroad.net/api/information-about-campus/?university_id=${id}`
      );
      if (!res.ok) throw new Error("Failed to fetch campus information");

      const data = await res.json();
      if (!data || Object.keys(data).length === 0) {
        setCampusData(null);
        return;
      }

      const transformedData: CampusInfoData = {
        id: data.id,
        yearOfEstablishment: String(data.year_established ?? ""),
        numberOfGraduates: String(data.graduates_total ?? ""),
        proportionOfEmployedGraduates: String(data.graduates_employed ?? ""),
        rankingWithinCountry: String(data.ranking_local ?? ""),
        globalRankingPosition: String(data.ranking_global ?? ""),
        hasDormitories: !!data.dormitory_available,
        dormitoryFeeRangeMin: data.dormitory_info?.split(" - ")[0] ?? "",
        dormitoryFeeRangeMax: data.dormitory_info?.split(" - ")[1] ?? "",
        aboutUniversity: {
          english: data.description ?? "",
        },
      };

      setCampusData(transformedData);
    } catch (err: any) {
      setError(err.message || "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (universityId !== null) {
      fetchCampusData(universityId);
    }
  }, [universityId]);

  const handleEditClick = () => setIsEditModalOpen(true);

  const handleEditSave = async (updatedData: CampusInfoData) => {
    if (!universityId) return;

    const payload = {
      id: updatedData.id,
      university_id: universityId,
      year_established: Number(updatedData.yearOfEstablishment),
      graduates_total: Number(updatedData.numberOfGraduates),
      graduates_employed: Number(updatedData.proportionOfEmployedGraduates),
      ranking_local: Number(updatedData.rankingWithinCountry),
      ranking_global: Number(updatedData.globalRankingPosition),
      dormitory_info: `${updatedData.dormitoryFeeRangeMin} - ${updatedData.dormitoryFeeRangeMax}`,
      description: updatedData.aboutUniversity.english,
    };

    await fetch("https://api.gradabroad.net/api/information-about-campus/", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    await fetchCampusData(universityId);
    setIsEditModalOpen(false);
  };

  const handleAddSave = async (newData: CampusInfoData) => {
    if (!universityId) return;

    const payload = {
      university_id: universityId,
      year_established: Number(newData.yearOfEstablishment),
      graduates_total: Number(newData.numberOfGraduates),
      graduates_employed: Number(newData.proportionOfEmployedGraduates),
      ranking_local: Number(newData.rankingWithinCountry),
      ranking_global: Number(newData.globalRankingPosition),
      dormitory_info: `${newData.dormitoryFeeRangeMin} - ${newData.dormitoryFeeRangeMax}`,
      description: newData.aboutUniversity.english,
    };

    await fetch("https://api.gradabroad.net/api/information-about-campus/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    await fetchCampusData(universityId);
    setIsAddModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40 text-gray-600">
        <Loader className="animate-spin mr-2" /> Loading campus information...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">Error: {error}</div>;
  }

  return (
    <>
      <SectionHeader
        title="Information about campus"
        onEdit={campusData ? handleEditClick : undefined}
      />

      {!campusData ? (
        <div className="text-center mt-6">
          <p className="text-gray-600 mb-4">No campus information available.</p>
          <Button onClick={() => setIsAddModalOpen(true)}>
            Add Information
          </Button>
        </div>
      ) : (
        <>
          <InfoCard
            items={[
              {
                label: "Year of establishment",
                value: campusData.yearOfEstablishment,
                highlight: true,
              },
              {
                label: "Number of graduates",
                value: campusData.numberOfGraduates,
              },
              {
                label: "Proportion of employed graduates",
                value: campusData.proportionOfEmployedGraduates,
              },
            ]}
          />
          <InfoCard
            items={[
              {
                label: "Ranking within the country",
                value: campusData.rankingWithinCountry,
                highlight: true,
              },
              {
                label: "Global ranking position",
                value: campusData.globalRankingPosition,
              },
              {
                label: "Does the university have dormitories",
                value: campusData.hasDormitories ? "Yes" : "No",
              },
            ]}
          />
          <InfoCard
            items={[
              {
                label: "Dormitory fee range",
                value: `${campusData.dormitoryFeeRangeMin} - ${campusData.dormitoryFeeRangeMax}`,
              },
            ]}
          />
          <Card className="overflow-hidden">
            <h3 className="">About the university</h3>
            <div className="p-4">
              <div className="prose max-w-none">
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      campusData.aboutUniversity?.english?.replace(
                        /\n/g,
                        "<br/>"
                      ) || "",
                  }}
                />
              </div>
            </div>
          </Card>
        </>
      )}

      {campusData && (
        <CampusEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          initialData={campusData}
          onSave={handleEditSave}
        />
      )}

      {!campusData && (
        <CampusAddModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddSave}
        />
      )}
    </>
  );
}
