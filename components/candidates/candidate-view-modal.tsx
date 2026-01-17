"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Mail, Calendar, GraduationCap, Loader2, ExternalLink } from "lucide-react"
import type { Candidate } from "@/types/candidate"
import { formatDate } from "@/lib/utils"
import { fetchWithAuth, API_BASE } from "@/lib/fetchWithAuth"

interface Attachment {
  id: number
  file_type: string
  signed_file_url: string
  uploaded_at: string
}

interface CandidateDetail {
  id: number
  applicant_full_name: string
  applicant_email: string
  programme_name: string
  status: string
  applied_date: string
  remarks: string
  attachments: Attachment[]
  application_documents: any[]
}

interface CandidateViewModalProps {
  isOpen: boolean
  onClose: () => void
  candidate: Candidate
  onEdit: () => void
}

const fileTypeLabels: Record<string, string> = {
  cv: "CV / Resume",
  transcript: "Transcript",
  recommendation_letter: "Recommendation Letter",
  motivation_letter: "Motivation Letter",
  passport: "Passport",
  diploma: "Diploma",
}

export function CandidateViewModal({ isOpen, onClose, candidate, onEdit }: CandidateViewModalProps) {
  const [details, setDetails] = useState<CandidateDetail | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && candidate.id) {
      fetchCandidateDetails()
    }
  }, [isOpen, candidate.id])

  const fetchCandidateDetails = async () => {
    setLoading(true)
    try {
      const res = await fetchWithAuth(`${API_BASE}/api/applications/candidates/${candidate.id}/`)
      if (res.ok) {
        const data = await res.json()
        setDetails(data)
      }
    } catch (err) {
      console.error("Failed to fetch candidate details:", err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase()
    if (s.includes("accepted") || s.includes("confirmed")) return "bg-green-100 text-green-800 border-green-200"
    if (s.includes("rejected")) return "bg-red-100 text-red-800 border-red-200"
    if (s.includes("resend")) return "bg-amber-100 text-amber-800 border-amber-200"
    if (s.includes("visa")) return "bg-blue-100 text-blue-800 border-blue-200"
    if (s.includes("studying")) return "bg-emerald-100 text-emerald-800 border-emerald-200"
    return "bg-gray-100 text-gray-800 border-gray-200"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                {(details?.applicant_full_name || candidate.fullName || "?").split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <span>{details?.applicant_full_name || candidate.fullName || "Applicant"}</span>
                <p className="text-sm font-normal text-gray-500">{details?.applicant_email || candidate.email}</p>
              </div>
            </div>
            <Badge className={`${getStatusColor(candidate.status)} border`}>{candidate.status}</Badge>
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        ) : (
          <div className="space-y-6 mt-4">
            {/* Application Info */}
            <Card className="p-4 border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-purple-600" />
                Application Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Program</p>
                  <p className="font-medium text-gray-900">{details?.programme_name || candidate.program}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Applied Date</p>
                  <p className="font-medium text-gray-900 flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {formatDate(details?.applied_date?.split("T")[0] || candidate.appliedDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900 flex items-center gap-1">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <a href={`mailto:${details?.applicant_email || candidate.email}`} className="text-purple-600 hover:underline">
                      {details?.applicant_email || candidate.email}
                    </a>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge className={`${getStatusColor(details?.status || candidate.status)} border mt-1`}>
                    {details?.status || candidate.status}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Documents */}
            <Card className="p-4 border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                Submitted Documents
              </h3>
              {details?.attachments && details.attachments.length > 0 ? (
                <div className="space-y-3">
                  {details.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-purple-200 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {fileTypeLabels[attachment.file_type] || attachment.file_type}
                          </p>
                          <p className="text-xs text-gray-500">
                            Uploaded {formatDate(attachment.uploaded_at?.split("T")[0])}
                          </p>
                        </div>
                      </div>
                      <a
                        href={attachment.signed_file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No documents uploaded yet</p>
              )}
            </Card>

            {/* Remarks */}
            {(details?.remarks || candidate.notes) && (
              <Card className="p-4 border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Remarks / Notes</h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{details?.remarks || candidate.notes}</p>
              </Card>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={onEdit} className="bg-purple-600 hover:bg-purple-700">
                Edit Application
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
