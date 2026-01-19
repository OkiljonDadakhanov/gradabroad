"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, Loader2, CheckCircle, XCircle, Clock, UserCheck, Calendar, Settings, Link, User, Users, MapPin, Phone, Mail, Video, ExternalLink, Copy, Check, Upload, Download, MessageSquare } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { CandidateDetail, CandidateAttachment } from "@/types/candidate"
import { FILE_TYPE_LABELS, DOCUMENT_CATEGORIES, PERSONAL_DOC_TYPE_LABELS, GENERAL_DOC_TYPE_LABELS, FINANCIAL_DOC_TYPE_LABELS, LANGUAGE_CERT_LABELS } from "@/types/candidate"
import { STATUS_COLORS, STATUS_LABELS, VALID_STATUS_TRANSITIONS, ENDPOINTS } from "@/lib/constants"
import { fetchWithAuth } from "@/lib/fetchWithAuth"
import { formatDate } from "@/lib/utils"
import { toast } from "sonner"
import { CandidateChatModal } from "./candidate-chat-modal"

// Convert Korean time (KST, UTC+9) to Uzbekistan time (UZT, UTC+5)
function convertKSTtoUZT(time: string): string {
  const [hours, minutes] = time.split(':').map(Number)
  // KST is UTC+9, UZT is UTC+5, so UZT = KST - 4 hours
  let uztHours = hours - 4
  if (uztHours < 0) uztHours += 24
  return `${uztHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

// Parse interview details from remarks
function parseInterviewDetails(remarks: string) {
  const dateMatch = remarks.match(/Interview scheduled for ([^.]+)\./i)
  const koreanTimeMatch = remarks.match(/Korean Time \(KST\):\s*(\d{2}:\d{2})/i)
  const uzbekTimeMatch = remarks.match(/Uzbekistan Time \(UZT\):\s*(\d{2}:\d{2})/i)
  const linkSectionMatch = remarks.match(/Interview link:\s*(.+)/i)

  let link: string | null = null
  let additionalInstructions: string | null = null

  if (linkSectionMatch && linkSectionMatch[1]) {
    const linkSection = linkSectionMatch[1].trim()
    const urlMatch = linkSection.match(/^(https?:\/?\/?[^\s]+)/i)
    if (urlMatch) {
      let extractedUrl = urlMatch[1]
      // Fix common URL issues
      if (extractedUrl.match(/^https?:\/[^/]/i)) {
        extractedUrl = extractedUrl.replace(/^(https?:)\/([^/])/i, '$1//$2')
      }
      if (extractedUrl.match(/^https?:[^/]/i)) {
        extractedUrl = extractedUrl.replace(/^(https?:)([^/])/i, '$1//$2')
      }
      link = extractedUrl
      const afterUrl = linkSection.substring(urlMatch[1].length).trim()
      if (afterUrl) {
        additionalInstructions = afterUrl
      }
    } else {
      const parts = linkSection.split(/\s+/)
      link = parts[0]
      if (link && !link.startsWith('http') && link.includes('.')) {
        link = 'https://' + link
      }
      if (parts.length > 1) {
        additionalInstructions = parts.slice(1).join(' ')
      }
    }
  }

  return {
    dateTime: dateMatch ? dateMatch[1] : null,
    koreanTime: koreanTimeMatch ? koreanTimeMatch[1] : null,
    uzbekTime: uzbekTimeMatch ? uzbekTimeMatch[1] : null,
    link,
    additionalInstructions,
  }
}

interface CandidateViewModalProps {
  isOpen: boolean
  onClose: () => void
  candidateId: number
  onStatusUpdated?: () => void
}

// Action button config based on target status
const STATUS_ACTIONS: Record<string, {
  label: string
  icon: React.ReactNode
  variant: "default" | "destructive" | "outline"
  confirmTitle: string
  description: string
  requiresDate?: boolean
  requiresReason?: boolean
  requiresAcceptanceLetter?: boolean
  reasonLabel?: string
  reasonPlaceholder?: string
}> = {
  under_review: {
    label: "Start Review",
    icon: <Clock className="h-4 w-4 mr-2" />,
    variant: "outline",
    confirmTitle: "Start Review",
    description: "Mark this application as under review.",
    requiresReason: false,
    reasonLabel: "Notes (optional)",
    reasonPlaceholder: "Any initial observations or notes..."
  },
  interview: {
    label: "Schedule Interview",
    icon: <UserCheck className="h-4 w-4 mr-2" />,
    variant: "outline",
    confirmTitle: "Schedule Interview",
    description: "Schedule an interview with the candidate.",
    requiresDate: true,
    requiresReason: false,
    reasonLabel: "Additional Instructions (optional)",
    reasonPlaceholder: "e.g., Please bring your original documents, prepare a presentation..."
  },
  accepted: {
    label: "Accept",
    icon: <CheckCircle className="h-4 w-4 mr-2" />,
    variant: "default",
    confirmTitle: "Accept Application",
    description: "Accept this candidate's application. You must upload an acceptance letter.",
    requiresReason: false,
    requiresAcceptanceLetter: true,
    reasonLabel: "Acceptance Message (optional)",
    reasonPlaceholder: "e.g., Congratulations! We are pleased to offer you admission..."
  },
  rejected: {
    label: "Reject",
    icon: <XCircle className="h-4 w-4 mr-2" />,
    variant: "destructive",
    confirmTitle: "Reject Application",
    description: "Reject this candidate's application. Please provide a reason.",
    requiresReason: true,
    reasonLabel: "Reason for Rejection *",
    reasonPlaceholder: "e.g., Unfortunately, we cannot proceed with your application due to..."
  },
  studying: {
    label: "Mark as Studying",
    icon: <CheckCircle className="h-4 w-4 mr-2" />,
    variant: "default",
    confirmTitle: "Mark as Studying",
    description: "Mark that the student has started their studies.",
    requiresDate: true,
    requiresReason: false,
    reasonLabel: "Notes (optional)",
    reasonPlaceholder: "e.g., Student arrived and started classes..."
  },
}

export function CandidateViewModal({ isOpen, onClose, candidateId, onStatusUpdated }: CandidateViewModalProps) {
  const [candidate, setCandidate] = useState<CandidateDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const handleJoinInterview = (link: string) => {
    let url = link
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url
    }
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  // Confirmation dialog state
  const [showConfirm, setShowConfirm] = useState(false)
  const [pendingStatus, setPendingStatus] = useState<string | null>(null)
  const [remarks, setRemarks] = useState("")
  const [scheduledDate, setScheduledDate] = useState("")
  const [scheduledTime, setScheduledTime] = useState("")
  const [interviewLink, setInterviewLink] = useState("")
  const [isManualOverride, setIsManualOverride] = useState(false)
  const [downloadingAttachment, setDownloadingAttachment] = useState<number | null>(null)
  const [downloadingPersonalDoc, setDownloadingPersonalDoc] = useState<number | null>(null)
  const [downloadingFamilyDoc, setDownloadingFamilyDoc] = useState<number | null>(null)
  const [downloadingFinancialDoc, setDownloadingFinancialDoc] = useState<number | null>(null)
  const [downloadingLanguageCert, setDownloadingLanguageCert] = useState<number | null>(null)
  const [acceptanceLetterFile, setAcceptanceLetterFile] = useState<File | null>(null)
  const [uploadingAcceptanceLetter, setUploadingAcceptanceLetter] = useState(false)
  const [downloadingAcceptanceLetter, setDownloadingAcceptanceLetter] = useState(false)
  const [chatModalOpen, setChatModalOpen] = useState(false)

  // All available statuses for manual override
  const ALL_STATUSES = [
    "submitted",
    "under_review",
    "interview",
    "accepted",
    "rejected",
    "studying",
  ]

  useEffect(() => {
    if (isOpen && candidateId) {
      fetchCandidateDetail()
    }
  }, [isOpen, candidateId])

  const fetchCandidateDetail = async () => {
    try {
      setLoading(true)
      const response = await fetchWithAuth(ENDPOINTS.CANDIDATE(candidateId))
      if (response.ok) {
        const data = await response.json()
        setCandidate(data)
      }
    } catch (error) {
      console.error("Failed to fetch candidate detail:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleActionClick = (status: string) => {
    setPendingStatus(status)
    setRemarks("")
    setScheduledDate("")
    setScheduledTime("")
    setInterviewLink("")
    setAcceptanceLetterFile(null)
    setIsManualOverride(false)
    setShowConfirm(true)
  }

  const handleManualOverride = () => {
    setPendingStatus(null)
    setRemarks("")
    setScheduledDate("")
    setScheduledTime("")
    setInterviewLink("")
    setAcceptanceLetterFile(null)
    setIsManualOverride(true)
    setShowConfirm(true)
  }

  const handleConfirmStatusChange = async () => {
    if (!candidate || !pendingStatus) return

    const action = STATUS_ACTIONS[pendingStatus]

    // Validate required fields
    if (isManualOverride && !remarks.trim()) {
      toast.error("Please provide a reason for the status change")
      return
    }

    if (!isManualOverride && action?.requiresReason && !remarks.trim()) {
      toast.error("Please provide a reason")
      return
    }

    if (!isManualOverride && action?.requiresDate && !scheduledDate) {
      toast.error("Please select a date")
      return
    }

    // Interview requires time and link
    if (!isManualOverride && pendingStatus === "interview") {
      if (!scheduledTime) {
        toast.error("Please select an interview time")
        return
      }
      if (!interviewLink.trim()) {
        toast.error("Please provide an interview link")
        return
      }
    }

    // Acceptance requires acceptance letter
    if (!isManualOverride && action?.requiresAcceptanceLetter && !acceptanceLetterFile) {
      toast.error("Please upload an acceptance letter")
      return
    }

    // Build remarks message
    let finalRemarks = ""

    if (isManualOverride) {
      // Manual override always requires a reason
      finalRemarks = remarks.trim()
    } else if (action?.requiresDate && scheduledDate) {
      const dateStr = new Date(scheduledDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      if (pendingStatus === "interview") {
        const uzbekTime = convertKSTtoUZT(scheduledTime)
        finalRemarks = `Interview scheduled for ${dateStr}. Korean Time (KST): ${scheduledTime} | Uzbekistan Time (UZT): ${uzbekTime}. Interview link: ${interviewLink.trim()}`
      } else if (pendingStatus === "studying") {
        finalRemarks = `Started studies on ${dateStr}.`
      }
      if (remarks.trim()) {
        finalRemarks += ` ${remarks.trim()}`
      }
    } else if (remarks.trim()) {
      finalRemarks = remarks.trim()
    } else {
      // Default messages for statuses without required input
      const defaultMessages: Record<string, string> = {
        under_review: "Application is now under review.",
        accepted: "Congratulations! Your application has been accepted.",
        confirmed: "Enrollment confirmed.",
      }
      finalRemarks = defaultMessages[pendingStatus] || `Status changed to ${STATUS_LABELS[pendingStatus]}.`
    }

    try {
      setUpdating(true)

      // Upload acceptance letter first if required
      if (!isManualOverride && action?.requiresAcceptanceLetter && acceptanceLetterFile) {
        setUploadingAcceptanceLetter(true)
        const formData = new FormData()
        formData.append("acceptance_letter", acceptanceLetterFile)

        const uploadResponse = await fetchWithAuth(
          ENDPOINTS.ACCEPTANCE_LETTER_UPLOAD(candidateId),
          {
            method: "POST",
            body: formData,
          }
        )

        if (!uploadResponse.ok) {
          const error = await uploadResponse.json()
          toast.error(error.detail || "Failed to upload acceptance letter")
          setUploadingAcceptanceLetter(false)
          setUpdating(false)
          return
        }
        setUploadingAcceptanceLetter(false)
      }

      const response = await fetchWithAuth(ENDPOINTS.CANDIDATE(candidateId), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: pendingStatus, remarks: finalRemarks }),
      })

      if (response.ok) {
        const data = await response.json()
        setCandidate(data)
        toast.success(`Status updated to ${STATUS_LABELS[pendingStatus] || pendingStatus}`)
        setShowConfirm(false)
        setPendingStatus(null)
        setRemarks("")
        setScheduledDate("")
        setScheduledTime("")
        setInterviewLink("")
        setAcceptanceLetterFile(null)
        setIsManualOverride(false)
        onStatusUpdated?.()
      } else {
        const error = await response.json()
        toast.error(error.detail || "Failed to update status")
      }
    } catch (error) {
      console.error("Failed to update status:", error)
      toast.error("Failed to update status")
    } finally {
      setUpdating(false)
      setUploadingAcceptanceLetter(false)
    }
  }

  const availableActions = candidate ? VALID_STATUS_TRANSITIONS[candidate.status] || [] : []
  const currentAction = pendingStatus ? STATUS_ACTIONS[pendingStatus] : null

  // Personal documents from PersonalDocument model
  const personalDocs = candidate?.personal_documents || []

  const handleViewAttachment = async (attachmentId: number) => {
    setDownloadingAttachment(attachmentId)
    try {
      const response = await fetchWithAuth(
        ENDPOINTS.ATTACHMENT_DOWNLOAD(candidateId, attachmentId)
      )
      if (response.ok) {
        const data = await response.json()
        window.open(data.signed_url, "_blank")
      } else {
        toast.error("Failed to get download URL")
      }
    } catch (error) {
      console.error("Failed to get signed URL:", error)
      toast.error("Failed to get download URL")
    } finally {
      setDownloadingAttachment(null)
    }
  }

  const handleViewPersonalDocument = async (docId: number) => {
    setDownloadingPersonalDoc(docId)
    try {
      const response = await fetchWithAuth(
        ENDPOINTS.PERSONAL_DOCUMENT_DOWNLOAD(candidateId, docId)
      )
      if (response.ok) {
        const data = await response.json()
        window.open(data.signed_url, "_blank")
      } else {
        toast.error("Failed to get document URL")
      }
    } catch (error) {
      console.error("Failed to get signed URL:", error)
      toast.error("Failed to get document URL")
    } finally {
      setDownloadingPersonalDoc(null)
    }
  }

  const handleViewFamilyPassport = async (memberId: number) => {
    setDownloadingFamilyDoc(memberId)
    try {
      const response = await fetchWithAuth(
        ENDPOINTS.FAMILY_PASSPORT_DOWNLOAD(candidateId, memberId)
      )
      if (response.ok) {
        const data = await response.json()
        window.open(data.signed_url, "_blank")
      } else {
        toast.error("Failed to get passport URL")
      }
    } catch (error) {
      console.error("Failed to get signed URL:", error)
      toast.error("Failed to get passport URL")
    } finally {
      setDownloadingFamilyDoc(null)
    }
  }

  const handleViewFinancialDocument = async (docId: number) => {
    setDownloadingFinancialDoc(docId)
    try {
      const response = await fetchWithAuth(
        ENDPOINTS.FINANCIAL_DOCUMENT_DOWNLOAD(candidateId, docId)
      )
      if (response.ok) {
        const data = await response.json()
        window.open(data.signed_url, "_blank")
      } else {
        toast.error("Failed to get document URL")
      }
    } catch (error) {
      console.error("Failed to get signed URL:", error)
      toast.error("Failed to get document URL")
    } finally {
      setDownloadingFinancialDoc(null)
    }
  }

  const handleViewLanguageCertificate = async (certId: number) => {
    setDownloadingLanguageCert(certId)
    try {
      const response = await fetchWithAuth(
        ENDPOINTS.LANGUAGE_CERTIFICATE_DOWNLOAD(candidateId, certId)
      )
      if (response.ok) {
        const data = await response.json()
        window.open(data.signed_url, "_blank")
      } else {
        toast.error("Failed to get certificate URL")
      }
    } catch (error) {
      console.error("Failed to get signed URL:", error)
      toast.error("Failed to get certificate URL")
    } finally {
      setDownloadingLanguageCert(null)
    }
  }

  // Check if confirm button should be disabled
  const isConfirmDisabled = () => {
    if (updating) return true
    if (isManualOverride) {
      return !pendingStatus || !remarks.trim()
    }
    if (currentAction?.requiresReason && !remarks.trim()) return true
    if (currentAction?.requiresDate && !scheduledDate) return true
    // Interview requires time and link
    if (pendingStatus === "interview" && (!scheduledTime || !interviewLink.trim())) return true
    // Acceptance requires acceptance letter
    if (currentAction?.requiresAcceptanceLetter && !acceptanceLetterFile) return true
    return false
  }

  // Handle acceptance letter download
  const handleDownloadAcceptanceLetter = async () => {
    if (!candidate) return
    setDownloadingAcceptanceLetter(true)
    try {
      const response = await fetchWithAuth(
        ENDPOINTS.ACCEPTANCE_LETTER_DOWNLOAD(candidateId)
      )
      if (response.ok) {
        const data = await response.json()
        window.open(data.signed_url, "_blank")
      } else {
        toast.error("Failed to get acceptance letter URL")
      }
    } catch (error) {
      console.error("Failed to get acceptance letter URL:", error)
      toast.error("Failed to get acceptance letter URL")
    } finally {
      setDownloadingAcceptanceLetter(false)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {loading ? (
            <>
              <DialogHeader>
                <DialogTitle>Loading Candidate Details</DialogTitle>
              </DialogHeader>
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              </div>
            </>
          ) : candidate ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold flex items-center justify-between">
                  <span>{candidate.applicant_full_name}</span>
                  <Badge className={STATUS_COLORS[candidate.status] || "bg-gray-100 text-gray-700"}>
                    {STATUS_LABELS[candidate.status] || candidate.status}
                  </Badge>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Action Buttons */}
                <Card className="p-4 bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800">
                  <h3 className="font-medium text-lg mb-3 dark:text-gray-100">Actions</h3>
                  <div className="flex flex-wrap gap-2">
                    {availableActions.map((status) => {
                      const action = STATUS_ACTIONS[status]
                      if (!action) return null
                      return (
                        <Button
                          key={status}
                          variant={action.variant}
                          onClick={() => handleActionClick(status)}
                          disabled={updating}
                          className={action.variant === "default" ? "bg-green-600 hover:bg-green-700" : ""}
                        >
                          {action.icon}
                          {action.label}
                        </Button>
                      )
                    })}
                    {availableActions.length > 0 && (
                      <div className="w-px bg-gray-300 dark:bg-gray-600 mx-2" />
                    )}
                    <Button
                      variant="outline"
                      onClick={handleManualOverride}
                      disabled={updating}
                      className="text-gray-600 dark:text-gray-300"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Change Status
                    </Button>
                    <div className="w-px bg-gray-300 dark:bg-gray-600 mx-2" />
                    <Button
                      variant="outline"
                      onClick={() => setChatModalOpen(true)}
                      className="text-blue-600 dark:text-blue-400 border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Chat
                    </Button>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="font-medium text-lg mb-3 dark:text-gray-100">Application Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                      <p className="font-medium dark:text-gray-200">{candidate.applicant_email || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Program</p>
                      <p className="font-medium dark:text-gray-200">{candidate.programme_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Applied Date</p>
                      <p className="font-medium dark:text-gray-200">
                        {candidate.applied_date ? formatDate(candidate.applied_date) : "Not submitted yet"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                      <p className="font-medium dark:text-gray-200">{STATUS_LABELS[candidate.status] || candidate.status}</p>
                    </div>
                  </div>
                </Card>

                {/* Personal Information Section */}
                {candidate.student_profile && (
                  <Card className="p-4">
                    <h3 className="font-medium text-lg mb-4 dark:text-gray-100 flex items-center gap-2">
                      <User className="h-5 w-5 text-purple-600" />
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {candidate.student_profile.first_name && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">First Name</p>
                          <p className="font-medium dark:text-gray-200">{candidate.student_profile.first_name}</p>
                        </div>
                      )}
                      {candidate.student_profile.last_name && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Last Name</p>
                          <p className="font-medium dark:text-gray-200">{candidate.student_profile.last_name}</p>
                        </div>
                      )}
                      {candidate.student_profile.date_of_birth && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
                          <p className="font-medium dark:text-gray-200">{formatDate(candidate.student_profile.date_of_birth)}</p>
                        </div>
                      )}
                      {candidate.student_profile.gender && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Gender</p>
                          <p className="font-medium dark:text-gray-200 capitalize">{candidate.student_profile.gender}</p>
                        </div>
                      )}
                      {candidate.student_profile.nationality && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Nationality</p>
                          <p className="font-medium dark:text-gray-200">{candidate.student_profile.nationality}</p>
                        </div>
                      )}
                      {candidate.student_profile.passport_number && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Passport Number</p>
                          <p className="font-medium dark:text-gray-200">{candidate.student_profile.passport_number}</p>
                        </div>
                      )}
                      {candidate.student_profile.passport_expiry_date && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Passport Expiry</p>
                          <p className="font-medium dark:text-gray-200">{formatDate(candidate.student_profile.passport_expiry_date)}</p>
                        </div>
                      )}
                      {candidate.student_profile.phone_number && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                          <p className="font-medium dark:text-gray-200">{candidate.student_profile.phone_number}</p>
                        </div>
                      )}
                      {candidate.student_profile.email_contact && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Contact Email</p>
                          <p className="font-medium dark:text-gray-200">{candidate.student_profile.email_contact}</p>
                        </div>
                      )}
                    </div>

                    {/* Address */}
                    {(candidate.student_profile.address_line1 || candidate.student_profile.city || candidate.student_profile.country) && (
                      <div className="mt-4 pt-4 border-t dark:border-gray-700">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Address
                        </p>
                        <p className="font-medium dark:text-gray-200">
                          {[
                            candidate.student_profile.address_line1,
                            candidate.student_profile.address_line2,
                            candidate.student_profile.city,
                            candidate.student_profile.state_province,
                            candidate.student_profile.postal_code,
                            candidate.student_profile.country
                          ].filter(Boolean).join(", ")}
                        </p>
                      </div>
                    )}

                    {/* Emergency Contact */}
                    {candidate.student_profile.emergency_full_name && (
                      <div className="mt-4 pt-4 border-t dark:border-gray-700">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Emergency Contact
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                            <p className="font-medium dark:text-gray-200">{candidate.student_profile.emergency_full_name}</p>
                          </div>
                          {candidate.student_profile.emergency_relationship && (
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Relationship</p>
                              <p className="font-medium dark:text-gray-200">{candidate.student_profile.emergency_relationship}</p>
                            </div>
                          )}
                          {candidate.student_profile.emergency_phone && (
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                              <p className="font-medium dark:text-gray-200">{candidate.student_profile.emergency_phone}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </Card>
                )}

                {/* Family Members Section */}
                {candidate.family_members && candidate.family_members.length > 0 && (
                  <Card className="p-4">
                    <h3 className="font-medium text-lg mb-4 dark:text-gray-100 flex items-center gap-2">
                      <Users className="h-5 w-5 text-purple-600" />
                      Family Members ({candidate.family_members.length})
                    </h3>
                    <div className="space-y-3">
                      {candidate.family_members.map((member) => (
                        <div
                          key={member.id}
                          className={`p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg ${
                            member.signed_file_url ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50" : ""
                          } transition-colors ${downloadingFamilyDoc === member.id ? "opacity-50" : ""}`}
                          onClick={() => member.signed_file_url && handleViewFamilyPassport(member.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                                <p className="font-medium dark:text-gray-200">{member.full_name}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Relation</p>
                                <p className="font-medium dark:text-gray-200 capitalize">{member.relation}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
                                <p className="font-medium dark:text-gray-200">{formatDate(member.date_of_birth)}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Occupation</p>
                                <p className="font-medium dark:text-gray-200">{member.occupation}</p>
                              </div>
                            </div>
                            {member.signed_file_url && (
                              <div className="ml-4 flex items-center gap-2">
                                {downloadingFamilyDoc === member.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                                ) : (
                                  <Badge variant="outline" className="text-xs">Passport</Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Interview Details Section */}
                {candidate.status === "interview" && candidate.remarks && (() => {
                  const interviewDetails = parseInterviewDetails(candidate.remarks)
                  return (
                    <Card className="p-4 bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800">
                      <h3 className="font-medium text-lg mb-4 dark:text-gray-100 flex items-center gap-2">
                        <Video className="h-5 w-5 text-purple-600" />
                        Interview Details
                      </h3>
                      <div className="space-y-4">
                        {/* Date & Time */}
                        {interviewDetails.dateTime && (
                          <div className="bg-white dark:bg-purple-900/50 p-3 rounded-lg border border-purple-200 dark:border-purple-600">
                            <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide mb-1">
                              Date
                            </p>
                            <p className="flex items-center gap-2 text-purple-800 dark:text-purple-200 font-medium">
                              <Calendar className="h-4 w-4" />
                              {interviewDetails.dateTime}
                            </p>
                          </div>
                        )}

                        {/* Times */}
                        {(interviewDetails.koreanTime || interviewDetails.uzbekTime) && (
                          <div className="bg-white dark:bg-purple-900/50 p-3 rounded-lg border border-purple-200 dark:border-purple-600">
                            <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide mb-2">
                              Interview Time
                            </p>
                            <div className="space-y-2">
                              {interviewDetails.koreanTime && (
                                <p className="flex items-center gap-2 text-purple-800 dark:text-purple-200">
                                  <Clock className="h-4 w-4" />
                                  <span>🇰🇷 Korean Time (KST): <span className="font-semibold">{interviewDetails.koreanTime}</span></span>
                                </p>
                              )}
                              {interviewDetails.uzbekTime && (
                                <p className="flex items-center gap-2 text-purple-800 dark:text-purple-200">
                                  <Clock className="h-4 w-4" />
                                  <span>🇺🇿 Uzbekistan Time (UZT): <span className="font-semibold">{interviewDetails.uzbekTime}</span></span>
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Meeting Link */}
                        {interviewDetails.link && (
                          <div className="bg-white dark:bg-purple-900/50 p-3 rounded-lg border border-purple-200 dark:border-purple-600">
                            <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide mb-2">
                              Meeting Link
                            </p>
                            <div className="space-y-3">
                              <div className="flex items-center gap-2 p-2 bg-purple-50 dark:bg-purple-900/30 rounded border">
                                <span className="text-purple-700 dark:text-purple-300 break-all text-sm flex-1">
                                  {interviewDetails.link}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="flex-shrink-0 text-purple-600 hover:text-purple-800 hover:bg-purple-100"
                                  onClick={() => handleCopyLink(interviewDetails.link!)}
                                >
                                  {copiedLink ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </Button>
                              </div>
                              <Button
                                className="bg-purple-600 hover:bg-purple-700 w-full"
                                onClick={() => handleJoinInterview(interviewDetails.link!)}
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Join Interview
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Instructions */}
                        {interviewDetails.additionalInstructions && (
                          <div className="bg-white dark:bg-purple-900/50 p-3 rounded-lg border border-purple-200 dark:border-purple-600">
                            <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide mb-2">
                              Additional Instructions
                            </p>
                            <p className="text-purple-700 dark:text-purple-300 whitespace-pre-wrap text-sm">
                              {interviewDetails.additionalInstructions}
                            </p>
                          </div>
                        )}

                        {/* Fallback if nothing parsed */}
                        {!interviewDetails.dateTime && !interviewDetails.link && (
                          <p className="text-gray-700 dark:text-gray-300">{candidate.remarks}</p>
                        )}
                      </div>
                    </Card>
                  )
                })()}

                {/* Regular Remarks for non-interview statuses */}
                {candidate.status !== "interview" && candidate.remarks && (
                  <Card className="p-4 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
                    <h3 className="font-medium text-lg mb-3 dark:text-gray-100">Latest Remarks</h3>
                    <p className="text-gray-700 dark:text-gray-300">{candidate.remarks}</p>
                  </Card>
                )}

                {/* Acceptance Letter Section */}
                {candidate.acceptance_letter_url && (
                  <Card className="p-4 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
                    <h3 className="font-medium text-lg mb-3 dark:text-gray-100 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-green-600" />
                      Acceptance Letter
                    </h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Uploaded: {candidate.acceptance_letter_uploaded_at
                            ? formatDate(candidate.acceptance_letter_uploaded_at)
                            : "Unknown"}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownloadAcceptanceLetter}
                        disabled={downloadingAcceptanceLetter}
                        className="text-green-600 border-green-300 hover:bg-green-100 dark:hover:bg-green-900/30"
                      >
                        {downloadingAcceptanceLetter ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4 mr-2" />
                        )}
                        Download
                      </Button>
                    </div>
                  </Card>
                )}

                {/* Documents Section */}
                <Card className="p-4">
                  <h3 className="font-medium text-lg mb-4 dark:text-gray-100">
                    Documents ({(candidate.attachments?.length || 0) + personalDocs.length + (candidate.financial_documents?.length || 0) + (candidate.language_certificates?.length || 0)})
                  </h3>
                  {(candidate.attachments && candidate.attachments.length > 0) || personalDocs.length > 0 || (candidate.financial_documents && candidate.financial_documents.length > 0) || (candidate.language_certificates && candidate.language_certificates.length > 0) ? (
                    <div className="space-y-6">
                      {/* Personal Documents (from PersonalDocument model) */}
                      {personalDocs.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                            Personal Documents ({personalDocs.length})
                          </h4>
                          <div className="space-y-2">
                            {personalDocs.map((doc) => (
                              <div
                                key={`personal-${doc.id}`}
                                className={`flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${
                                  downloadingPersonalDoc === doc.id ? "opacity-50" : ""
                                }`}
                                onClick={() => handleViewPersonalDocument(doc.id)}
                              >
                                <div className="flex items-center gap-3">
                                  <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                  <div>
                                    <p className="font-medium dark:text-gray-200">
                                      {PERSONAL_DOC_TYPE_LABELS[doc.doc_type] || doc.doc_type}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      Uploaded: {formatDate(doc.uploaded_at)}
                                    </p>
                                  </div>
                                </div>
                                {downloadingPersonalDoc === doc.id && (
                                  <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Application Attachments by Category */}
                      {Object.entries(DOCUMENT_CATEGORIES).map(([categoryKey, category]) => {
                        const categoryDocs = candidate.attachments?.filter(
                          (att) => category.types.includes(att.file_type)
                        ) || []

                        if (categoryDocs.length === 0) return null

                        return (
                          <div key={categoryKey}>
                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                              {category.label} ({categoryDocs.length})
                            </h4>
                            <div className="space-y-2">
                              {categoryDocs.map((attachment) => (
                                <div
                                  key={attachment.id}
                                  className={`flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${
                                    downloadingAttachment === attachment.id ? "opacity-50" : ""
                                  }`}
                                  onClick={() => handleViewAttachment(attachment.id)}
                                >
                                  <div className="flex items-center gap-3">
                                    <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                    <div>
                                      <p className="font-medium dark:text-gray-200">
                                        {FILE_TYPE_LABELS[attachment.file_type] || attachment.file_type}
                                      </p>
                                      <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Uploaded: {formatDate(attachment.uploaded_at)}
                                      </p>
                                    </div>
                                  </div>
                                  {downloadingAttachment === attachment.id && (
                                    <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      })}

                      {/* Financial Documents */}
                      {candidate.financial_documents && candidate.financial_documents.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                            Financial Documents ({candidate.financial_documents.length})
                          </h4>
                          <div className="space-y-2">
                            {candidate.financial_documents.map((doc) => (
                              <div
                                key={`financial-${doc.id}`}
                                className={`flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${
                                  downloadingFinancialDoc === doc.id ? "opacity-50" : ""
                                }`}
                                onClick={() => handleViewFinancialDocument(doc.id)}
                              >
                                <div className="flex items-center gap-3">
                                  <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                                  <div>
                                    <p className="font-medium dark:text-gray-200">
                                      {FINANCIAL_DOC_TYPE_LABELS[doc.doc_type] || doc.doc_type}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      Uploaded: {formatDate(doc.uploaded_at)}
                                    </p>
                                  </div>
                                </div>
                                {downloadingFinancialDoc === doc.id && (
                                  <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Language Certificates */}
                      {candidate.language_certificates && candidate.language_certificates.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                            Language Certificates ({candidate.language_certificates.length})
                          </h4>
                          <div className="space-y-2">
                            {candidate.language_certificates.map((cert) => (
                              <div
                                key={`cert-${cert.id}`}
                                className={`flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${
                                  downloadingLanguageCert === cert.id ? "opacity-50" : ""
                                }`}
                                onClick={() => handleViewLanguageCertificate(cert.id)}
                              >
                                <div className="flex items-center gap-3">
                                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                  <div>
                                    <p className="font-medium dark:text-gray-200">
                                      {LANGUAGE_CERT_LABELS[cert.name] || cert.name}
                                      {cert.score_or_level && ` - ${cert.score_or_level}`}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      Issued: {formatDate(cert.issue_date)}
                                      {cert.expires_at && ` | Expires: ${formatDate(cert.expires_at)}`}
                                    </p>
                                  </div>
                                </div>
                                {downloadingLanguageCert === cert.id && (
                                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">No documents uploaded yet</p>
                  )}
                </Card>

                <div className="flex justify-end">
                  <Button variant="outline" onClick={onClose}>
                    Close
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Error</DialogTitle>
              </DialogHeader>
              <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                Failed to load candidate details
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={(open) => !updating && setShowConfirm(open)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {isManualOverride ? (
                <>
                  <Settings className="h-5 w-5" />
                  Change Status
                </>
              ) : (
                <>
                  {currentAction?.icon}
                  {currentAction?.confirmTitle || "Confirm Action"}
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {isManualOverride
                ? "Manually change the application status. A reason is required."
                : currentAction?.description
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Manual status selector */}
            {isManualOverride && (
              <div className="space-y-2">
                <Label htmlFor="manual-status">New Status *</Label>
                <Select
                  value={pendingStatus || ""}
                  onValueChange={(value) => setPendingStatus(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_STATUSES.filter(s => s !== candidate?.status).map((status) => (
                      <SelectItem key={status} value={status}>
                        {STATUS_LABELS[status] || status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Date/Time fields for interview and other date-required statuses */}
            {!isManualOverride && currentAction?.requiresDate && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="scheduled-date" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {pendingStatus === "interview" ? "Interview Date *" : "Date *"}
                  </Label>
                  <Input
                    id="scheduled-date"
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                {pendingStatus === "interview" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="scheduled-time">Interview Time - Korean Time (KST) *</Label>
                      <Input
                        id="scheduled-time"
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                      />
                      {scheduledTime && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/30 p-2 rounded">
                          🇺🇿 Uzbekistan Time (UZT): <span className="font-semibold">{convertKSTtoUZT(scheduledTime)}</span>
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="interview-link" className="flex items-center gap-2">
                        <Link className="h-4 w-4" />
                        Interview Link *
                      </Label>
                      <Input
                        id="interview-link"
                        type="url"
                        placeholder="https://zoom.us/j/... or https://meet.google.com/..."
                        value={interviewLink}
                        onChange={(e) => setInterviewLink(e.target.value)}
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Acceptance Letter Upload */}
            {!isManualOverride && currentAction?.requiresAcceptanceLetter && (
              <div className="space-y-2">
                <Label htmlFor="acceptance-letter" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Acceptance Letter *
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="acceptance-letter"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setAcceptanceLetterFile(e.target.files?.[0] || null)}
                    className="flex-1"
                  />
                </div>
                {acceptanceLetterFile && (
                  <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                    <Check className="h-4 w-4" />
                    {acceptanceLetterFile.name}
                  </p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Accepted formats: PDF, JPG, PNG
                </p>
              </div>
            )}

            {/* Remarks/Notes field */}
            <div className="space-y-2">
              <Label htmlFor="remarks">
                {isManualOverride
                  ? "Reason for Change *"
                  : currentAction?.reasonLabel || "Notes (optional)"
                }
              </Label>
              <Textarea
                id="remarks"
                placeholder={
                  isManualOverride
                    ? "Please explain why you are changing the status..."
                    : currentAction?.reasonPlaceholder || "Enter your notes..."
                }
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirm(false)}
              disabled={updating}
            >
              Cancel
            </Button>
            <Button
              variant={isManualOverride ? "default" : currentAction?.variant || "default"}
              onClick={handleConfirmStatusChange}
              disabled={isConfirmDisabled()}
              className={
                isManualOverride
                  ? "bg-purple-600 hover:bg-purple-700"
                  : currentAction?.variant === "default"
                    ? "bg-green-600 hover:bg-green-700"
                    : ""
              }
            >
              {updating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  {isManualOverride ? <Settings className="h-4 w-4 mr-2" /> : currentAction?.icon}
                  Confirm
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Chat Modal */}
      {candidate && (
        <CandidateChatModal
          candidate={candidate}
          open={chatModalOpen}
          onOpenChange={setChatModalOpen}
        />
      )}
    </>
  )
}
