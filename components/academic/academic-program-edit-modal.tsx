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
import { Checkbox } from "@/components/ui/checkbox";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { useForm } from "@/hooks/use-form";
import type { AcademicProgram } from "@/types/academic";
import { toast } from "sonner";
import { LanguageRequirementInput } from "./LanguageRequirementInput";
import { DocumentTypeInput } from "./DocumentTypeInput";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Assuming you use a wrapper

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
  const {
    values,
    handleChange,
    handleCheckboxChange,
    handleNestedChange,
    setValues,
    reset,
  } = useForm<AcademicProgram>(initialData);

  const [loading, setLoading] = useState(false);

  const handleRichTextChange = (lang: string, content: string) => {
    handleNestedChange("description", lang, content);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return toast.error("Missing access token");

    setLoading(true);

    const requirements = [
      ...(values.languageRequirement || []).map((req) => ({
        requirementType: "language",
        label: req.name,
        required: true,
        min_score: req.requirement ? parseFloat(req.requirement) : null,
        note: "",
      })),
      ...(values.documentTypes || []).map((doc) => ({
        requirementType: "document",
        label: doc,
        required: true,
      })),
    ];

    const body = {
      programme: {
        name: values.name,
        field_of_study: values.category,
        degreeType: values.degreeType,
        contractPrice: values.contractPrice,
        platformApplicationFee: values.platformApplicationFee || "0.00",
        start_date: values.admissionStart || null,
        end_date: values.admissionEnd || null,
        about_program: values.description?.english || "",
        active: values.active,
      },
      requirements,
    };

    const numericId = values.id.replace("api-", "");

    try {
      const res = await fetch(
        `https://api.gradabroad.net/api/programmes/with-requirements/${numericId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
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
          <DialogTitle>Edit Academic Program</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input name="name" value={values.name} onChange={handleChange} />
          </div>
          <div>
            <Label>Field of Study</Label>
            <Input
              name="category"
              value={values.category}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Degree Type</Label>
            <Input
              name="degreeType"
              value={values.degreeType}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Contract Price (USD)</Label>
            <Input
              name="contractPrice"
              value={values.contractPrice}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Platform Application Fee (USD)</Label>
            <Input
              name="platformApplicationFee"
              value={values.platformApplicationFee || ""}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Start Date</Label>
              <DatePicker
                selected={
                  values.admissionStart ? new Date(values.admissionStart) : null
                }
                onChange={(date: Date | null) =>
                  handleChange({
                    target: {
                      name: "admissionStart",
                      value: date ? date.toISOString().split("T")[0] : "",
                    },
                  } as any)
                }
                dateFormat="yyyy-MM-dd"
              />
            </div>
            <div>
              <Label>End Date</Label>
              <DatePicker
                selected={
                  values.admissionEnd ? new Date(values.admissionEnd) : null
                }
                onChange={(date: Date | null) =>
                  handleChange({
                    target: {
                      name: "admissionEnd",
                      value: date ? date.toISOString().split("T")[0] : "",
                    },
                  } as any)
                }
                dateFormat="yyyy-MM-dd"
              />
            </div>
          </div>

          <div>
            <Label>About Program (English)</Label>
            <RichTextEditor
              value={values.description}
              onChange={handleRichTextChange}
            />
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

          <div className="flex items-center gap-2">
            <Checkbox
              checked={values.active}
              onCheckedChange={(checked) =>
                handleCheckboxChange("active", checked as boolean)
              }
              id="active"
            />
            <Label htmlFor="active">Program is active</Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button onClick={handleCancel} variant="outline" disabled={loading}>
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
