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
import { format } from "date-fns";
import { TermsAndConditionsModal } from "./TermsAndConditionsModal";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

const defaultFormData: AcademicProgramFormData = {
  name: "",
  category: "",
  degree_type: "",
  languageRequirement: [],
  documentTypes: [],
  contract_price: "",
  description: { english: "", korean: "", russian: "", uzbek: "" },
  active: true,
  start_date: new Date(),
  end_date: new Date(),
  results_announcement_date: new Date(),
  admissionStart: new Date(),
  admissionEnd: new Date(),
};

interface AcademicProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AcademicProgram) => void;
  title: string;
}

export function AcademicProgramModal({
  isOpen,
  onClose,
  onSave,
  title,
}: AcademicProgramModalProps) {
  const [activeTab, setActiveTab] = useState("english");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [guideFile, setGuideFile] = useState<File | null>(null);
  const [formFile, setFormFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasApplicationFee, setHasApplicationFee] = useState(false);
  const [applicationFee, setApplicationFee] = useState("");
  const [paymentInstructions, setPaymentInstructions] = useState("");

  const {
    values,
    setValues,
    handleChange,
    handleSelectChange,
    handleNestedChange,
    reset,
  } = useForm<AcademicProgramFormData>(defaultFormData);

  const handleRichTextChange = (lang: string, content: string) => {
    handleNestedChange("description", lang, content);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return alert("You are not authenticated.");

    setLoading(true);

    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("field_of_study", values.category);
    formData.append("degree_type", values.degree_type);
    formData.append("contract_price", values.contract_price);
    formData.append("platform_application_fee", hasApplicationFee ? applicationFee : "0.00");
    if (hasApplicationFee && paymentInstructions) {
      formData.append("payment_instructions", paymentInstructions);
    }
    formData.append("about_program", values.description.english);
    formData.append("active", String(values.active));
    formData.append("start_date", format(values.start_date, "yyyy-MM-dd"));
    formData.append("end_date", format(values.end_date, "yyyy-MM-dd"));
    formData.append(
      "admissionStart",
      format(values.admissionStart, "yyyy-MM-dd")
    );
    formData.append("admissionEnd", format(values.admissionEnd, "yyyy-MM-dd"));
    formData.append(
      "results_announcement_date",
      format(values.results_announcement_date, "yyyy-MM-dd")
    );
    formData.append(
      "description",
      JSON.stringify({ en: values.description.english })
    );
    formData.append("documentTypes", JSON.stringify(values.documentTypes));

    if (guideFile) formData.append("application_guide", guideFile);
    if (formFile) formData.append("application_form", formFile);

    values.languageRequirement.forEach((req, index) => {
      formData.append(`requirements[${index}][requirementType]`, "english");
      formData.append(`requirements[${index}][label]`, req.name);
      formData.append(
        `requirements[${index}][note]`,
        req.requirement ? `Minimum ${req.requirement} band` : ""
      );
    });

    values.documentTypes.forEach((doc, index) => {
      const idx = values.languageRequirement.length + index;
      formData.append(`requirements[${idx}][requirementType]`, "document");
      formData.append(`requirements[${idx}][label]`, doc.name);
      formData.append(`requirements[${idx}][note]`, doc.description || "");
      formData.append(`requirements[${idx}][required]`, "true");
    });

    try {
      const res = await fetchWithAuth(
        "/api/programmes/with-requirements/",
        {
          method: "POST",
          body: formData,
        }
      );

      const created = await res.json();

      if (!res.ok || !created?.id) {
        alert("Failed to create program: " + JSON.stringify(created));
        return;
      }

      onSave({
        ...values,
        id: `api-${created.id}`,
        admissionStart: format(values.start_date, "yyyy-MM-dd"),
        admissionEnd: format(values.end_date, "yyyy-MM-dd"),
        results_announcement_date: format(values.results_announcement_date, "yyyy-MM-dd"),
      });
      onClose();
      reset();
      setHasApplicationFee(false);
      setApplicationFee("");
      setPaymentInstructions("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown";
      console.error("POST error", err);
      alert("Unexpected error: " + message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setHasApplicationFee(false);
    setApplicationFee("");
    setPaymentInstructions("");
    onClose();
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
              <Label htmlFor="degree_type">Degree type</Label>
              <Select
                value={values.degree_type}
                onValueChange={(value) =>
                  handleSelectChange("degree_type", value)
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
              <Label htmlFor="contract_price">
                Contract price per semester approximately ($)
              </Label>
              <div className="flex items-center mt-1">
                <span className="bg-gray-100 border border-r-0 rounded-l px-3 py-2">
                  $
                </span>
                <Input
                  id="contract_price"
                  name="contract_price"
                  value={values.contract_price}
                  onChange={handleChange}
                  className="rounded-l-none"
                  type="number"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="hasApplicationFee"
                checked={hasApplicationFee}
                onCheckedChange={(val) => setHasApplicationFee(Boolean(val))}
              />
              <Label htmlFor="hasApplicationFee">This program has an application fee</Label>
            </div>

            {hasApplicationFee && (
              <>
                <div>
                  <Label htmlFor="applicationFee">Application Fee (USD)</Label>
                  <div className="flex items-center mt-1">
                    <span className="bg-gray-100 border border-r-0 rounded-l px-3 py-2">
                      $
                    </span>
                    <Input
                      id="applicationFee"
                      value={applicationFee}
                      onChange={(e) => setApplicationFee(e.target.value)}
                      className="rounded-l-none"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="paymentInstructions">Payment Instructions</Label>
                  <textarea
                    id="paymentInstructions"
                    value={paymentInstructions}
                    onChange={(e) => setPaymentInstructions(e.target.value)}
                    className="w-full mt-1 border border-gray-300 rounded px-3 py-2 min-h-[100px]"
                    placeholder="Provide payment instructions for students (e.g., bank account details, payment methods, etc.)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    These instructions will be shown to students when they apply.
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Admission Start Date *</Label>
              <DatePicker
                selected={values.start_date}
                onChange={(date: Date | null) =>
                  setValues({ ...values, start_date: date ?? new Date() })
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
                onChange={(date: Date | null) =>
                  setValues({ ...values, end_date: date ?? new Date() })
                }
                dateFormat="yyyy-MM-dd"
                className="w-full mt-1 border border-gray-300 rounded px-3 py-2"
                placeholderText="Select end date"
              />
            </div>
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

          <div>
            <Label>Results Announcement Date</Label>
            <DatePicker
              selected={values.results_announcement_date}
              onChange={(date) =>
                setValues({
                  ...values,
                  results_announcement_date: date || new Date(),
                })
              }
              dateFormat="yyyy-MM-dd"
              className="w-full mt-1 border border-gray-300 rounded px-3 py-2"
            />
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

          <div className="flex items-center gap-2">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(val) => setTermsAccepted(Boolean(val))}
            />
            <Label htmlFor="terms">
              I agree to the{" "}
              <button
                type="button"
                onClick={() => setIsTermsModalOpen(true)}
                className="underline text-purple-700 hover:text-purple-900"
              >
                Terms and Conditions
              </button>
            </Label>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-purple-900 hover:bg-purple-800"
              disabled={!termsAccepted || loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8h4z"
                    />
                  </svg>
                  Saving...
                </div>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
      <TermsAndConditionsModal
        open={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />
    </Dialog>
  );
}
