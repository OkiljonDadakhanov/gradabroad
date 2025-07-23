"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

interface Props {
  value: string[];
  onChange: (value: string[]) => void;
}

const DOCUMENT_GROUPS: Record<string, string[]> = {
  "General Application Documents": [
    "Personal Statement or Statement of Purpose",
    "Study Plan",
    "Recommendation Letters",
    "Passport Copy",
    "Passport-size Photos",
  ],
  "Academic Documents": [
    "High School Diploma and Transcript",
    "Bachelor’s Degree Certificate and Transcript",
    "Master’s Degree Certificate and Transcript",
    "Apostille Certification",
  ],
  "Financial Documents": [
    "Certificate of Bank Balance",
    "Letter of Financial Support",
    "Certificate of Family Relationship",
  ],
  "Health and Identification Documents": [
    "Medical Examination Report",
    "Copy of National ID Card or Birth Certificate",
    "Apostille Certification of Birth Certificate",
  ],
  "Administrative Documents": [
    "Application Fee Payment Receipt",
    "Additional Documents Required by Specific Universities or Majors",
  ],
};

export function DocumentTypeInput({ value, onChange }: Props) {
  const [customDoc, setCustomDoc] = useState("");

  const isSelected = (name: string) =>
    value.some((v) => v.toLowerCase() === name.toLowerCase());

  const toggleDocument = (name: string) => {
    if (isSelected(name)) {
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
    <div className="space-y-5">
      <Label className="text-base">Document Requirements</Label>

      {/* Accordion Groups */}
      <Accordion type="multiple" className="border rounded-md bg-white">
        {Object.entries(DOCUMENT_GROUPS).map(([group, docs]) => (
          <AccordionItem key={group} value={group}>
            <AccordionTrigger className="px-4 py-2 bg-gray-100 text-sm font-semibold">
              {group}
            </AccordionTrigger>
            <AccordionContent className="p-4 space-y-2">
              {docs.map((doc) => (
                <div key={doc} className="flex items-center space-x-2">
                  <Checkbox
                    id={doc}
                    checked={isSelected(doc)}
                    onCheckedChange={() => toggleDocument(doc)}
                  />
                  <label
                    htmlFor={doc}
                    className="text-sm cursor-pointer leading-none"
                  >
                    {doc}
                  </label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Custom Document Entry */}
      <div className="border-t pt-4">
        <Label className="block mb-1 text-sm font-semibold">
          Add Custom Document
        </Label>
        <div className="flex gap-2">
          <Input
            placeholder="e.g. Certificate of Employment"
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

      {/* Selected Document List */}
      {value.length > 0 && (
        <div className="mt-4">
          <Label className="mb-1 text-sm font-semibold">
            Selected Documents:
          </Label>
          <ul className="space-y-1">
            {value.map((item, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-purple-50 rounded px-3 py-1 text-sm border"
              >
                <span>{item}</span>
                <button
                  onClick={() => handleRemove(item)}
                  className="text-red-500 text-xs hover:underline"
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
