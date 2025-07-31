"use client";

import { useState, useEffect } from "react";
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
import { useForm } from "@/hooks/use-form";
import type { Scholarship, ScholarshipFormData } from "@/types/scholarship";
import type { AcademicProgram } from "@/types/academic";

interface ScholarshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Scholarship) => void;
  initialData?: Scholarship;
  title: string;
  programs: AcademicProgram[];
}

const defaultFormData: ScholarshipFormData = {
  programme_id: "",
  name: "",
  coverage: "",
  eligibility_criteria: "",
  application_deadline: new Date(),
};

export function ScholarshipModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  title,
  programs,
}: ScholarshipModalProps) {
  const transformedInitial: ScholarshipFormData = initialData
    ? {
        programme_id: String(initialData.programme_id),
        name: initialData.name,
        coverage: initialData.coverage,
        eligibility_criteria: initialData.eligibility_criteria,
        application_deadline: new Date(initialData.application_deadline),
      }
    : defaultFormData;

  const { values, setValues, handleChange, handleSelectChange, reset } =
    useForm<ScholarshipFormData>(transformedInitial);

  const handleCancel = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return alert("You are not authenticated");

    const payload = {
      ...values,
      programme_id: Number(values.programme_id),
      application_deadline: values.application_deadline
        .toISOString()
        .split("T")[0],
    };

    const isEdit = Boolean(initialData?.id);
    const url = isEdit
      ? `https://api.gradabroad.net/api/scholarships/${initialData!.id}/`
      : "https://api.gradabroad.net/api/scholarships/";

    try {
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Error response:", error);
        alert("Failed to save scholarship: " + JSON.stringify(error));
        return;
      }

      const result = await res.json();
      onSave(result);
      onClose();
    } catch (err) {
      console.error("Submit error:", err);
      alert("An error occurred while saving the scholarship.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div>
            <Label>Academic Program *</Label>
            <select
              value={values.programme_id}
              onChange={(e) =>
                handleSelectChange("programme_id", e.target.value)
              }
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select program</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Name of Scholarship *</Label>
            <Input
              name="name"
              value={values.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label>Coverage *</Label>
            <Input
              name="coverage"
              value={values.coverage}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label>Eligibility Criteria *</Label>
            <Input
              name="eligibility_criteria"
              value={values.eligibility_criteria}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label>Application Deadline *</Label>
            <DatePicker
              selected={values.application_deadline}
              onChange={(date: Date) =>
                setValues({ ...values, application_deadline: date })
              }
              dateFormat="yyyy-MM-dd"
              className="w-full mt-1 border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-purple-900 text-white">
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
