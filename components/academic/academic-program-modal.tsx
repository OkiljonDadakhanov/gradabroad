"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { LanguageRequirementInput } from "@/components/academic/LanguageRequirementInput";
import { DocumentTypeInput } from "@/components/academic/DocumentTypeInput";
import { useForm } from "@/hooks/use-form";
import {
  type AcademicProgram,
  type AcademicProgramFormData,
  CATEGORIES,
  DEGREE_TYPES,
} from "@/types/academic";
import { format } from "date-fns";

const defaultFormData: AcademicProgramFormData = {
  name: "",
  category: "",
  degreeType: "",
  languageRequirement: [],
  contractPrice: "",
  admissionStart: format(new Date(), "dd/MM/yyyy"),
  admissionEnd: format(
    new Date(new Date().setMonth(new Date().getMonth() + 1)),
    "dd/MM/yyyy"
  ),
  documentTypes: [],
  description: {
    english: "",
    korean: "",
    russian: "",
    uzbek: "",
  },
};

interface AcademicProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AcademicProgram | AcademicProgramFormData) => void;
  initialData?: AcademicProgram;
  title: string;
}

export function AcademicProgramModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  title,
}: AcademicProgramModalProps) {
  const [activeTab, setActiveTab] = useState("english");

  const {
    values,
    setValues,
    handleChange,
    handleSelectChange,
    handleNestedChange,
    reset,
  } = useForm<AcademicProgramFormData>(initialData || defaultFormData);

  const handleSubmit = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("You are not authenticated.");
      return;
    }

    const payload = {
      university: 36,
      code: values.category || "UNKNOWN",
      degree_level: values.degreeType,
      major: values.name,
      duration_years: 4,
      tuition_fee: values.contractPrice,
      platform_application_fee: "0.00",
      active: true,
      translations: [],
    };

    try {
      const res = await fetch("https://api.gradabroad.net/api/programmes/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Failed to create program", error);
        alert(error.detail || "Something went wrong");
        return;
      }

      const newProgram = await res.json();
      onSave({
        ...values,
        id: `api-${newProgram.id}`,
      });
      onClose();
    } catch (err) {
      console.error("POST error", err);
      alert("An error occurred while saving the program.");
    }
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  const handleRichTextChange = (lang: string, content: string) => {
    handleNestedChange("description", lang, content);
  };

  const handleDateChange = (
    field: "admissionStart" | "admissionEnd",
    date: Date | undefined
  ) => {
    if (date) {
      setValues({
        ...values,
        [field]: format(date, "dd/MM/yyyy"),
      });
    }
  };

  const parseDate = (dateString: string): Date => {
    const [day, month, year] = dateString.split("/").map(Number);
    return new Date(year, month - 1, day);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="english"
          className="mt-2"
          onValueChange={setActiveTab}
        >
          <TabsList className="bg-purple-100">
            {["english", "korean", "russian", "uzbek"].map((lang) => (
              <TabsTrigger
                key={lang}
                value={lang}
                className="data-[state=active]:bg-purple-700 data-[state=active]:text-white"
              >
                {lang === "english"
                  ? "English"
                  : lang === "korean"
                  ? "한국어"
                  : lang === "russian"
                  ? "Русский"
                  : "O'zbek"}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="space-y-6 mt-4">
          <div>
            <Label htmlFor="category">Fields of studies *</Label>
            <Select
              value={values.category}
              onValueChange={(value) => handleSelectChange("category", value)}
            >
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
            <Label htmlFor="name">Name of the academic program *</Label>
            <Input
              id="name"
              name="name"
              value={values.name}
              onChange={handleChange}
              className="mt-1"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="degreeType">Degree type</Label>
              <Select
                value={values.degreeType}
                onValueChange={(value) =>
                  handleSelectChange("degreeType", value)
                }
              >
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
              <Label htmlFor="contractPrice">
                Contract price per semester ($)
              </Label>
              <div className="flex items-center mt-1">
                <span className="bg-gray-100 border border-r-0 rounded-l px-3 py-2">
                  $
                </span>
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
            <LanguageRequirementInput
              value={values.languageRequirement}
              onChange={(updated) =>
                setValues({ ...values, languageRequirement: updated })
              }
            />
          </div>

          <div>
            <Label>Admission period</Label>
            <div className="grid grid-cols-2 gap-4 mt-1">
              {["admissionStart", "admissionEnd"].map((field) => (
                <div key={field}>
                  <Label className="text-sm text-gray-500">
                    {field === "admissionStart" ? "From" : "To"}
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal mt-1"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {values[field]}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={parseDate(values[field])}
                        onSelect={(date) =>
                          handleDateChange(field as any, date)
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Document Types</Label>
            <DocumentTypeInput
              value={values.documentTypes}
              onChange={(updated) =>
                setValues({ ...values, documentTypes: updated })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Application Guide Download (English)</Label>
              <Input type="file" />
            </div>
            <div>
              <Label>Application Form Download (English)</Label>
              <Input type="file" />
            </div>
          </div>

          <div>
            <Label>About the program</Label>
            <RichTextEditor
              value={values.description}
              onChange={handleRichTextChange}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-purple-900 hover:bg-purple-800"
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
