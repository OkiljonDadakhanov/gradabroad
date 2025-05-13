"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "@/hooks/use-form"
import type { Candidate } from "@/types/candidate"
import { CandidateStatus, FACULTIES, COUNTRIES, PROGRAMS } from "@/types/candidate"

interface CandidateEditModalProps {
  isOpen: boolean
  onClose: () => void
  initialData: Candidate
  onSave: (data: Candidate) => void
}

export function CandidateEditModal({ isOpen, onClose, initialData, onSave }: CandidateEditModalProps) {
  const { values, handleChange, handleSelectChange, handleCheckboxChange, reset } = useForm<Candidate>(initialData)

  const handleSubmit = () => {
    onSave(values)
  }

  const handleCancel = () => {
    reset()
    onClose()
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleCancel()
      }}
    >
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Candidate</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                name="fullName"
                value={values.fullName}
                onChange={handleChange}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" value={values.phone} onChange={handleChange} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Select value={values.country} onValueChange={(value) => handleSelectChange("country", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="faculty">Faculty *</Label>
              <Select value={values.faculty} onValueChange={(value) => handleSelectChange("faculty", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select faculty" />
                </SelectTrigger>
                <SelectContent>
                  {FACULTIES.map((faculty) => (
                    <SelectItem key={faculty} value={faculty}>
                      {faculty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="program">Program *</Label>
              <Select value={values.program} onValueChange={(value) => handleSelectChange("program", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select program" />
                </SelectTrigger>
                <SelectContent>
                  {PROGRAMS.map((program) => (
                    <SelectItem key={program} value={program}>
                      {program}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="appliedDate">Applied Date</Label>
              <Input
                id="appliedDate"
                name="appliedDate"
                type="date"
                value={values.appliedDate}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="status">Status *</Label>
              <Select
                value={values.status}
                onValueChange={(value) => handleSelectChange("status", value as CandidateStatus)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(CandidateStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-base">Documents</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="passport"
                  checked={values.documents.passport}
                  onCheckedChange={(checked) => {
                    handleCheckboxChange("documents", {
                      ...values.documents,
                      passport: checked as boolean,
                    })
                  }}
                />
                <Label htmlFor="passport" className="font-normal">
                  Passport
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="diploma"
                  checked={values.documents.diploma}
                  onCheckedChange={(checked) => {
                    handleCheckboxChange("documents", {
                      ...values.documents,
                      diploma: checked as boolean,
                    })
                  }}
                />
                <Label htmlFor="diploma" className="font-normal">
                  Diploma
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="transcript"
                  checked={values.documents.transcript}
                  onCheckedChange={(checked) => {
                    handleCheckboxChange("documents", {
                      ...values.documents,
                      transcript: checked as boolean,
                    })
                  }}
                />
                <Label htmlFor="transcript" className="font-normal">
                  Transcript
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="motivationLetter"
                  checked={values.documents.motivationLetter}
                  onCheckedChange={(checked) => {
                    handleCheckboxChange("documents", {
                      ...values.documents,
                      motivationLetter: checked as boolean,
                    })
                  }}
                />
                <Label htmlFor="motivationLetter" className="font-normal">
                  Motivation Letter
                </Label>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={values.notes}
              onChange={handleChange}
              className="mt-1 resize-none"
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-purple-900 hover:bg-purple-800">
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}