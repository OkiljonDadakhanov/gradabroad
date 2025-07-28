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
            {program.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <Card className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium">{program.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Degree type</p>
                <p className="font-medium">{program.degreeType}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Contract Price (USD)</p>
                <p className="font-medium">{program.contractPrice}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Active</p>
                <p className="font-medium">{program.active ? "Yes" : "No"}</p>
              </div>
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
            <div className="mt-2 flex flex-wrap gap-2">
              {program.documentTypes.length > 0 ? (
                program.documentTypes.map((doc, index) => (
                  <span
                    key={index}
                    className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                  >
                    {doc}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No documents specified</p>
              )}
            </div>
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

              {["english", "korean", "russian", "uzbek"].map((lang) => (
                <TabsContent key={lang} value={lang} className="mt-4">
                  {program.description[lang] ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: program.description[lang].replace(
                          /\n/g,
                          "<br/>"
                        ),
                      }}
                    />
                  ) : (
                    <p className="text-gray-500">
                      No description available in{" "}
                      {lang === "english"
                        ? "English"
                        : lang === "korean"
                        ? "Korean"
                        : lang === "russian"
                        ? "Russian"
                        : "Uzbek"}
                    </p>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </Card>

          <div className="flex justify-end">
            <Button
              onClick={onClose}
              className="bg-purple-900 hover:bg-purple-800"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
