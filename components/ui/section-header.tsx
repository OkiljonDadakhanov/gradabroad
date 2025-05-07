"use client"

import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { PenSquare } from "lucide-react"

interface SectionHeaderProps {
  title: string
  onEdit: () => void
  rightContent?: ReactNode
}

export function SectionHeader({ title, onEdit, rightContent }: SectionHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-purple-900">{title}</h2>
      <div className="flex items-center gap-2">
        {rightContent}
        <Button onClick={onEdit} className="bg-purple-900 hover:bg-purple-800">
          <PenSquare className="mr-2 h-4 w-4" /> Edit
        </Button>
      </div>
    </div>
  )
}

