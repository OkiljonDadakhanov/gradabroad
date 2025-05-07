"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { useForm } from "@/hooks/use-form"
import { type Scholarship, type ScholarshipFormData, DEGREE_TYPES, ACADEMIC_PROGRAMS } from "@/types/scholarship"

interface ScholarshipModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Scholarship | ScholarshipFormData) => void
  initialData?: Scholarship
  title: string
}

const defaultFormData: ScholarshipFormData = {
  degreeType: "",
  academicProgram: "",
  description: {
    english: "",
    korean: "",
    russian: "",
    uzbek: "",
  },
}

export function ScholarshipModal({ isOpen, onClose, onSave, initialData, title }: ScholarshipModalProps) {
  const [activeTab, setActiveTab] = useState("english")

  const { values, handleSelectChange, handleNestedChange, reset } = useForm<ScholarshipFormData>(
    initialData || defaultFormData,
  )

  const handleSubmit = () => {
    if (initialData) {
      onSave({
        ...values,
        id: initialData.id,
      })
    } else {
      onSave(values)
    }
  }

  const handleCancel = () => {
    reset()
    onClose()
  }

  const handleRichTextChange = (lang: string, content: string) => {
    handleNestedChange("description", lang, content)
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
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="degreeType">Degree type</Label>
              <Select value={values.degreeType} onValueChange={(value) => handleSelectChange("degreeType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select degree type" />
                </SelectTrigger>
                <SelectContent>
                  {DEGREE_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="academicProgram">Academic program</Label>
              <Select
                value={values.academicProgram}
                onValueChange={(value) => handleSelectChange("academicProgram", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select academic program" />
                </SelectTrigger>
                <SelectContent>
                  {ACADEMIC_PROGRAMS.map((program) => (
                    <SelectItem key={program} value={program}>
                      {program}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>About the scholarship</Label>
            <Tabs defaultValue="english" className="mt-2" onValueChange={setActiveTab}>
              <TabsList className="bg-purple-100">
                <TabsTrigger
                  value="english"
                  className="data-[state=active]:bg-purple-700 data-[state=active]:text-white"
                >
                  English
                </TabsTrigger>
                <TabsTrigger
                  value="korean"
                  className="data-[state=active]:bg-purple-700 data-[state=active]:text-white"
                >
                  한국어
                </TabsTrigger>
                <TabsTrigger
                  value="russian"
                  className="data-[state=active]:bg-purple-700 data-[state=active]:text-white"
                >
                  Русский
                </TabsTrigger>
                <TabsTrigger value="uzbek" className="data-[state=active]:bg-purple-700 data-[state=active]:text-white">
                  O'zbek
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <RichTextEditor value={values.description} onChange={handleRichTextChange} />
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

