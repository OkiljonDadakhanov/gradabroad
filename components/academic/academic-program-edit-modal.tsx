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
import { AcademicProgram, CATEGORIES, DEGREE_TYPES, TUITION_PERIODS } from "@/types/academic";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
  GraduationCap,
  DollarSign,
  Calendar,
  FileText,
  Languages,
  Info,
  Upload,
  Edit3,
} from "lucide-react";

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
  const [hasApplicationFee, setHasApplicationFee] = useState(
    initialData.platformApplicationFee ? parseFloat(initialData.platformApplicationFee) > 0 : false
  );
  const [applicationFee, setApplicationFee] = useState(
    initialData.platformApplicationFee && parseFloat(initialData.platformApplicationFee) > 0
      ? initialData.platformApplicationFee
      : ""
  );
  const [paymentInstructions, setPaymentInstructions] = useState(
    initialData.paymentInstructions || ""
  );

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
    formData.append("tuition_period", values.tuitionPeriod || "Per Semester");
    formData.append(
      "platformApplicationFee",
      hasApplicationFee ? applicationFee : "0.00"
    );
    if (hasApplicationFee && paymentInstructions) {
      formData.append("payment_instructions", paymentInstructions);
    } else {
      formData.append("payment_instructions", "");
    }
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
      formData.append(`requirements[${idx}][label]`, doc.name);
      formData.append(`requirements[${idx}][note]`, doc.description || "");
      formData.append(`requirements[${idx}][required]`, "true");
      if (doc.sampleFile) {
        formData.append(`requirements[${idx}][sample_document]`, doc.sampleFile);
      }
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
                <Edit3 className="h-5 w-5 text-white" />
              </div>
              Edit Academic Program
            </DialogTitle>
          </DialogHeader>

          {/* Language Tabs */}
          <Tabs defaultValue="english" onValueChange={setActiveTab} className="mt-4">
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
                <Label className="text-sm font-medium text-gray-700">
                  Field of Study <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={values.category}
                  onValueChange={(val) => handleSelectChange("category", val)}
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
                <Label className="text-sm font-medium text-gray-700">
                  Program Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  className="mt-1"
                  placeholder="e.g., Computer Science, Business Administration"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Degree Type</Label>
                  <Select
                    value={values.degreeType}
                    onValueChange={(val) => handleSelectChange("degreeType", val)}
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
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("active", Boolean(checked))
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
                <Label className="text-sm font-medium text-gray-700">
                  Tuition Fee (USD) <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center flex-1">
                    <span className="bg-gray-100 border border-r-0 border-gray-300 rounded-l-md px-3 py-2 text-gray-500">
                      $
                    </span>
                    <Input
                      name="contractPrice"
                      value={values.contractPrice}
                      onChange={handleChange}
                      className="rounded-l-none rounded-r-none border-r-0"
                      type="number"
                      placeholder="0.00"
                    />
                  </div>
                  <Select
                    value={values.tuitionPeriod || "Per Semester"}
                    onValueChange={(val) => handleSelectChange("tuitionPeriod", val)}
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
                  selected={values.admissionStart}
                  onChange={(date) =>
                    setValues({ ...values, admissionStart: date ?? new Date() })
                  }
                  dateFormat="yyyy-MM-dd"
                  className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Admission End <span className="text-red-500">*</span>
                </Label>
                <DatePicker
                  selected={values.admissionEnd}
                  onChange={(date) =>
                    setValues({ ...values, admissionEnd: date ?? new Date() })
                  }
                  dateFormat="yyyy-MM-dd"
                  className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
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
                      results_announcement_date: date ?? new Date(),
                    })
                  }
                  dateFormat="yyyy-MM-dd"
                  className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
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
              onChange={(val) =>
                setValues({ ...values, languageRequirement: val })
              }
            />
          </section>

          {/* Document Requirements Section */}
          <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <DocumentTypeInput
              value={values.documentTypes}
              onChange={(val) => setValues({ ...values, documentTypes: val })}
            />
          </section>

          {/* Program Description Section */}
          <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <SectionHeader
              icon={<Info className="h-5 w-5" />}
              title="Program Description"
              description={`Detailed information (${activeTab})`}
            />
            <RichTextEditor
              value={values.description}
              onChange={handleRichTextChange}
            />
          </section>

          {/* Actions */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleCancel} disabled={loading} className="px-6">
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-purple-700 hover:bg-purple-800 text-white px-8"
                disabled={loading}
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
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
