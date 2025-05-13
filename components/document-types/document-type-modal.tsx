"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "@/hooks/use-form"
import type { DocumentType, DocumentTypeFormData } from "@/types/document"
import { defaultDocumentTypeFormData } from "@/types/document"

interface DocumentTypeModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: DocumentType | DocumentTypeFormData) => void
  initialData?: DocumentType
  title: string
}

export function DocumentTypeModal({ isOpen, onClose, onSave, initialData, title }: DocumentTypeModalProps) {
  const { values, handleChange, handleNestedChange, reset } = useForm<DocumentTypeFormData>(
    initialData || defaultDocumentTypeFormData,
  )
  const [activeTab, setActiveTab] = useState("english")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = () => {
    setError(null)

    // Validate form
    if (!values.name.english.trim()) {
      setError("Name in English is required")
      return
    }

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
    setError(null)
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
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div>
            <Label>
              Name <span className="text-red-500">*</span>
            </Label>
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

              <TabsContent value="english" className="mt-2">
                <Input
                  placeholder="Name"
                  value={values.name.english}
                  onChange={(e) => handleNestedChange("name", "english", e.target.value)}
                  required
                />
              </TabsContent>
              <TabsContent value="korean" className="mt-2">
                <Input
                  placeholder="이름"
                  value={values.name.korean}
                  onChange={(e) => handleNestedChange("name", "korean", e.target.value)}
                />
              </TabsContent>
              <TabsContent value="russian" className="mt-2">
                <Input
                  placeholder="Имя"
                  value={values.name.russian}
                  onChange={(e) => handleNestedChange("name", "russian", e.target.value)}
                />
              </TabsContent>
              <TabsContent value="uzbek" className="mt-2">
                <Input
                  placeholder="Nomi"
                  value={values.name.uzbek}
                  onChange={(e) => handleNestedChange("name", "uzbek", e.target.value)}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Label htmlFor="additionalInfo">Additional information</Label>
            <Textarea
              id="additionalInfo"
              name="additionalInfo"
              value={values.additionalInfo}
              onChange={handleChange}
              className="mt-1 resize-none"
              rows={3}
              placeholder="Additional information"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

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
