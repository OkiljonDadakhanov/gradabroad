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
import { FileText, ExternalLink, Loader2, CheckCircle, XCircle, Clock, UserCheck, Calendar, Settings, Link } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { CandidateDetail, CandidateAttachment } from "@/types/candidate"
import { FILE_TYPE_LABELS, DOCUMENT_CATEGORIES } from "@/types/candidate"
import { STATUS_COLORS, STATUS_LABELS, VALID_STATUS_TRANSITIONS, ENDPOINTS } from "@/lib/constants"
import { fetchWithAuth } from "@/lib/fetchWithAuth"
import { formatDate } from "@/lib/utils"
import { toast } from "sonner"

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
    description: "Accept this candidate's application.",
    requiresReason: false,
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

  // Confirmation dialog state
  const [showConfirm, setShowConfirm] = useState(false)
  const [pendingStatus, setPendingStatus] = useState<string | null>(null)
  const [remarks, setRemarks] = useState("")
  const [scheduledDate, setScheduledDate] = useState("")
  const [scheduledTime, setScheduledTime] = useState("")
  const [interviewLink, setInterviewLink] = useState("")
  const [isManualOverride, setIsManualOverride] = useState(false)

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
    setIsManualOverride(false)
    setShowConfirm(true)
  }

  const handleManualOverride = () => {
    setPendingStatus(null)
    setRemarks("")
    setScheduledDate("")
    setScheduledTime("")
    setInterviewLink("")
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
        finalRemarks = `Interview scheduled for ${dateStr} at ${scheduledTime}. Interview link: ${interviewLink.trim()}`
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
    }
  }

  const availableActions = candidate ? VALID_STATUS_TRANSITIONS[candidate.status] || [] : []
  const currentAction = pendingStatus ? STATUS_ACTIONS[pendingStatus] : null

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
    return false
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
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

                {candidate.remarks && (
                  <Card className="p-4 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
                    <h3 className="font-medium text-lg mb-3 dark:text-gray-100">Latest Remarks</h3>
                    <p className="text-gray-700 dark:text-gray-300">{candidate.remarks}</p>
                  </Card>
                )}

                {/* Documents Section - Grouped by Category */}
                <Card className="p-4">
                  <h3 className="font-medium text-lg mb-4 dark:text-gray-100">Documents ({candidate.attachments?.length || 0})</h3>
                  {candidate.attachments && candidate.attachments.length > 0 ? (
                    <div className="space-y-6">
                      {Object.entries(DOCUMENT_CATEGORIES).map(([categoryKey, category]) => {
                        const categoryDocs = candidate.attachments.filter(
                          (att) => category.types.includes(att.file_type) ||
                            (categoryKey === "other" && !Object.values(DOCUMENT_CATEGORIES)
                              .flatMap(c => c.types)
                              .filter(t => t !== "other")
                              .includes(att.file_type))
                        )

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
                                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
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
                                  <Button variant="outline" size="sm" asChild>
                                    <a
                                      href={attachment.signed_file_url || attachment.file}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <ExternalLink className="h-4 w-4 mr-2" />
                                      View
                                    </a>
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      })}
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
            <div className="py-12 text-center text-gray-500 dark:text-gray-400">
              Failed to load candidate details
            </div>
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
                      <Label htmlFor="scheduled-time">Interview Time *</Label>
                      <Input
                        id="scheduled-time"
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                      />
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
    </>
  )
}
