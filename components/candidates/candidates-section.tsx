"use client"

import { useState, useEffect } from "react"
import { CandidatesTable } from "./candidates-table"
import { CandidateViewModal } from "./candidate-view-modal"
import { CandidateEditModal } from "./candidate-edit-modal"
import { useToast } from "@/hooks/use-toast"
import type { Candidate } from "@/types/candidate"
import { CandidateStatus } from "@/types/candidate"
import { fetchWithAuth, API_BASE } from "@/lib/fetchWithAuth"

// Map backend status to frontend CandidateStatus
function mapStatus(status: string): CandidateStatus {
  const statusMap: Record<string, CandidateStatus> = {
    "document_saved": CandidateStatus.DOCUMENT_SAVED,
    "submitted": CandidateStatus.DOCUMENT_SUBMITTED,
    "under_review": CandidateStatus.DOCUMENT_SUBMITTED,
    "resend": CandidateStatus.SENT_FOR_RESENDING,
    "interview": CandidateStatus.DOCUMENT_SUBMITTED,
    "accepted": CandidateStatus.ACCEPTED,
    "confirmed": CandidateStatus.ACCEPTED,
    "visa_taken": CandidateStatus.VISA_TAKEN,
    "studying": CandidateStatus.STUDYING,
    "rejected": CandidateStatus.REJECTED,
    "waitlisted": CandidateStatus.DOCUMENT_SUBMITTED,
  }
  return statusMap[status?.toLowerCase()] || CandidateStatus.DOCUMENT_SUBMITTED
}

export function CandidatesSection() {
  const { toast } = useToast()
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)

  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<CandidateStatus | "">("")
  const [facultyFilter, setFacultyFilter] = useState("")

  // Fetch candidates from API
  useEffect(() => {
    const fetchCandidates = async () => {
      // Check for authentication
      const token = localStorage.getItem("accessToken")
      if (!token) {
        setLoading(false)
        toast({
          title: "Not authenticated",
          description: "Please login to view candidates",
          variant: "destructive",
        })
        return
      }

      try {
        setLoading(true)
        const res = await fetchWithAuth(`${API_BASE}/api/applications/candidates/`)

        if (res.status === 401) {
          toast({
            title: "Session expired",
            description: "Please login again",
            variant: "destructive",
          })
          setLoading(false)
          return
        }

        if (!res.ok) throw new Error("Failed to fetch candidates")

        const data = await res.json()
        const results = data.results || data || []

        // Map API response to Candidate type
        const mapped: Candidate[] = results.map((item: any) => ({
          id: String(item.id),
          fullName: item.applicant_full_name || "Unknown",
          faculty: item.programme_name?.split(" - ")[0] || "N/A",
          appliedDate: item.applied_date?.split("T")[0] || "",
          status: mapStatus(item.status),
          email: item.applicant_email || "",
          phone: "",
          country: "",
          program: item.programme_name || "",
          documents: {
            passport: true,
            diploma: true,
            transcript: true,
            motivationLetter: true,
          },
          notes: item.remarks || "",
        }))

        setCandidates(mapped)
      } catch (err) {
        console.error("Error fetching candidates:", err)
        toast({
          title: "Error",
          description: "Failed to load candidates. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCandidates()
  }, [])

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Loading candidates...</p>
      </div>
    )
  }

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-purple-900">Candidates</h2>
            <p className="text-gray-500 mt-1">Manage and review student applications</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg">
              <span className="font-semibold text-lg">{candidates.length}</span>
              <span className="ml-1 text-sm">Total Applications</span>
            </div>
          </div>
        </div>
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