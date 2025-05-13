"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SponsoredContentModal } from "./sponsored-content-modal"
import { SponsoredContentDeleteDialog } from "./sponsored-content-delete-dialog"
import { useToast } from "@/hooks/use-toast"
import type { SponsoredContent } from "@/types/sponsored-content"
import { defaultSponsoredContent } from "@/types/sponsored-content"
import { generateId } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"

export function SponsoredContentSection() {
  const { toast } = useToast()
  const [sponsoredContents, setSponsoredContents] = useState<SponsoredContent[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentContent, setCurrentContent] = useState<SponsoredContent | null>(null)

  const handleAddContent = (content: Omit<SponsoredContent, "id">) => {
    const newContent = {
      ...content,
      id: generateId(),
    }

    setSponsoredContents([...sponsoredContents, newContent])
    setIsAddModalOpen(false)

    toast({
      title: "Content added",
      description: "The sponsored content has been successfully added.",
      variant: "success",
    })
  }

  const handleEditContent = (content: SponsoredContent) => {
    setSponsoredContents(sponsoredContents.map((c) => (c.id === content.id ? content : c)))
    setIsEditModalOpen(false)

    toast({
      title: "Content updated",
      description: "The sponsored content has been successfully updated.",
      variant: "success",
    })
  }

  const handleDeleteContent = () => {
    if (currentContent) {
      setSponsoredContents(sponsoredContents.filter((c) => c.id !== currentContent.id))
      setIsDeleteDialogOpen(false)

      toast({
        title: "Content deleted",
        description: "The sponsored content has been successfully deleted.",
        variant: "success",
      })

      setCurrentContent(null)
    }
  }

  const handleOpenEditModal = (content: SponsoredContent) => {
    setCurrentContent(content)
    setIsEditModalOpen(true)
  }

  const handleOpenDeleteDialog = (content: SponsoredContent) => {
    setCurrentContent(content)
    setIsDeleteDialogOpen(true)
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-purple-900">Sponsored content</h2>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-purple-900 hover:bg-purple-800">
          <Plus className="mr-2 h-4 w-4" /> Add
        </Button>
      </div>

      {sponsoredContents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sponsoredContents.map((content) => (
            <Card key={content.id} className="overflow-hidden">
              <div className="relative">
                <img
                  src={content.imageUrl || "/placeholder.svg?height=200&width=400"}
                  alt={content.name.english}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=200&width=400"
                  }}
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-purple-200 hover:bg-purple-300"
                    onClick={() => handleOpenEditModal(content)}
                  >
                    <Pencil className="h-5 w-5 text-purple-700" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-purple-200 hover:bg-purple-300"
                    onClick={() => handleOpenDeleteDialog(content)}
                  >
                    <Trash2 className="h-5 w-5 text-purple-700" />
                  </Button>
                </div>
                <Badge
                  className={`absolute top-2 left-2 ${
                    content.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {content.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg text-purple-900">{content.name.english}</h3>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{content.description.english}</p>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-gray-500 text-xs">
                    {formatDate(content.startDate)} - {formatDate(content.endDate)}
                  </p>
                  {content.targetUrl && (
                    <a
                      href={content.targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-800 flex items-center text-sm"
                    >
                      Visit <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-purple-100 p-6 rounded-lg mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-purple-700 mx-auto"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-purple-900 mb-2">Sponsored contents are not available</h3>
          <p className="text-gray-500 max-w-md">Add your first sponsored content by clicking the Add button above.</p>
        </div>
      )}

      {/* Add Content Modal */}
      <SponsoredContentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddContent}
        initialData={defaultSponsoredContent}
        title="Add Sponsored Content"
      />

      {/* Edit Content Modal */}
      {currentContent && (
        <SponsoredContentModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleEditContent}
          initialData={currentContent}
          title="Edit Sponsored Content"
        />
      )}

      {/* Delete Confirmation Dialog */}
      {currentContent && (
        <SponsoredContentDeleteDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteContent}
          contentName={currentContent.name.english}
        />
      )}
    </>
  )
}
