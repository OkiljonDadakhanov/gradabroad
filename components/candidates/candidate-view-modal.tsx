"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"
import type { Candidate } from "@/types/candidate"
import { formatDate } from "@/lib/utils"

interface CandidateViewModalProps {
  isOpen: boolean
  onClose: () => void
  candidate: Candidate
  onEdit: () => void
}

export function CandidateViewModal({ isOpen, onClose, candidate, onEdit }: CandidateViewModalProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Accepted":
        return "bg-green-100 text-green-800"
      case "Rejected":
        return "bg-red-100 text-red-800"
      case "Sent for resending":
        return "bg-yellow-100 text-yellow-800"
      case "Visa taken":
        return "bg-blue-100 text-blue-800"
      case "Studying":
        return "bg-indigo-100 text-indigo-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center justify-between">
            <span>{candidate.fullName}</span>
            <Badge className={getStatusColor(candidate.status)}>{candidate.status}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <Card className="p-4">
            <h3 className="font-medium text-lg mb-3">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{candidate.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{candidate.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Country</p>
                <p className="font-medium">{candidate.country}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Applied Date</p>
                <p className="font-medium">{formatDate(candidate.appliedDate)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-medium text-lg mb-3">Academic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Faculty</p>
                <p className="font-medium">{candidate.faculty}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Program</p>
                <p className="font-medium">{candidate.program}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-medium text-lg mb-3">Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                {candidate.documents.passport ? (
                  <Check className="h-5 w-5 text-green-600 mr-2" />
                ) : (
                  <X className="h-5 w-5 text-red-600 mr-2" />
                )}
                <span>Passport</span>
              </div>
              <div className="flex items-center">
                {candidate.documents.diploma ? (
                  <Check className="h-5 w-5 text-green-600 mr-2" />
                ) : (
                  <X className="h-5 w-5 text-red-600 mr-2" />
                )}
                <span>Diploma</span>
              </div>
              <div className="flex items-center">
                {candidate.documents.transcript ? (
                  <Check className="h-5 w-5 text-green-600 mr-2" />
                ) : (
                  <X className="h-5 w-5 text-red-600 mr-2" />
                )}
                <span>Transcript</span>
              </div>
              <div className="flex items-center">
                {candidate.documents.motivationLetter ? (
                  <Check className="h-5 w-5 text-green-600 mr-2" />
                ) : (
                  <X className="h-5 w-5 text-red-600 mr-2" />
                )}
                <span>Motivation Letter</span>
              </div>
            </div>
          </Card>

          {candidate.notes && (
            <Card className="p-4">
              <h3 className="font-medium text-lg mb-3">Notes</h3>
              <p>{candidate.notes}</p>
            </Card>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={onEdit} className="bg-purple-900 hover:bg-purple-800">
              Edit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
