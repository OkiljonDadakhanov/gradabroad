"use client";

import { useEffect, useState } from "react";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AcademicProgramViewModal } from "./academic-program-view-modal";
import { AcademicProgramDeleteDialog } from "./academic-program-delete-dialog";
import { AcademicProgramModal } from "./academic-program-modal"; // For adding
import { AcademicProgramEditModal } from "./academic-program-edit-modal"; // For editing
import { generateId } from "@/lib/utils";
import type { AcademicProgram } from "@/types/academic";

export function AcademicProgramsSection() {
  const { toast } = useToast();

  const [programs, setPrograms] = useState<AcademicProgram[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProgram, setCurrentProgram] = useState<AcademicProgram | null>(
    null
  );

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetch(
        "https://api.gradabroad.net/api/programmes/mine/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        console.error("Failed to fetch programs");
        return;
      }

      const data = await res.json();

      const mapped = data.map((p: any) => {
        const languageRequirement = (p.requirements || [])
          .filter(
            (r: any) =>
              r.requirementType === "english" ||
              r.requirementType === "language"
          )
          .map((r: any) => ({
            name: r.label,
            requirement: String(r.min_score ?? ""),
          }));

        const documentTypes = (p.requirements || [])
          .filter((r: any) => r.requirementType === "document")
          .map((r: any) => r.label);

        return {
          id: `api-${p.id}`,
          name: p.name || p.major || "Unnamed",
          category: p.field_of_study || p.code || "",
          degreeType: p.degreeType || p.degree_level || "",
          languageRequirement,
          documentTypes,
          contractPrice: p.contractPrice || p.tuition_fee || "",
          platformApplicationFee: p.platformApplicationFee || "0.00",
          admissionStart: p.start_date || "",
          admissionEnd: p.end_date || "",
          description: {
            english: p.about_program || "",
            uzbek: "",
            russian: "",
            korean: "",
          },
          active: p.active ?? true,
        };
      });

      setPrograms(mapped);
    } catch (err) {
      console.error("Program fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProgram = async () => {
    if (!currentProgram) return;
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const numericId = currentProgram.id.replace("api-", "");

    try {
      const res = await fetch(
        `https://api.gradabroad.net/api/programmes/with-requirements/${numericId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        toast({
          title: "Error",
          description: `Failed to delete "${currentProgram.name}"`,
          variant: "destructive",
        });
        return;
      }

      setPrograms((prev) => prev.filter((p) => p.id !== currentProgram.id));
      toast({
        title: "Program deleted",
        description: `${currentProgram.name} was deleted successfully.`,
        variant: "success",
      });
    } catch (err) {
      console.error("Delete error:", err);
      toast({
        title: "Error",
        description: `Error deleting "${currentProgram.name}"`,
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setCurrentProgram(null);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-purple-900">
          Academic programs
        </h2>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-purple-900 hover:bg-purple-800 text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> Add
        </Button>
      </div>

      <div className="space-y-4">
        {!loading && programs.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">SOON</div>
        )}

        {programs.map((program) => (
          <div
            key={program.id}
            className="bg-purple-50 p-4 rounded-md flex justify-between items-center"
          >
            <span className="font-medium text-purple-900">{program.name}</span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="bg-purple-200 hover:bg-purple-300"
                onClick={() => {
                  setCurrentProgram(program);
                  setIsViewModalOpen(true);
                }}
              >
                <Eye className="h-5 w-5 text-purple-700" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="bg-purple-200 hover:bg-purple-300"
                onClick={() => {
                  setCurrentProgram(program);
                  setIsEditModalOpen(true);
                }}
              >
                <Pencil className="h-5 w-5 text-purple-700" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="bg-purple-200 hover:bg-purple-300"
                onClick={() => {
                  setCurrentProgram(program);
                  setIsDeleteDialogOpen(true);
                }}
              >
                <Trash2 className="h-5 w-5 text-purple-700" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD MODAL */}
      <AcademicProgramModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={() => {
          setIsAddModalOpen(false);
          fetchPrograms();
        }}
        title="Add Academic Program"
      />

      {/* EDIT MODAL */}
      {currentProgram && (
        <AcademicProgramEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          initialData={currentProgram}
          onSuccess={fetchPrograms}
        />
      )}

      {/* VIEW MODAL */}
      {currentProgram && (
        <AcademicProgramViewModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          program={currentProgram}
        />
      )}

      {/* DELETE DIALOG */}
      {currentProgram && (
        <AcademicProgramDeleteDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteProgram}
          programName={currentProgram.name}
        />
      )}
    </>
  );
}
