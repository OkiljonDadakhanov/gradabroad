"use client";

import { useState, useRef } from "react";
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
import {
  FileText,
  GraduationCap,
  DollarSign,
  Heart,
  ClipboardList,
  Upload,
  X,
  File,
  Plus,
  Trash2,
  ChevronDown,
  FileCheck,
} from "lucide-react";

interface Props {
  value: DocumentRequirement[];
  onChange: (value: DocumentRequirement[]) => void;
}

interface DocumentGroup {
  name: string;
  icon: React.ReactNode;
  documents: string[];
}

const DOCUMENT_GROUPS: DocumentGroup[] = [
  {
    name: "General Application Documents",
    icon: <FileText className="h-4 w-4" />,
    documents: [
      "Personal Statement or Statement of Purpose",
      "Study Plan",
      "Recommendation Letters",
      "Passport Copy",
      "Passport-size Photos",
    ],
  },
  {
    name: "Academic Documents",
    icon: <GraduationCap className="h-4 w-4" />,
    documents: [
      "High School Diploma and Transcript",
      "Bachelor's Degree Certificate and Transcript",
      "Master's Degree Certificate and Transcript",
      "Apostille Certification",
    ],
  },
  {
    name: "Financial Documents",
    icon: <DollarSign className="h-4 w-4" />,
    documents: [
      "Certificate of Bank Balance",
      "Letter of Financial Support",
      "Certificate of Family Relationship",
    ],
  },
  {
    name: "Health and Identification Documents",
    icon: <Heart className="h-4 w-4" />,
    documents: [
      "Medical Examination Report",
      "Copy of National ID Card or Birth Certificate",
      "Apostille Certification of Birth Certificate",
    ],
  },
  {
    name: "Administrative Documents",
    icon: <ClipboardList className="h-4 w-4" />,
    documents: [
      "Application Fee Payment Receipt",
      "Additional Documents Required by Specific Universities or Majors",
    ],
  },
];

