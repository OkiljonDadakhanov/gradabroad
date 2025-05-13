"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DocumentTypeModal } from "./document-type-modal"
import { DocumentTypeDeleteDialog } from "./document-type-delete-dialog"
import { useToast } from "@/hooks/use-toast"
import type { DocumentType } from "@/types/document"
import { generateId } from "@/lib/utils"
import { FileText } from "lucide-react"

export function DocumentTypesSection() {
  const { toast } = useToast()
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentDocumentType, setCurrentDocumentType] = useState<DocumentType | null>(null)

  const handleAddDocumentType = (documentType: Omit<DocumentType, "id">) => {
    const newDocumentType = {
      ...documentType,
      id: generateId(),
    }

    setDocumentTypes([...documentTypes, newDocumentType])
    setIsAddModalOpen(false)

    toast({
      title: "Document type added",
      description: `${documentType.name.english} has been successfully added.`,
      variant: "success",
    })
  }

  const handleEditDocumentType = (documentType: DocumentType) => {
    setDocumentTypes(documentTypes.map((dt) => (dt.id === documentType.id ? documentType : dt)))
    setIsEditModalOpen(false)

    toast({
      title: "Document type updated",
      description: `${documentType.name.english} has been successfully updated.`,
      variant: "success",
    })
  }

  const handleDeleteDocumentType = () => {
    if (currentDocumentType) {
      setDocumentTypes(documentTypes.filter((dt) => dt.id !== currentDocumentType.id))
      setIsDeleteDialogOpen(false)

      toast({
        title: "Document type deleted",
        description: `${currentDocumentType.name.english} has been successfully deleted.`,
        variant: "success",
      })

      setCurrentDocumentType(null)
    }
  }

  const handleOpenEditModal = (documentType: DocumentType) => {
    setCurrentDocumentType(documentType)
    setIsEditModalOpen(true)
  }

  const handleOpenDeleteDialog = (documentType: DocumentType) => {
    setCurrentDocumentType(documentType)
    setIsDeleteDialogOpen(true)
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-purple-900">Document types</h2>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-purple-900 hover:bg-purple-800">
          <Plus className="mr-2 h-4 w-4" /> Add
        </Button>
      </div>

      {documentTypes.length > 0 ? (
        <div className="space-y-4">
          {documentTypes.map((documentType) => (
            <div key={documentType.id} className="bg-purple-50 p-4 rounded-md flex justify-between items-center">
              <span className="font-medium text-purple-900">{documentType.name.english}</span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-purple-200 hover:bg-purple-300"
                  onClick={() => handleOpenEditModal(documentType)}
                >
                  <Pencil className="h-5 w-5 text-purple-700" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-purple-200 hover:bg-purple-300"
                  onClick={() => handleOpenDeleteDialog(documentType)}
                >
                  <Trash2 className="h-5 w-5 text-purple-700" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-purple-100 p-6 rounded-full mb-4">
            <FileText className="h-12 w-12 text-purple-700" />
          </div>
          <h3 className="text-xl font-medium text-purple-900 mb-2">No matching data found</h3>
          <p className="text-gray-500 max-w-md">Add your first document type by clicking the Add button above.</p>
        </div>
      )}

      {/* Add Document Type Modal */}
      <DocumentTypeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddDocumentType}
        title="Add Document Type"
      />

      {/* Edit Document Type Modal */}
      {currentDocumentType && (
        <DocumentTypeModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleEditDocumentType}
          initialData={currentDocumentType}
          title="Edit Document Type"
        />
      )}

      {/* Delete Confirmation Dialog */}
      {currentDocumentType && (
        <DocumentTypeDeleteDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteDocumentType}
          documentTypeName={currentDocumentType.name.english}
        />
      )}
    </>
  )
}
