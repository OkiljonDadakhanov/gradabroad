"use client"

import { useState } from "react"
import { Plus, Eye, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScholarshipModal } from "./scholarship-modal"
import { ScholarshipViewModal } from "./scholarship-view-modal"
import { ScholarshipDeleteDialog } from "./scholarship-delete-dialog"
import { useToast } from "@/hooks/use-toast"
import type { Scholarship } from "@/types/scholarship"
import { generateId } from "@/lib/utils"

export function ScholarshipsSection() {
  const { toast } = useToast()
  const [scholarships, setScholarships] = useState<Scholarship[]>([
    {
      id: "schol-1",
      degreeType: "Bachelor",
      academicProgram: "English Literature",
      description: {
        english: `There are five types of funding:

1. Merit based scholarship - merit based scholarships are given on a competition basis for local students who get high scores in the entrance examination. This scholarship is given for owing to each academic program for 1 year ONLY (for 1st year) according to the following scheme.

Merit Scholarship | Percentage
-----------------|------------
Top 10% of the announced quota | 100% scholarship
The following 10% of the announced quota | 70% scholarship
The following 15% of the announced quota | 50% scholarship`,
        korean: "",
        russian: "",
        uzbek: "",
      },
    },
    {
      id: "schol-2",
      degreeType: "Master",
      academicProgram: "Data Science",
      description: {
        english: `Research Scholarship - Available for Master's students who demonstrate exceptional research potential. Covers 75% of tuition fees and includes a monthly stipend for living expenses. Recipients are expected to assist with departmental research projects for 10 hours per week.`,
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
  const [currentScholarship, setCurrentScholarship] = useState<Scholarship | null>(null)

  const handleAddScholarship = (scholarship: Omit<Scholarship, "id">) => {
    const newScholarship = {
      ...scholarship,
      id: generateId(),
    }

    setScholarships([...scholarships, newScholarship])
    setIsAddModalOpen(false)

    toast({
      title: "Scholarship added",
      description: `${scholarship.degreeType} scholarship has been successfully added.`,
      variant: "success",
    })
  }

  const handleEditScholarship = (scholarship: Scholarship) => {
    setScholarships(scholarships.map((s) => (s.id === scholarship.id ? scholarship : s)))
    setIsEditModalOpen(false)

    toast({
      title: "Scholarship updated",
      description: `${scholarship.degreeType} scholarship has been successfully updated.`,
      variant: "success",
    })
  }

  const handleDeleteScholarship = () => {
    if (currentScholarship) {
      setScholarships(scholarships.filter((s) => s.id !== currentScholarship.id))
      setIsDeleteDialogOpen(false)

      toast({
        title: "Scholarship deleted",
        description: `${currentScholarship.degreeType} scholarship has been successfully deleted.`,
        variant: "success",
      })

      setCurrentScholarship(null)
    }
  }

  const handleViewScholarship = (scholarship: Scholarship) => {
    setCurrentScholarship(scholarship)
    setIsViewModalOpen(true)
  }

  const handleOpenEditModal = (scholarship: Scholarship) => {
    setCurrentScholarship(scholarship)
    setIsEditModalOpen(true)
  }

  const handleOpenDeleteDialog = (scholarship: Scholarship) => {
    setCurrentScholarship(scholarship)
    setIsDeleteDialogOpen(true)
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-purple-900">Scholarships</h2>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-purple-900 hover:bg-purple-800">
          <Plus className="mr-2 h-4 w-4" /> Add
        </Button>
      </div>

      <div className="space-y-4">
        {scholarships.map((scholarship) => (
          <div key={scholarship.id} className="bg-purple-50 p-4 rounded-md flex justify-between items-center">
            <span className="font-medium text-purple-900">
              {scholarship.degreeType} - {scholarship.academicProgram || "-"}
            </span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="bg-purple-200 hover:bg-purple-300"
                onClick={() => handleViewScholarship(scholarship)}
              >
                <Eye className="h-5 w-5 text-purple-700" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="bg-purple-200 hover:bg-purple-300"
                onClick={() => handleOpenEditModal(scholarship)}
              >
                <Pencil className="h-5 w-5 text-purple-700" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="bg-purple-200 hover:bg-purple-300"
                onClick={() => handleOpenDeleteDialog(scholarship)}
              >
                <Trash2 className="h-5 w-5 text-purple-700" />
              </Button>
            </div>
          </div>
        ))}

        {scholarships.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No scholarships found. Click the Add button to create one.
          </div>
        )}
      </div>

      {/* Add Scholarship Modal */}
      <ScholarshipModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddScholarship}
        title="Add Scholarship"
      />

      {/* Edit Scholarship Modal */}
      {currentScholarship && (
        <ScholarshipModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleEditScholarship}
          initialData={currentScholarship}
          title="Edit Scholarship"
        />
      )}

      {/* View Scholarship Modal */}
      {currentScholarship && (
        <ScholarshipViewModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          scholarship={currentScholarship}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {currentScholarship && (
        <ScholarshipDeleteDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteScholarship}
          scholarshipType={currentScholarship.degreeType}
        />
      )}
    </>
  )
}

