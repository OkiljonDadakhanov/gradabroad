"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ScholarshipModal } from "./scholarship-modal";
import { ScholarshipViewModal } from "./scholarship-view-modal";
import { ScholarshipDeleteDialog } from "./scholarship-delete-dialog";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { useTranslations } from "@/lib/i18n";
import type { Scholarship } from "@/types/scholarship";
import type { AcademicProgram } from "@/types/academic";

export function ScholarshipsSection() {
  const { toast } = useToast();
  const t = useTranslations("scholarships");
  const tCommon = useTranslations("common");
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [programs, setPrograms] = useState<AcademicProgram[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentScholarship, setCurrentScholarship] =
    useState<Scholarship | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    try {
      const resPrograms = await fetchWithAuth(
        "https://api.gradabroad.net/api/programmes/mine/"
      );
      const resScholarships = await fetchWithAuth(
        "https://api.gradabroad.net/api/scholarships/mine/"
      );

      if (!resPrograms.ok || !resScholarships.ok) {
        toast({
          title: "Fetch failed",
          description: "Could not load programs or scholarships.",
          variant: "destructive",
        });
        return;
      }

      const progData = await resPrograms.json();
      const scholData = await resScholarships.json();

      setPrograms(progData);
      setScholarships(scholData);
    } catch (err) {
      console.error("Data load failed", err);
    } finally {
      setLoading(false);
    }
  };

  const getProgramName = (id: number) =>
    programs.find((p) => p.id === id)?.name || "Unknown";

  const handleDeleteScholarship = async () => {
    if (!currentScholarship) return;

    try {
      const res = await fetchWithAuth(
        `https://api.gradabroad.net/api/scholarships/${currentScholarship.id}/`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Delete failed");

      setScholarships((prev) =>
        prev.filter((s) => s.id !== currentScholarship.id)
      );
      toast({ title: "Deleted", variant: "success" });
    } catch (err) {
      toast({
        title: "Delete failed",
        description: String(err),
        variant: "destructive",
      });
    } finally {
      setCurrentScholarship(null);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-purple-900">{t("title")}</h2>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-purple-900 text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> {tCommon("add")}
        </Button>
      </div>

      <div className="space-y-4">
        {!loading && scholarships.length === 0 && (
          <div className="text-gray-500 text-center">
            {t("noScholarships")}
          </div>
        )}

        {scholarships.map((sch) => (
          <div
            key={sch.id}
            className="bg-purple-50 p-4 rounded-md flex justify-between items-center cursor-pointer hover:bg-purple-100 transition-colors"
            onClick={() => {
              setCurrentScholarship(sch);
              setIsViewModalOpen(true);
            }}
          >
            <span className="text-purple-900 font-medium">
              {sch.name} — {getProgramName(sch.programme_id)}
            </span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="bg-purple-200"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentScholarship(sch);
                  setIsEditModalOpen(true);
                }}
              >
                <Pencil className="text-purple-700" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="bg-purple-200"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentScholarship(sch);
                  setIsDeleteDialogOpen(true);
                }}
              >
                <Trash2 className="text-purple-700" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <ScholarshipModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={(newSch) => {
          setScholarships([...scholarships, newSch]);
          setIsAddModalOpen(false);
        }}
        title={t("addScholarship")}
        programs={programs}
      />

      {currentScholarship && (
        <>
          <ScholarshipModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSave={(updated) => {
              setScholarships((prev) =>
                prev.map((s) => (s.id === updated.id ? updated : s))
              );
              setIsEditModalOpen(false);
            }}
            initialData={currentScholarship}
            title={t("editScholarship")}
            programs={programs}
          />
          <ScholarshipViewModal
            isOpen={isViewModalOpen}
            onClose={() => setIsViewModalOpen(false)}
            scholarship={currentScholarship}
            programName={getProgramName(currentScholarship.programme_id)}
          />
          <ScholarshipDeleteDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onConfirm={handleDeleteScholarship}
            scholarshipType={currentScholarship.name}
          />
        </>
      )}
    </>
  );
}
