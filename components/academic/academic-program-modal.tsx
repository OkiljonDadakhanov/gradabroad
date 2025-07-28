"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { format, parseISO } from "date-fns";

const defaultFormData: AcademicProgramFormData = {
  name: "",
  category: "",
  degreeType: "",
  languageRequirement: [],
  contractPrice: "",
  start_date: new Date(),
  end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
  documentTypes: [],
  description: {
    english: "",
    korean: "",
    russian: "",
    uzbek: "",
  },
  active: true,
};

interface AcademicProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AcademicProgram) => void;
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

  const transformedInitialData: AcademicProgramFormData =
    initialData && initialData.start_date && initialData.end_date
      ? {
          ...initialData,
          start_date: parseISO(initialData.start_date),
          end_date: parseISO(initialData.end_date),
        }
      : defaultFormData;

  const {
    values,
    setValues,
    handleChange,
    handleSelectChange,
    handleNestedChange,
    reset,
  } = useForm<AcademicProgramFormData>(transformedInitialData);

  const handleSubmit = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return alert("You are not authenticated.");

    const payload = {
      programme: {
        name: values.name,
        field_of_study: values.category,
        degreeType: values.degreeType,
        duration_years: 4,
        contractPrice: Number(values.contractPrice),
        platformApplicationFee: 0,
        about_program: values.description.english,
        start_date: format(values.start_date, "yyyy-MM-dd"),
        end_date: format(values.end_date, "yyyy-MM-dd"),
        active: values.active,
      },
      requirements: [
        ...values.languageRequirement.map((item) => ({
          requirementType: "english",
          label: item.name,
          required: true,
          min_score: parseFloat(item.requirement),
          note: null,
        })),
        ...values.documentTypes.map((doc) => ({
          requirementType: "document",
          label: doc,
          required: true,
          note: null,
        })),
      ],
    };

    try {
      const res = await fetch(
        "https://api.gradabroad.net/api/programmes/with-requirements/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const error = await res.json();
        console.error("POST error", error);
        alert("Failed to create program: " + JSON.stringify(error));
        return;
      }

      const { programme } = await res.json();
      onSave({ ...values, id: `api-${programme.id}` });
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Admission Start Date *</Label>
              <DatePicker
                selected={values.start_date}
                onChange={(date: Date) =>
                  setValues({ ...values, start_date: date })
                }
                dateFormat="yyyy-MM-dd"
                className="w-full mt-1 border border-gray-300 rounded px-3 py-2"
                placeholderText="Select start date"
              />
            </div>

            <div>
              <Label>Admission End Date *</Label>
              <DatePicker
                selected={values.end_date}
                onChange={(date: Date) =>
                  setValues({ ...values, end_date: date })
                }
                dateFormat="yyyy-MM-dd"
                className="w-full mt-1 border border-gray-300 rounded px-3 py-2"
                placeholderText="Select end date"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="active"
              checked={values.active}
              onCheckedChange={(val) =>
                setValues({ ...values, active: Boolean(val) })
              }
            />
            <Label htmlFor="active">Program is active</Label>
          </div>

          <LanguageRequirementInput
            value={values.languageRequirement}
            onChange={(updated) =>
              setValues({ ...values, languageRequirement: updated })
            }
          />

          <div>
            <Label>Document Types</Label>
            <DocumentTypeInput
              value={values.documentTypes}
              onChange={(updated) =>
                setValues({ ...values, documentTypes: updated })
              }
            />
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
