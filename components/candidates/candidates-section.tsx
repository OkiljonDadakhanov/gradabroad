"use client"

import { useState, useEffect } from "react"
import { CandidatesTable } from "./candidates-table"
import { CandidateViewModal } from "./candidate-view-modal"
import { fetchWithAuth } from "@/lib/fetchWithAuth"
import { ENDPOINTS } from "@/lib/constants"
import { useTranslations } from "@/lib/i18n"
import type { CandidateListItem } from "@/types/candidate"

export function CandidatesSection() {
  const t = useTranslations("candidates")
  const [candidates, setCandidates] = useState<CandidateListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    fetchCandidates()
  }, [])

  const fetchCandidates = async () => {
    try {
      setLoading(true)
      const response = await fetchWithAuth(ENDPOINTS.CANDIDATES)
      if (response.ok) {
        const data = await response.json()
        // Handle paginated response
        const results = data.results || data
        setCandidates(Array.isArray(results) ? results : [])
      }
    } catch (error) {
      console.error("Failed to fetch candidates:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch = candidate.applicant_full_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || candidate.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleViewCandidate = (candidate: CandidateListItem) => {
    setSelectedCandidateId(candidate.id)
    setIsViewModalOpen(true)
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-purple-900 dark:text-purple-300">{t("title")}</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">{t("viewApplications")}</p>
      </div>

      <CandidatesTable
        candidates={filteredCandidates}
        onView={handleViewCandidate}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        loading={loading}
      />

      {selectedCandidateId && (
        <CandidateViewModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false)
            setSelectedCandidateId(null)
          }}
          candidateId={selectedCandidateId}
          onStatusUpdated={fetchCandidates}
        />
      )}
    </>
  )
}
