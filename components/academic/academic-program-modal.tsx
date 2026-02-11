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
  TUITION_PERIODS,
} from "@/types/academic";
import { format } from "date-fns";
import { TermsAndConditionsModal } from "./TermsAndConditionsModal";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
  GraduationCap,
  DollarSign,
  Calendar,
  FileText,
  Languages,
  ClipboardList,
  Info,
  Upload,
} from "lucide-react";

const defaultFormData: AcademicProgramFormData = {
  name: "",
  category: "",
  degree_type: "",
  languageRequirement: [],
  documentTypes: [],
  contractPrice: "",
  tuitionPeriod: "Per Semester",
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
    formData.append("degreeType", values.degreeType);
    formData.append("contractPrice", values.contractPrice);
    formData.append("tuition_period", values.tuitionPeriod || "Per Semester");
    formData.append("platformApplicationFee", hasApplicationFee ? applicationFee : "0.00");
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
      if (doc.sampleFile) {
        formData.append(`requirements[${idx}][sample_document]`, doc.sampleFile);
      }
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

  const SectionHeader = ({ icon, title, description }: { icon: React.ReactNode; title: string; description?: string }) => (
    <div className="flex items-center gap-3 pb-3 border-b border-gray-200 mb-4">
      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-700">
        {icon}
      </div>
      <div>
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b px-6 py-4">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              {title}
            </DialogTitle>
          </DialogHeader>

          {/* Language Tabs */}
          <Tabs
            defaultValue="english"
            className="mt-4"
            onValueChange={setActiveTab}
          >
            <TabsList className="bg-purple-50 p-1">
              {["english", "korean", "russian", "uzbek"].map((lang) => (
                <TabsTrigger
                  key={lang}
                  value={lang}
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-md px-4"
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
        </div>

        <div className="px-6 py-6 space-y-8">
          {/* Basic Information Section */}
          <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <SectionHeader
              icon={<GraduationCap className="h-5 w-5" />}
              title="Program Information"
              description="Basic details about the academic program"
            />

            <div className="space-y-4">
              <div>
                <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                  Field of Study <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={values.category}
                  onValueChange={(value) => handleSelectChange("category", value)}
                >
                  <SelectTrigger className="mt-1">
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
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Program Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  className="mt-1"
                  placeholder="e.g., Computer Science, Business Administration"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="degreeType" className="text-sm font-medium text-gray-700">
                    Degree Type
                  </Label>
                  <Select
                    value={values.degreeType}
                    onValueChange={(value) =>
                      handleSelectChange("degreeType", value)
                    }
                  >
                    <SelectTrigger className="mt-1">
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
                  <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Checkbox
                      id="active"
                      checked={values.active}
                      onCheckedChange={(val) =>
                        setValues({ ...values, active: Boolean(val) })
                      }
                    />
                    Program is Active
                  </Label>
                  <p className="text-xs text-gray-500 mt-2 ml-6">
                    Active programs are visible to applicants
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <SectionHeader
              icon={<DollarSign className="h-5 w-5" />}
              title="Pricing & Fees"
              description="Set tuition and application fees"
            />

            <div className="space-y-4">
              <div>
                <Label htmlFor="contractPrice" className="text-sm font-medium text-gray-700">
                  Tuition Fee (USD) <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center flex-1">
                    <span className="bg-gray-100 border border-r-0 border-gray-300 rounded-l-md px-3 py-2 text-gray-500">
                      $
                    </span>
                    <Input
                      id="contractPrice"
                      name="contractPrice"
                      value={values.contractPrice}
                      onChange={handleChange}
                      className="rounded-l-none rounded-r-none border-r-0"
                      type="number"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <Select
                    value={values.tuitionPeriod}
                    onValueChange={(value) => handleSelectChange("tuitionPeriod", value)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Period" />
                    </SelectTrigger>
                    <SelectContent>
                      {TUITION_PERIODS.map((period) => (
                        <SelectItem key={period} value={period}>
                          {period}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="hasApplicationFee"
                    checked={hasApplicationFee}
                    onCheckedChange={(val) => setHasApplicationFee(Boolean(val))}
                    className="data-[state=checked]:bg-purple-600"
                  />
                  <div>
                    <Label htmlFor="hasApplicationFee" className="text-sm font-medium text-gray-900 cursor-pointer">
                      This program has an application fee
                    </Label>
                    <p className="text-xs text-gray-500">Students will be required to pay before submitting</p>
                  </div>
                </div>

                {hasApplicationFee && (
                  <div className="mt-4 pl-7 space-y-4 border-l-2 border-purple-200">
                    <div>
                      <Label htmlFor="applicationFee" className="text-sm font-medium text-gray-700">
                        Application Fee (USD)
                      </Label>
                      <div className="flex items-center mt-1">
                        <span className="bg-gray-100 border border-r-0 border-gray-300 rounded-l-md px-3 py-2 text-gray-500">
                          $
                        </span>
                        <Input
                          id="applicationFee"
                          value={applicationFee}
                          onChange={(e) => setApplicationFee(e.target.value)}
                          className="rounded-l-none max-w-[200px]"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="paymentInstructions" className="text-sm font-medium text-gray-700">
                        Payment Instructions
                      </Label>
                      <textarea
                        id="paymentInstructions"
                        value={paymentInstructions}
                        onChange={(e) => setPaymentInstructions(e.target.value)}
                        className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 min-h-[80px] text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Bank details, payment methods, etc."
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Dates Section */}
          <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <SectionHeader
              icon={<Calendar className="h-5 w-5" />}
              title="Important Dates"
              description="Application period and result announcement"
            />

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Admission Start <span className="text-red-500">*</span>
                </Label>
                <DatePicker
                  selected={values.start_date}
                  onChange={(date: Date) =>
                    setValues({ ...values, start_date: date })
                  }
                  dateFormat="yyyy-MM-dd"
                  className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
                  placeholderText="Start date"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Admission End <span className="text-red-500">*</span>
                </Label>
                <DatePicker
                  selected={values.end_date}
                  onChange={(date: Date) =>
                    setValues({ ...values, end_date: date })
                  }
                  dateFormat="yyyy-MM-dd"
                  className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
                  placeholderText="End date"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Results Announcement
                </Label>
                <DatePicker
                  selected={values.results_announcement_date}
                  onChange={(date) =>
                    setValues({
                      ...values,
                      results_announcement_date: date || new Date(),
                    })
                  }
                  dateFormat="yyyy-MM-dd"
                  className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
                  placeholderText="Announcement date"
                />
              </div>
            </div>
          </section>

          {/* Application Materials Section */}
          <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <SectionHeader
              icon={<Upload className="h-5 w-5" />}
              title="Application Materials"
              description="Upload guides and forms for applicants"
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Application Guide
                </Label>
                <Input
                  type="file"
                  accept=".pdf,.png"
                  onChange={(e) => setGuideFile(e.target.files?.[0] || null)}
                  className="text-sm"
                />
                <p className="text-xs text-gray-400 mt-2">PDF or PNG, max 10MB</p>
                {guideFile && (
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {guideFile.name}
                  </p>
                )}
              </div>

              <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Application Form
                </Label>
                <Input
                  type="file"
                  accept=".pdf,.png"
                  onChange={(e) => setFormFile(e.target.files?.[0] || null)}
                  className="text-sm"
                />
                <p className="text-xs text-gray-400 mt-2">PDF or PNG, max 10MB</p>
                {formFile && (
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {formFile.name}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Language Requirements Section */}
          <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <SectionHeader
              icon={<Languages className="h-5 w-5" />}
              title="Language Requirements"
              description="Set language proficiency requirements"
            />
            <LanguageRequirementInput
              value={values.languageRequirement}
              onChange={(updated) =>
                setValues({ ...values, languageRequirement: updated })
              }
            />
          </section>

          {/* Document Requirements Section */}
          <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <DocumentTypeInput
              value={values.documentTypes}
              onChange={(updated) =>
                setValues({ ...values, documentTypes: updated })
              }
            />
          </section>

          {/* Program Description Section */}
          <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <SectionHeader
              icon={<Info className="h-5 w-5" />}
              title="Program Description"
              description="Detailed information about the program"
            />
            <RichTextEditor
              value={values.description}
              onChange={handleRichTextChange}
            />
          </section>

          {/* Terms and Actions */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
            <div className="flex items-start gap-3 mb-4">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(val) => setTermsAccepted(Boolean(val))}
                className="mt-0.5 data-[state=checked]:bg-purple-600"
              />
              <div>
                <Label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={() => setIsTermsModalOpen(true)}
                    className="text-purple-700 hover:text-purple-900 underline font-medium"
                  >
                    Terms and Conditions
                  </button>
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  By creating this program, you confirm all information is accurate.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button variant="outline" onClick={handleCancel} className="px-6">
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-purple-700 hover:bg-purple-800 px-8"
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
                  "Create Program"
                )}
              </Button>
            </div>
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
