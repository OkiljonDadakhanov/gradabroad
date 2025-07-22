"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  value: string[];
  onChange: (value: string[]) => void;
}

const BUILTIN_DOCUMENTS = [
  "Personal Statement or Statement of Purpose",
  "Study Plan",
  "Recommendation Letters",
  "Passport Copy",
  "Passport-size Photos",
  "High School Diploma and Transcript",
  "Bachelor’s Degree Certificate and Transcript",
  "Master’s Degree Certificate and Transcript",
  "Proof of English or Korean Language Proficiency",
  "Certificate of Bank Balance",
  "Letter of Financial Support",
  "Copy of Parents’ Passports or National IDs",
  "Certificate of Family Relationship",
  "Medical Examination Report",
  "Copy of National ID Card or Birth Certificate",
  "Application Fee Payment Receipt",
  "Portfolio (for Art/Design programs)",
];

export function DocumentTypeInput({ value, onChange }: Props) {
  const [customDoc, setCustomDoc] = useState("");

  const isSelected = (name: string) =>
    value.map((v) => v.toLowerCase()).includes(name.toLowerCase());

  const toggleDocument = (name: string) => {
    const exists = isSelected(name);
    if (exists) {
      onChange(value.filter((v) => v.toLowerCase() !== name.toLowerCase()));
    } else {
      onChange([...value, name]);
    }
  };

  const handleAddCustom = () => {
    const trimmed = customDoc.trim();
    if (!trimmed || isSelected(trimmed)) return;
    onChange([...value, trimmed]);
    setCustomDoc("");
  };

  const handleRemove = (name: string) => {
    onChange(value.filter((v) => v.toLowerCase() !== name.toLowerCase()));
  };

  return (
    <div className="space-y-3">
      <Label className="block">Select Required Documents</Label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {BUILTIN_DOCUMENTS.map((doc) => (
          <label
            key={doc}
            className="flex items-center gap-2 text-sm bg-purple-50 rounded p-2 cursor-pointer border border-purple-200"
          >
            <input
              type="checkbox"
              checked={isSelected(doc)}
              onChange={() => toggleDocument(doc)}
            />
            {doc}
          </label>
        ))}
      </div>

      {/* Custom Document Entry */}
      <div className="border-t pt-4 mt-2">
        <Label className="block mb-1 text-sm font-semibold">
          Add Custom Document
        </Label>
        <div className="flex gap-2">
          <Input
            placeholder="Custom Document (e.g. Motivation Letter)"
            value={customDoc}
            onChange={(e) => setCustomDoc(e.target.value)}
          />
          <Button
            onClick={handleAddCustom}
            className="bg-purple-900 hover:bg-purple-800"
          >
            Add
          </Button>
        </div>
      </div>

      {/* Selected Documents */}
      {value.length > 0 && (
        <div className="mt-4">
          <Label className="mb-1 text-sm">Selected:</Label>
          <ul className="space-y-1 mt-2">
            {value.map((item, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-purple-100 rounded px-3 py-1 text-sm"
              >
                <span>{item}</span>
                <button
                  onClick={() => handleRemove(item)}
                  className="text-red-600 text-xs hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
