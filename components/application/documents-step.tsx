"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Upload,
  File,
  X,
  CheckCircle,
  AlertCircle,
  FileText,
} from "lucide-react";

export interface DocumentFile {
  id: string;
  type: string;
  file: File | null;
  name: string;
  status: "pending" | "uploading" | "uploaded" | "error";
  progress: number;
  url?: string;
}

interface DocumentsStepProps {
  documents: DocumentFile[];
  requiredDocuments: string[];
  onDocumentsChange: (documents: DocumentFile[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const DOCUMENT_LABELS: Record<string, string> = {
  passport: "Passport Copy",
  transcript: "Academic Transcript",
  diploma: "Diploma/Certificate",
  cv: "CV/Resume",
  motivation_letter: "Motivation Letter",
  recommendation: "Recommendation Letter",
  english_certificate: "English Proficiency Certificate",
  portfolio: "Portfolio (if applicable)",
  photo: "Passport Photo",
  other: "Other Documents",
};

export function DocumentsStep({
  documents,
  requiredDocuments,
  onDocumentsChange,
  onNext,
  onBack,
}: DocumentsStepProps) {
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleFileSelect = (docType: string, file: File) => {
    const existingIndex = documents.findIndex((d) => d.type === docType);
    const newDoc: DocumentFile = {
      id: `${docType}-${Date.now()}`,
      type: docType,
      file,
      name: file.name,
      status: "uploaded",
      progress: 100,
    };

    if (existingIndex >= 0) {
      const updated = [...documents];
      updated[existingIndex] = newDoc;
      onDocumentsChange(updated);
    } else {
      onDocumentsChange([...documents, newDoc]);
    }
  };

  const handleRemoveDocument = (docType: string) => {
    onDocumentsChange(documents.filter((d) => d.type !== docType));
  };

  const getDocumentForType = (type: string) => {
    return documents.find((d) => d.type === type);
  };

  const allRequiredUploaded = requiredDocuments.every((type) =>
    documents.some((d) => d.type === type && d.status === "uploaded")
  );

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Document Requirements</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Documents should be in PDF, JPG, or PNG format</li>
              <li>Maximum file size: 10MB per document</li>
              <li>Ensure all documents are clearly readable</li>
              <li>Translations must be certified if not in English</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {requiredDocuments.map((docType) => {
          const doc = getDocumentForType(docType);
          const isRequired = true;

          return (
            <Card key={docType} className={cn(doc && "border-green-200")}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "p-2 rounded-lg",
                        doc ? "bg-green-100" : "bg-gray-100"
                      )}
                    >
                      {doc ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <FileText className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {DOCUMENT_LABELS[docType] || docType}
                        {isRequired && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </p>
                      {doc ? (
                        <p className="text-sm text-gray-500">{doc.name}</p>
                      ) : (
                        <p className="text-sm text-gray-400">No file uploaded</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {doc && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveDocument(docType)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X size={16} />
                      </Button>
                    )}
                    <input
                      type="file"
                      ref={(el) => {
                        fileInputRefs.current[docType] = el;
                      }}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileSelect(docType, file);
                        }
                        e.target.value = "";
                      }}
                    />
                    <Button
                      type="button"
                      variant={doc ? "outline" : "default"}
                      size="sm"
                      onClick={() => fileInputRefs.current[docType]?.click()}
                    >
                      <Upload size={14} className="mr-1" />
                      {doc ? "Replace" : "Upload"}
                    </Button>
                  </div>
                </div>

                {doc?.status === "uploading" && (
                  <div className="mt-3">
                    <Progress value={doc.progress} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">
                      Uploading... {doc.progress}%
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Optional documents */}
      <div className="border-t pt-6">
        <h3 className="font-medium text-gray-900 mb-4">
          Additional Documents (Optional)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["portfolio", "other"].map((docType) => {
            if (requiredDocuments.includes(docType)) return null;
            const doc = getDocumentForType(docType);

            return (
              <Card key={docType} className={cn(doc && "border-green-200")}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {doc ? (
                        <File className="h-5 w-5 text-green-600" />
                      ) : (
                        <File className="h-5 w-5 text-gray-400" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {DOCUMENT_LABELS[docType]}
                        </p>
                        {doc && (
                          <p className="text-xs text-gray-500">{doc.name}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {doc && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveDocument(docType)}
                        >
                          <X size={14} />
                        </Button>
                      )}
                      <input
                        type="file"
                        ref={(el) => {
                          fileInputRefs.current[docType] = el;
                        }}
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileSelect(docType, file);
                          }
                          e.target.value = "";
                        }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => fileInputRefs.current[docType]?.click()}
                      >
                        <Upload size={14} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          type="button"
          onClick={onNext}
          disabled={!allRequiredUploaded}
        >
          Continue
        </Button>
      </div>

      {!allRequiredUploaded && (
        <p className="text-sm text-amber-600 text-center">
          Please upload all required documents to continue
        </p>
      )}
    </div>
  );
}
