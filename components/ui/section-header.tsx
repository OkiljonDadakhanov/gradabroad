"use client"

import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { PenSquare } from "lucide-react"

interface SectionHeaderProps {
  title: string
  onEdit?: () => void
  rightContent?: ReactNode
  subtitle?: string
}

export function SectionHeader({ title, onEdit, rightContent, subtitle }: SectionHeaderProps) {
  return (
    <div className="flex justify-between items-start mb-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {rightContent}
        {onEdit && (
          <Button
            onClick={onEdit}
            className="bg-purple-600 hover:bg-purple-700 shadow-sm"
          >
            <PenSquare className="mr-2 h-4 w-4" /> Edit
          </Button>
        )}
      </div>
    </div>
  )
}

