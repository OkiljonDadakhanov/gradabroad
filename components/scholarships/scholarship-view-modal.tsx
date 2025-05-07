"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Scholarship } from "@/types/scholarship"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"

interface ScholarshipViewModalProps {
  isOpen: boolean
  onClose: () => void
  scholarship: Scholarship
}

export function ScholarshipViewModal({ isOpen, onClose, scholarship }: ScholarshipViewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {scholarship.degreeType} {scholarship.academicProgram ? `- ${scholarship.academicProgram}` : ""}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <Card className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Degree</p>
                <p className="font-medium">{scholarship.degreeType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Academic program</p>
                <p className="font-medium">{scholarship.academicProgram || "-"}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <p className="text-sm text-gray-500 mb-2">Scholarship details</p>
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
                {scholarship.description.english ? (
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: scholarship.description.english.replace(/\n/g, "<br/>") }}
                  />
                ) : (
                  <p className="text-gray-500">No description available in English</p>
                )}
              </TabsContent>
              <TabsContent value="korean" className="mt-4">
                {scholarship.description.korean ? (
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: scholarship.description.korean.replace(/\n/g, "<br/>") }}
                  />
                ) : (
                  <p className="text-gray-500">No description available in Korean</p>
                )}
              </TabsContent>
              <TabsContent value="russian" className="mt-4">
                {scholarship.description.russian ? (
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: scholarship.description.russian.replace(/\n/g, "<br/>") }}
                  />
                ) : (
                  <p className="text-gray-500">No description available in Russian</p>
                )}
              </TabsContent>
              <TabsContent value="uzbek" className="mt-4">
                {scholarship.description.uzbek ? (
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: scholarship.description.uzbek.replace(/\n/g, "<br/>") }}
                  />
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

