"use client"

import { useState } from "react"
import { CandidatesTable } from "./candidates-table"
import { CandidateViewModal } from "./candidate-view-modal"
import { CandidateEditModal } from "./candidate-edit-modal"
import { useToast } from "@/hooks/use-toast"
import type { Candidate } from "@/types/candidate"
import { CandidateStatus } from "@/types/candidate"

export function CandidatesSection() {
  const { toast } = useToast()
  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: "cand-1",
      fullName: "John Smith",
      faculty: "Computer Science",
      appliedDate: "2023-05-15",
      status: CandidateStatus.DOCUMENT_SUBMITTED,
      email: "john.smith@example.com",
      phone: "+1 123-456-7890",
      country: "United States",
      program: "Master of Science in Data Science",
      documents: {
        diploma: true,
        passport: true,
        transcript: true,
        motivationLetter: false,
      },
      notes: "Strong academic background in computer science.",
    },
    {
      id: "cand-2",
      fullName: "Emma Johnson",
      faculty: "Business",
      appliedDate: "2023-06-02",
      status: CandidateStatus.ACCEPTED,
      email: "emma.johnson@example.com",
      phone: "+44 20 1234 5678",
      country: "United Kingdom",
      program: "Master of Business Administration",
      documents: {
        diploma: true,
        passport: true,
        transcript: true,
        motivationLetter: true,
      },
      notes: "Has 3 years of work experience in finance.",
    },
    {
      id: "cand-3",
      fullName: "Mohammed Al-Farsi",
      faculty: "Engineering",
      appliedDate: "2023-05-28",
      status: CandidateStatus.SENT_FOR_RESENDING,
      email: "mohammed.alfarsi@example.com",
      phone: "+966 50 123 4567",
      country: "Saudi Arabia",
      program: "Bachelor of Engineering",
      documents: {
        diploma: false,
        passport: true,
        transcript: true,
        motivationLetter: true,
      },
      notes: "Missing original diploma, requested to resend.",
    },
    {
      id: "cand-4",
      fullName: "Yuki Tanaka",
      faculty: "Medicine",
      appliedDate: "2023-06-10",
      status: CandidateStatus.DOCUMENT_SAVED,
      email: "yuki.tanaka@example.com",
      phone: "+81 3 1234 5678",
      country: "Japan",
      program: "Medicine",
      documents: {
        diploma: true,
        passport: true,
        transcript: true,
        motivationLetter: true,
      },
      notes: "Excellent academic record, graduated top of class.",
    },
    {
      id: "cand-5",
      fullName: "Elena Petrova",
      faculty: "Arts",
      appliedDate: "2023-05-20",
      status: CandidateStatus.VISA_TAKEN,
      email: "elena.petrova@example.com",
      phone: "+7 495 123-45-67",
      country: "Russia",
      program: "English Literature",
      documents: {
        diploma: true,
        passport: true,
        transcript: true,
        motivationLetter: true,
      },
      notes: "Visa approved on June 15, 2023.",
    },
  ])

  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<CandidateStatus | "">("")
  const [facultyFilter, setFacultyFilter] = useState("")

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch = candidate.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "" || candidate.status === statusFilter
    const matchesFaculty = facultyFilter === "" || candidate.faculty === facultyFilter

    return matchesSearch && matchesStatus && matchesFaculty
  })

  const handleViewCandidate = (candidate: Candidate) => {
    setCurrentCandidate(candidate)
    setIsViewModalOpen(true)
  }

  const handleEditCandidate = (candidate: Candidate) => {
    setCurrentCandidate(candidate)
    setIsEditModalOpen(true)
  }

  const handleUpdateCandidate = (updatedCandidate: Candidate) => {
    setCandidates(candidates.map((c) => (c.id === updatedCandidate.id ? updatedCandidate : c)))
    setIsEditModalOpen(false)

    toast({
      title: "Candidate updated",
      description: `${updatedCandidate.fullName}'s information has been updated.`,
      variant: "success",
    })
  }

  const handleStatusChange = (candidateId: string, newStatus: CandidateStatus) => {
    setCandidates(
      candidates.map((c) => {
        if (c.id === candidateId) {
          return { ...c, status: newStatus }
        }
        return c
      }),
    )

    toast({
      title: "Status updated",
      description: `Candidate status has been changed to ${newStatus}.`,
      variant: "success",
    })
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-purple-900">Candidates</h2>
      </div>

      <CandidatesTable
        candidates={filteredCandidates}
        onView={handleViewCandidate}
        onEdit={handleEditCandidate}
        onStatusChange={handleStatusChange}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        facultyFilter={facultyFilter}
        onFacultyFilterChange={setFacultyFilter}
      />

      {/* View Candidate Modal */}
      {currentCandidate && (
        <CandidateViewModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          candidate={currentCandidate}
          onEdit={() => {
            setIsViewModalOpen(false)
            setIsEditModalOpen(true)
          }}
        />
      )}

      {/* Edit Candidate Modal */}
      {currentCandidate && (
        <CandidateEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          initialData={currentCandidate}
          onSave={handleUpdateCandidate}
        />
      )}
    </>
  )
}