export function DocumentTypeInput({ value, onChange }: Props) {
  const [customDoc, setCustomDoc] = useState("");
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const findDocument = (name: string) =>
    value.find((v) => v.name.toLowerCase() === name.toLowerCase());

  const isSelected = (name: string) => !!findDocument(name);

  const toggleDocument = (name: string) => {
    if (isSelected(name)) {
      onChange(value.filter((v) => v.name.toLowerCase() !== name.toLowerCase()));
      if (expandedDoc === name) setExpandedDoc(null);
    } else {
      onChange([...value, { name, description: "", sampleFile: null }]);
      setExpandedDoc(name);
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

  const updateSampleFile = (name: string, file: File | null) => {
    onChange(
      value.map((v) =>
        v.name.toLowerCase() === name.toLowerCase()
          ? { ...v, sampleFile: file, sampleFileUrl: file ? undefined : v.sampleFileUrl }
          : v
      )
    );
  };

  const handleAddCustom = () => {
    const trimmed = customDoc.trim();
    if (!trimmed || isSelected(trimmed)) return;
    onChange([...value, { name: trimmed, description: "", sampleFile: null }]);
    setCustomDoc("");
    setExpandedDoc(trimmed);
  };

  const handleRemove = (name: string) => {
    onChange(value.filter((v) => v.name.toLowerCase() !== name.toLowerCase()));
    if (expandedDoc === name) setExpandedDoc(null);
  };

  const handleFileChange = (name: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    updateSampleFile(name, file);
  };

  const triggerFileInput = (name: string) => {
    fileInputRefs.current[name]?.click();
  };

  const renderDocumentRequirements = (docName: string, docData: DocumentRequirement | undefined) => {
    if (!docData) return null;

    return (
      <div className="mt-3 space-y-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
        {/* Requirements Description */}
        <div>
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-purple-600" />
            Specific Requirements
          </Label>
          <Textarea
            placeholder={`Describe specific requirements for ${docName}...\n\nFor example:\n• Required format (PDF, scanned copy, etc.)\n• Page limits or size restrictions\n• Specific content that must be included\n• Any certification or notarization needed`}
            value={docData.description || ""}
            onChange={(e) => updateDescription(docName, e.target.value)}
            className="text-sm min-h-[100px] bg-white border-gray-300 focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        {/* Sample Document Upload */}
        <div>
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
            <Upload className="h-4 w-4 text-purple-600" />
            Sample Document (Optional)
          </Label>
          <p className="text-xs text-gray-500 mb-2">
            Upload a sample document to help applicants understand the expected format
          </p>

          <input
            type="file"
            ref={(el) => { fileInputRefs.current[docName] = el; }}
            onChange={(e) => handleFileChange(docName, e)}
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            className="hidden"
          />

          {docData.sampleFile ? (
            <div className="flex items-center gap-3 p-3 bg-white border border-green-200 rounded-lg">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FileCheck className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {docData.sampleFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(docData.sampleFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => updateSampleFile(docName, null)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : docData.sampleFileUrl ? (
            <div className="flex items-center gap-3 p-3 bg-white border border-blue-200 rounded-lg">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <File className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  Existing sample document
                </p>
                <a
                  href={docData.sampleFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline"
                >
                  View current file
                </a>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => triggerFileInput(docName)}
                className="text-gray-600"
              >
                Replace
              </Button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => triggerFileInput(docName)}
              className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors group"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-purple-100">
                  <Upload className="h-5 w-5 text-gray-400 group-hover:text-purple-600" />
                </div>
                <span className="text-sm text-gray-600 group-hover:text-purple-700">
                  Click to upload sample document
                </span>
                <span className="text-xs text-gray-400">
                  PDF, DOC, DOCX, PNG, JPG (max 10MB)
                </span>
              </div>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 pb-3 border-b">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <ClipboardList className="h-5 w-5 text-purple-700" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900">Document Requirements</h3>
          <p className="text-sm text-gray-500">Select required documents and add specific requirements</p>
        </div>
      </div>

      {/* Document Groups Accordion */}
      <Accordion type="multiple" className="space-y-2">
        {DOCUMENT_GROUPS.map((group) => {
          const selectedCount = group.documents.filter(isSelected).length;

          return (
            <AccordionItem
              key={group.name}
              value={group.name}
              className="border rounded-lg overflow-hidden bg-white shadow-sm"
            >
              <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 [&[data-state=open]]:bg-purple-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-700">
                    {group.icon}
                  </div>
                  <span className="font-medium text-gray-900">{group.name}</span>
                  {selectedCount > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-purple-600 text-white text-xs font-medium rounded-full">
                      {selectedCount}
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-2">
                <div className="space-y-3">
                  {group.documents.map((doc) => {
                    const selected = isSelected(doc);
                    const docData = findDocument(doc);
                    const isExpanded = expandedDoc === doc;

                    return (
                      <div
                        key={doc}
                        className={`rounded-lg border transition-all ${
                          selected
                            ? "border-purple-300 bg-purple-50/50"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Checkbox
                                id={doc}
                                checked={selected}
                                onCheckedChange={() => toggleDocument(doc)}
                                className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                              />
                              <label
                                htmlFor={doc}
                                className={`text-sm cursor-pointer ${
                                  selected ? "font-medium text-purple-900" : "text-gray-700"
                                }`}
                              >
                                {doc}
                              </label>
                            </div>
                            {selected && (
                              <button
                                type="button"
                                onClick={() => setExpandedDoc(isExpanded ? null : doc)}
                                className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800"
                              >
                                {isExpanded ? "Hide details" : "Add details"}
                                <ChevronDown className={`h-3 w-3 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                              </button>
                            )}
                          </div>

                          {/* Quick preview of requirements if has content but not expanded */}
                          {selected && docData?.description && !isExpanded && (
                            <p className="mt-2 ml-7 text-xs text-gray-500 line-clamp-1">
                              {docData.description}
                            </p>
                          )}
                        </div>

                        {/* Expanded Requirements Section */}
                        {selected && isExpanded && (
                          <div className="px-3 pb-3">
                            {renderDocumentRequirements(doc, docData)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {/* Custom Document Entry */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <Label className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3">
          <Plus className="h-4 w-4 text-purple-600" />
          Add Custom Document Requirement
        </Label>
        <div className="flex gap-2">
          <Input
            placeholder="e.g. Certificate of Employment, Portfolio, etc."
            value={customDoc}
            onChange={(e) => setCustomDoc(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCustom())}
            className="flex-1 bg-white"
          />
          <Button
            type="button"
            onClick={handleAddCustom}
            className="bg-purple-700 hover:bg-purple-800 text-white"
            disabled={!customDoc.trim()}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </div>

      {/* Selected Documents Summary */}
      {value.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-green-600" />
              Selected Documents ({value.length})
            </h4>
          </div>
          <div className="divide-y divide-gray-100">
            {value.map((item) => {
              const isExpanded = expandedDoc === item.name;
              const hasSample = item.sampleFile || item.sampleFileUrl;

              return (
                <div key={item.name} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{item.name}</span>
                        {hasSample && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                            Has sample
                          </span>
                        )}
                      </div>
                      {item.description && !isExpanded && (
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedDoc(isExpanded ? null : item.name)}
                        className="text-purple-600 hover:text-purple-800 hover:bg-purple-50"
                      >
                        {isExpanded ? "Collapse" : "Edit"}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(item.name)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {isExpanded && renderDocumentRequirements(item.name, item)}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
