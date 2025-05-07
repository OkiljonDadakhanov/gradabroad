"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Label } from "@/components/ui/label"
import { X, Upload } from "lucide-react"

interface FileUploadProps {
  label: string
  value: string
  onChange: (fileName: string) => void
  accept?: string
  maxSize?: number // in bytes
  className?: string
}

export function FileUpload({
  label,
  value,
  onChange,
  accept = ".pdf,.jpg,.jpeg,.png",
  maxSize = 26214400, // 25MB default
  className = "",
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Check file size
      if (file.size > maxSize) {
        setError(`File is too large. Maximum size is ${maxSize / 1048576}MB.`)
        return
      }

      onChange(file.name)
    }
  }

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange("")
    setError(null)

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className={className}>
      <Label>{label}</Label>
      <div className="border-2 border-dashed rounded-md p-6 mt-1 cursor-pointer" onClick={handleClick}>
        <div className="flex flex-col items-center justify-center">
          <div className="bg-purple-700 text-white p-3 rounded-full mb-2">
            <Upload size={24} />
          </div>
          <p className="text-sm font-medium">Click to upload</p>
          <p className="text-xs text-gray-500">{`(Max file size: ${maxSize / 1048576} MB)`}</p>
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept={accept} className="hidden" onChange={handleFileChange} />

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      {value && !error && (
        <div className="mt-2 bg-purple-100 rounded-md p-2 flex justify-between items-center">
          <span className="text-sm">{value}</span>
          <button type="button" onClick={handleRemoveFile} className="text-gray-500 hover:text-gray-700">
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  )
}

