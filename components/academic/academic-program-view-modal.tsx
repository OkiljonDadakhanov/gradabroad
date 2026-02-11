"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { AcademicProgram } from "@/types/academic";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import DOMPurify from "dompurify";

interface AcademicProgramViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  program: AcademicProgram;
}

export function AcademicProgramViewModal({
  isOpen,
  onClose,
  program,
}: AcademicProgramViewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
           {program.name || "Program Details"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <Card className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Field of Study</p>
                <p className="font-medium">{program.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Degree Type</p>
                <p className="font-medium">{program.degreeType}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Contract Price (USD)</p>
                <p className="font-medium">${program.contractPrice}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Application Fee</p>
                <p className="font-medium">
                  {program.platformApplicationFee && parseFloat(program.platformApplicationFee) > 0
                    ? `$${parseFloat(program.platformApplicationFee).toFixed(2)} USD`
                    : "No application fee"}
                </p>
              </div>
            </div>
            {program.platformApplicationFee && parseFloat(program.platformApplicationFee) > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-500">Payment Instructions</p>
                <p className="font-medium whitespace-pre-wrap">
                  {program.paymentInstructions || "No payment instructions provided"}
                </p>
              </div>
            )}
            <div className="mt-4">
              <p className="text-sm text-gray-500">Active</p>
              <p className="font-medium">{program.active ? "Yes" : "No"}</p>
            </div>
          </Card>

          <Card className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Admission Start Date</p>
                <p className="font-medium">{program.admissionStart}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Admission End Date</p>
                <p className="font-medium">{program.admissionEnd}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <p className="text-sm text-gray-500">Language Requirements</p>
            {program.languageRequirement.length > 0 ? (
              <ul className="list-disc list-inside text-sm text-purple-800 mt-1">
                {program.languageRequirement.map((req, i) => (
                  <li key={i}>
                    <strong>{req.name}</strong>: {req.requirement}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 mt-2">
                No language requirements listed
              </p>
            )}
          </Card>

          <Card className="p-4">
            <p className="text-sm text-gray-500">Required Documents</p>
            <div className="mt-2 space-y-3">
              {program.documentTypes.length > 0 ? (
                program.documentTypes.map((doc, index) => (
                  <div
                    key={index}
                    className="bg-purple-50 border border-purple-200 rounded-lg p-3"
                  >
                    <span className="font-medium text-purple-800">
                      {doc.name}
                    </span>
                    {doc.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {doc.description}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No documents specified</p>
              )}
            </div>
          </Card>

          <Card className="p-4">
            <p className="text-sm text-gray-500">Results Announcement Date</p>
            <p className="font-medium">
              {program.results_announcement_date
                ? new Date(
                    program.results_announcement_date
                  ).toLocaleDateString()
                : "Not specified"}
            </p>
          </Card>

          <Card className="p-4">
            <p className="text-sm text-gray-500">Application Guide</p>
            {program.application_guide_url ? (
              <a
                href={program.application_guide_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:underline mt-2 inline-block"
              >
                Download Application Guide
              </a>
            ) : (
              <p className="text-gray-500 mt-2">No guide available</p>
            )}
          </Card>

          <Card className="p-4">
            <p className="text-sm text-gray-500">Application Form</p>
            {program.application_form_url ? (
              <a
                href={program.application_form_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:underline mt-2 inline-block"
              >
                Download Application Form
              </a>
            ) : (
              <p className="text-gray-500 mt-2">No form available</p>
            )}
          </Card>

          <Card className="p-4">
            <p className="text-sm text-gray-500 mb-2">Program Description</p>
            <Tabs defaultValue="english">
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

              {(["english", "korean", "russian", "uzbek"] as const).map((lang) => (
                <TabsContent key={lang} value={lang} className="mt-4">
                  {program.description[lang] ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          program.description[lang].replace(/\n/g, "<br/>")
                        ),
                      }}
                    />
                  ) : (
                    <p className="text-gray-500">
                      No description available in {lang}
                    </p>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </Card>

          <div className="flex justify-end">
            <Button
              onClick={onClose}
              className="bg-purple-900 hover:bg-purple-800 text-white"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
