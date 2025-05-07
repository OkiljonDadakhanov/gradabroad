"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiSelect } from "@/components/ui/multi-select"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { useForm } from "@/hooks/use-form"
import {
  type AcademicProgram,
  type AcademicProgramFormData,
  CATEGORIES,
  DEGREE_TYPES,
  DOCUMENT_TYPES,
} from "@/types/academic"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

interface AcademicProgramModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: AcademicProgram | AcademicProgramFormData) => void
  initialData?: AcademicProgram
  title: string
}

const defaultFormData: AcademicProgramFormData = {
  name: "",
  category: "",
  degreeType: "",
  languageRequirement: "English",
  contractPrice: "",
  admissionStart: format(new Date(), "dd/MM/yyyy"),
  admissionEnd: format(new Date(new Date().setMonth(new Date().getMonth() + 1)), "dd/MM/yyyy"),
  documentTypes: [],
  description: {
    english: "",
    korean: "",
    russian: "",
    uzbek: "",
  },
}

export function AcademicProgramModal({ isOpen, onClose, onSave, initialData, title }: AcademicProgramModalProps) {
  const [activeTab, setActiveTab] = useState("english")

  const { values, setValues, handleChange, handleSelectChange, handleNestedChange, reset } =
    useForm<AcademicProgramFormData>(initialData || defaultFormData)

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

  const handleDateChange = (field: "admissionStart" | "admissionEnd", date: Date | undefined) => {
    if (date) {
      setValues({
        ...values,
        [field]: format(date, "dd/MM/yyyy"),
      })
    }
  }

  const parseDate = (dateString: string): Date => {
    const [day, month, year] = dateString.split("/").map(Number)
    return new Date(year, month - 1, day)
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

        <Tabs defaultValue="english" className="mt-2" onValueChange={setActiveTab}>
          <TabsList className="bg-purple-100">
            <TabsTrigger value="english" className="data-[state=active]:bg-purple-700 data-[state=active]:text-white">
              English
            </TabsTrigger>
            <TabsTrigger value="korean" className="data-[state=active]:bg-purple-700 data-[state=active]:text-white">
              한국어
            </TabsTrigger>
            <TabsTrigger value="russian" className="data-[state=active]:bg-purple-700 data-[state=active]:text-white">
              Русский
            </TabsTrigger>
            <TabsTrigger value="uzbek" className="data-[state=active]:bg-purple-700 data-[state=active]:text-white">
              O'zbek
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-6 mt-4">
          <div>
            <Label htmlFor="name">Name of the academic program *</Label>
            <Input id="name" name="name" value={values.name} onChange={handleChange} className="mt-1" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={values.category} onValueChange={(value) => handleSelectChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="languageRequirement">Language requirement</Label>
              <Input
                id="languageRequirement"
                name="languageRequirement"
                value={values.languageRequirement}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="contractPrice">Contract price per semester($) *</Label>
              <div className="flex items-center mt-1">
                <span className="bg-gray-100 border border-r-0 rounded-l px-3 py-2">$</span>
                <Input
                  id="contractPrice"
                  name="contractPrice"
                  value={values.contractPrice}
                  onChange={handleChange}
                  className="rounded-l-none"
                  type="number"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <Label>Admission period</Label>
            <div className="grid grid-cols-2 gap-4 mt-1">
              <div>
                <Label htmlFor="admissionStart" className="text-sm text-gray-500">
                  From
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal mt-1">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {values.admissionStart}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={parseDate(values.admissionStart)}
                      onSelect={(date) => handleDateChange("admissionStart", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="admissionEnd" className="text-sm text-gray-500">
                  To
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal mt-1">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {values.admissionEnd}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={parseDate(values.admissionEnd)}
                      onSelect={(date) => handleDateChange("admissionEnd", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="documentTypes">Document types</Label>
            <MultiSelect
              options={DOCUMENT_TYPES.map((type) => ({ label: type, value: type }))}
              selected={values.documentTypes}
              onChange={(selected) => setValues({ ...values, documentTypes: selected })}
              placeholder="Select required documents"
              className="mt-1"
            />
          </div>

          <div>
            <Label>About the program</Label>
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

