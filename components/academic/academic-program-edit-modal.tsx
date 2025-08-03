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
import { LanguageRequirementInput } from "./LanguageRequirementInput";
import { DocumentTypeInput } from "./DocumentTypeInput";
import { useForm } from "@/hooks/use-form";
import { AcademicProgram, CATEGORIES, DEGREE_TYPES } from "@/types/academic";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

interface AcademicProgramEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: AcademicProgram;
  onSuccess?: () => void;
}

export function AcademicProgramEditModal({
  isOpen,
  onClose,
  initialData,
  onSuccess,
}: AcademicProgramEditModalProps) {
  const [activeTab, setActiveTab] = useState("english");

  const transformedInitialData = {
    ...initialData,
    admissionStart: parseISO(initialData.admissionStart),
    admissionEnd: parseISO(initialData.admissionEnd),
    results_announcement_date: initialData.results_announcement_date
      ? parseISO(initialData.results_announcement_date)
      : new Date(),
  };

  const {
    values,
    setValues,
    handleChange,
    handleSelectChange,
    handleCheckboxChange,
    handleNestedChange,
    reset,
  } = useForm<AcademicProgram>(transformedInitialData);

  const [loading, setLoading] = useState(false);
  const [guideFile, setGuideFile] = useState<File | null>(null);
  const [formFile, setFormFile] = useState<File | null>(null);

  const handleRichTextChange = (lang: string, content: string) => {
    handleNestedChange("description", lang, content);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return toast.error("Missing access token");

    setLoading(true);

    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("field_of_study", values.category);
    formData.append("degreeType", values.degreeType);
    formData.append("contractPrice", values.contractPrice);
    formData.append(
      "platformApplicationFee",
      values.platformApplicationFee || "0.00"
    );
    formData.append("start_date", format(values.admissionStart, "yyyy-MM-dd"));
    formData.append("end_date", format(values.admissionEnd, "yyyy-MM-dd"));
    formData.append(
      "results_announcement_date",
      format(values.results_announcement_date, "yyyy-MM-dd")
    );
    formData.append("about_program", values.description?.english || "");
    formData.append("active", String(values.active));

    if (guideFile) formData.append("application_guide", guideFile);
    if (formFile) formData.append("application_form", formFile);

    values.languageRequirement.forEach((req, index) => {
      formData.append(`requirements[${index}][requirementType]`, "language");
      formData.append(`requirements[${index}][label]`, req.name);
      formData.append(`requirements[${index}][required]`, "true");
      if (req.requirement) {
        formData.append(`requirements[${index}][min_score]`, req.requirement);
      }
    });

    values.documentTypes.forEach((doc, index) => {
      const idx = values.languageRequirement.length + index;
      formData.append(`requirements[${idx}][requirementType]`, "document");
      formData.append(`requirements[${idx}][label]`, doc);
      formData.append(`requirements[${idx}][required]`, "true");
    });

    const numericId = values.id.replace("api-", "");

    try {
      const res = await fetchWithAuth(
        `https://api.gradabroad.net/api/programmes/with-requirements/${numericId}/`,
        {
          method: "PATCH",
         
          body: formData,
        }
      );

      if (!res.ok) {
        const error = await res.json();
        console.error("PATCH error:", error);
        toast.error("Failed to update academic program.");
        return;
      }

      toast.success("Program updated successfully.");
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while updating.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Edit Academic Program
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="english" onValueChange={setActiveTab}>
          <TabsList className="bg-purple-100 mt-2">
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
            <Label>Field of Study</Label>
            <Select
              value={values.category}
              onValueChange={(val) => handleSelectChange("category", val)}
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
            <Label>Program Name</Label>
            <Input name="name" value={values.name} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Degree Type</Label>
              <Select
                value={values.degreeType}
                onValueChange={(val) => handleSelectChange("degreeType", val)}
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
              <Label>Contract Price ($)</Label>
              <Input
                name="contractPrice"
                value={values.contractPrice}
                onChange={handleChange}
                type="number"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Date</Label>
              <DatePicker
                selected={values.admissionStart}
                onChange={(date) =>
                  setValues({ ...values, admissionStart: date ?? new Date() })
                }
                dateFormat="yyyy-MM-dd"
                className="w-full mt-1 border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <Label>End Date</Label>
              <DatePicker
                selected={values.admissionEnd}
                onChange={(date) =>
                  setValues({ ...values, admissionEnd: date ?? new Date() })
                }
                dateFormat="yyyy-MM-dd"
                className="w-full mt-1 border border-gray-300 rounded px-3 py-2"
              />
            </div>
          </div>

          <div>
            <Label>Results Announcement Date</Label>
            <DatePicker
              selected={values.results_announcement_date}
              onChange={(date) =>
                setValues({
                  ...values,
                  results_announcement_date: date ?? new Date(),
                })
              }
              dateFormat="yyyy-MM-dd"
              className="w-full mt-1 border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <Label>Application Guide (PDF/PNG)</Label>
            <Input
              type="file"
              accept=".pdf,.png"
              onChange={(e) => setGuideFile(e.target.files?.[0] || null)}
            />
          </div>

          <div>
            <Label>Application Form (PDF/PNG)</Label>
            <Input
              type="file"
              accept=".pdf,.png"
              onChange={(e) => setFormFile(e.target.files?.[0] || null)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="active"
              checked={values.active}
              onCheckedChange={(checked) =>
                handleCheckboxChange("active", Boolean(checked))
              }
            />
            <Label htmlFor="active">Program is active</Label>
          </div>

          <div>
            <Label>Language Requirements</Label>
            <LanguageRequirementInput
              value={values.languageRequirement}
              onChange={(val) =>
                setValues({ ...values, languageRequirement: val })
              }
            />
          </div>

          <div>
            <Label>Document Requirements</Label>
            <DocumentTypeInput
              value={values.documentTypes}
              onChange={(val) => setValues({ ...values, documentTypes: val })}
            />
          </div>

          <div>
            <Label>About Program ({activeTab})</Label>
            <RichTextEditor
              value={values.description}
              onChange={handleRichTextChange}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={loading}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-purple-900 hover:bg-purple-800 text-white"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
