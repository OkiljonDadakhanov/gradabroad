"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { DocumentRequirement } from "@/types/academic";

interface Props {
  value: DocumentRequirement[];
  onChange: (value: DocumentRequirement[]) => void;
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
    "Bachelor's Degree Certificate and Transcript",
    "Master's Degree Certificate and Transcript",
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

  const findDocument = (name: string) =>
    value.find((v) => v.name.toLowerCase() === name.toLowerCase());

  const isSelected = (name: string) => !!findDocument(name);

  const toggleDocument = (name: string) => {
    if (isSelected(name)) {
      onChange(value.filter((v) => v.name.toLowerCase() !== name.toLowerCase()));
    } else {
      onChange([...value, { name, description: "" }]);
    }
  };

  const updateDescription = (name: string, description: string) => {
    onChange(
      value.map((v) =>
        v.name.toLowerCase() === name.toLowerCase()
          ? { ...v, description }
          : v
      )
    );
  };

  const handleAddCustom = () => {
    const trimmed = customDoc.trim();
    if (!trimmed || isSelected(trimmed)) return;
    onChange([...value, { name: trimmed, description: "" }]);
    setCustomDoc("");
  };

  const handleRemove = (name: string) => {
    onChange(value.filter((v) => v.name.toLowerCase() !== name.toLowerCase()));
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
            <AccordionContent className="p-4 space-y-3">
              {docs.map((doc) => {
                const selected = isSelected(doc);
                const docData = findDocument(doc);
                return (
                  <div key={doc} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={doc}
                        checked={selected}
                        onCheckedChange={() => toggleDocument(doc)}
                      />
                      <label
                        htmlFor={doc}
                        className="text-sm cursor-pointer leading-none"
                      >
                        {doc}
                      </label>
                    </div>
                    {selected && (
                      <div className="ml-6">
                        <Textarea
                          placeholder={`Specify requirements for ${doc} (e.g., format, content guidelines, specific details needed)`}
                          value={docData?.description || ""}
                          onChange={(e) => updateDescription(doc, e.target.value)}
                          className="text-sm min-h-[60px]"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
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
          <Label className="mb-2 text-sm font-semibold block">
            Selected Documents:
          </Label>
          <ul className="space-y-3">
            {value.map((item, index) => (
              <li
                key={index}
                className="bg-purple-50 rounded px-3 py-3 text-sm border space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{item.name}</span>
                  <button
                    onClick={() => handleRemove(item.name)}
                    className="text-red-500 text-xs hover:underline"
                  >
                    Remove
                  </button>
                </div>
                <Textarea
                  placeholder={`Describe what should be included in this ${item.name} (e.g., required format, specific content, page limits)`}
                  value={item.description}
                  onChange={(e) => updateDescription(item.name, e.target.value)}
                  className="text-sm min-h-[60px] bg-white"
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
