"use client"

import { useState } from "react"
import { Plus, Eye, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AcademicProgramModal } from "./academic-program-modal"
import { AcademicProgramViewModal } from "./academic-program-view-modal"
import { AcademicProgramDeleteDialog } from "./academic-program-delete-dialog"
import { useToast } from "@/hooks/use-toast"
import type { AcademicProgram } from "@/types/academic"
import { generateId } from "@/lib/utils"

export function AcademicProgramsSection() {
  const { toast } = useToast()
  const [programs, setPrograms] = useState<AcademicProgram[]>([
    {
      id: "prog-1",
      name: "English literature",
      category: "Languages",
      degreeType: "Bachelor",
      languageRequirement: "English",
      contractPrice: "3000",
      admissionStart: "01/04/2025",
      admissionEnd: "30/04/2025",
      documentTypes: ["Passport", "Diploma", "Transcript"],
      description: {
        english:
          "The English Literature program offers a comprehensive study of literary works from various periods and genres. Students will develop critical thinking and analytical skills through the examination of texts from different cultural and historical contexts.",
        korean: "",
        russian: "",
        uzbek: "",
      },
    },
    {
      id: "prog-2",
      name: "Data science",
      category: "Computer Science",
      degreeType: "Master",
      languageRequirement: "English",
      contractPrice: "4500",
      admissionStart: "15/03/2025",
      admissionEnd: "15/05/2025",
      documentTypes: ["Passport", "Diploma", "CV"],
      description: {
        english:
          "The Data Science program focuses on developing skills in statistical analysis, machine learning, and data visualization. Students will learn to extract insights from complex datasets and apply these skills to real-world problems.",
        korean: "",
        russian: "",
        uzbek: "",
      },
    },
    {
      id: "prog-3",
      name: "Software Engineering",
      category: "Computer Science",
      degreeType: "Bachelor",
      languageRequirement: "English",
      contractPrice: "3500",
      admissionStart: "01/05/2025",
      admissionEnd: "30/06/2025",
      documentTypes: ["Passport", "Transcript", "Motivation Letter"],
      description: {
        english:
          "The Software Engineering program provides students with the knowledge and skills needed to design, develop, and maintain software systems. The curriculum covers programming, software architecture, and project management.",
        korean: "",
        russian: "",
        uzbek: "",
      },
    },
  ])

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentProgram, setCurrentProgram] = useState<AcademicProgram | null>(null)

  const handleAddProgram = (program: Omit<AcademicProgram, "id">) => {
    const newProgram = {
      ...program,
      id: generateId(),
    }

    setPrograms([...programs, newProgram])
    setIsAddModalOpen(false)

    toast({
      title: "Program added",
      description: `${program.name} has been successfully added.`,
      variant: "success",
    })
  }

  const handleEditProgram = (program: AcademicProgram) => {
    setPrograms(programs.map((p) => (p.id === program.id ? program : p)))
    setIsEditModalOpen(false)

    toast({
      title: "Program updated",
      description: `${program.name} has been successfully updated.`,
      variant: "success",
    })
  }

  const handleDeleteProgram = () => {
    if (currentProgram) {
      setPrograms(programs.filter((p) => p.id !== currentProgram.id))
      setIsDeleteDialogOpen(false)

      toast({
        title: "Program deleted",
        description: `${currentProgram.name} has been successfully deleted.`,
        variant: "success",
      })

      setCurrentProgram(null)
    }
  }

  const handleViewProgram = (program: AcademicProgram) => {
    setCurrentProgram(program)
    setIsViewModalOpen(true)
  }

  const handleOpenEditModal = (program: AcademicProgram) => {
    setCurrentProgram(program)
    setIsEditModalOpen(true)
  }

  const handleOpenDeleteDialog = (program: AcademicProgram) => {
    setCurrentProgram(program)
    setIsDeleteDialogOpen(true)
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-purple-900">Academic programs</h2>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-purple-900 hover:bg-purple-800">
          <Plus className="mr-2 h-4 w-4" /> Add
        </Button>
      </div>

      <div className="space-y-4">
        {programs.map((program) => (
          <div key={program.id} className="bg-purple-50 p-4 rounded-md flex justify-between items-center">
            <span className="font-medium text-purple-900">{program.name}</span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="bg-purple-200 hover:bg-purple-300"
                onClick={() => handleViewProgram(program)}
              >
                <Eye className="h-5 w-5 text-purple-700" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="bg-purple-200 hover:bg-purple-300"
                onClick={() => handleOpenEditModal(program)}
              >
                <Pencil className="h-5 w-5 text-purple-700" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="bg-purple-200 hover:bg-purple-300"
                onClick={() => handleOpenDeleteDialog(program)}
              >
                <Trash2 className="h-5 w-5 text-purple-700" />
              </Button>
            </div>
          </div>
        ))}

        {programs.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No academic programs found. Click the Add button to create one.
          </div>
        )}
      </div>

      {/* Add Program Modal */}
      <AcademicProgramModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddProgram}
        title="Add Academic Program"
      />

      {/* Edit Program Modal */}
      {currentProgram && (
        <AcademicProgramModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleEditProgram}
          initialData={currentProgram}
          title="Edit Academic Program"
        />
      )}

      {/* View Program Modal */}
      {currentProgram && (
        <AcademicProgramViewModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          program={currentProgram}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {currentProgram && (
        <AcademicProgramDeleteDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteProgram}
          programName={currentProgram.name}
        />
      )}
    </>
  )
}

