"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { AcademicProgram } from "@/types/academic"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"

interface AcademicProgramViewModalProps {
  isOpen: boolean
  onClose: () => void
  program: AcademicProgram
}

export function AcademicProgramViewModal({ isOpen, onClose, program }: AcademicProgramViewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{program.name}</DialogTitle>
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
                <p className="text-sm text-gray-500">Language requirement</p>
                <p className="font-medium">{program.languageRequirement}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Contract price per semester</p>
                <p className="font-medium">${program.contractPrice}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Admission start date</p>
                <p className="font-medium">{program.admissionStart}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Admission end date</p>
                <p className="font-medium">{program.admissionEnd}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <p className="text-sm text-gray-500">Required documents</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {program.documentTypes.map((doc, index) => (
                <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                  {doc}
                </span>
              ))}
              {program.documentTypes.length === 0 && <p className="text-gray-500">No documents specified</p>}
            </div>
          </Card>

          <Card className="p-4">
            <p className="text-sm text-gray-500 mb-2">Program description</p>
            <Tabs defaultValue="english">
              <TabsList className="bg-purple-100">
                <TabsTrigger
                  value="english"
                  className="data-[state=active]:bg-purple-700 data-[state=active]:text-white"
                >
                  English
                </TabsTrigger>
                <TabsTrigger
                  value="korean"
                  className="data-[state=active]:bg-purple-700 data-[state=active]:text-white"
                >
                  한국어
                </TabsTrigger>
                <TabsTrigger
                  value="russian"
                  className="data-[state=active]:bg-purple-700 data-[state=active]:text-white"
                >
                  Русский
                </TabsTrigger>
                <TabsTrigger value="uzbek" className="data-[state=active]:bg-purple-700 data-[state=active]:text-white">
                  O'zbek
                </TabsTrigger>
              </TabsList>
              <TabsContent value="english" className="mt-4">
                {program.description.english ? (
                  <div dangerouslySetInnerHTML={{ __html: program.description.english.replace(/\n/g, "<br/>") }} />
                ) : (
                  <p className="text-gray-500">No description available in English</p>
                )}
              </TabsContent>
              <TabsContent value="korean" className="mt-4">
                {program.description.korean ? (
                  <div dangerouslySetInnerHTML={{ __html: program.description.korean.replace(/\n/g, "<br/>") }} />
                ) : (
                  <p className="text-gray-500">No description available in Korean</p>
                )}
              </TabsContent>
              <TabsContent value="russian" className="mt-4">
                {program.description.russian ? (
                  <div dangerouslySetInnerHTML={{ __html: program.description.russian.replace(/\n/g, "<br/>") }} />
                ) : (
                  <p className="text-gray-500">No description available in Russian</p>
                )}
              </TabsContent>
              <TabsContent value="uzbek" className="mt-4">
                {program.description.uzbek ? (
                  <div dangerouslySetInnerHTML={{ __html: program.description.uzbek.replace(/\n/g, "<br/>") }} />
                ) : (
                  <p className="text-gray-500">No description available in Uzbek</p>
                )}
              </TabsContent>
            </Tabs>
          </Card>

          <div className="flex justify-end">
            <Button onClick={onClose} className="bg-purple-900 hover:bg-purple-800">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

