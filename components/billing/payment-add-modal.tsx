"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useForm } from "@/hooks/use-form"
import { Upload, X } from "lucide-react"
import { ServiceType, type PaymentFormData } from "@/types/billing"
import { defaultPaymentFormData } from "@/types/billing"
import { TermsAndConditionsModal } from "./terms-and-conditions-modal"

interface PaymentAddModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: PaymentFormData) => void
}

export function PaymentAddModal({ isOpen, onClose, onSave }: PaymentAddModalProps) {
  const { values, handleChange, handleSelectChange, handleCheckboxChange, reset } =
    useForm<PaymentFormData>(defaultPaymentFormData)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false)

  const handleSubmit = () => {
    setError(null)

    // Validate form
    if (!values.serviceType) {
      setError("Service type is required")
      return
    }

    if (!values.price || values.price <= 0) {
      setError("Price must be greater than 0")
      return
    }

    if (!values.paymentDate) {
      setError("Payment date is required")
      return
    }

    if (!values.acceptTerms) {
      setError("You must accept the terms and conditions")
      return
    }

    // Submit form
    onSave({
      ...values,
      file,
    })

    // Reset form
    reset()
    setFile(null)
  }

  const handleCancel = () => {
    reset()
    setFile(null)
    setError(null)
    onClose()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)

    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      const maxSize = 5 * 1024 * 1024 // 5MB

      if (selectedFile.size > maxSize) {
        setError(`File is too large. Maximum size is 5MB.`)
        return
      }

      setFile(selectedFile)
      handleChange({
        target: {
          name: "fileName",
          value: selectedFile.name,
        },
      } as React.ChangeEvent<HTMLInputElement>)
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    handleChange({
      target: {
        name: "fileName",
        value: "",
      },
    } as React.ChangeEvent<HTMLInputElement>)
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value)

    // Update both price and priceToBePaid
    handleChange(e)
    handleChange({
      target: {
        name: "priceToBePaid",
        value: e.target.value,
      },
    } as React.ChangeEvent<HTMLInputElement>)
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleCancel()
      }}
    >
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add Payment</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div>
            <Label htmlFor="serviceType" className="mb-1 block">
              Service type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={values.serviceType}
              onValueChange={(value) => handleSelectChange("serviceType", value as ServiceType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ServiceType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="priceToBePaid" className="mb-1 block">
              Price to be paid($)
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
              <Input
                id="priceToBePaid"
                name="priceToBePaid"
                type="number"
                value={values.priceToBePaid}
                onChange={handleChange}
                className="pl-8"
                disabled
              />
            </div>
          </div>

          <div>
            <Label htmlFor="price" className="mb-1 block">
              Price($) <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
              <Input
                id="price"
                name="price"
                type="number"
                value={values.price}
                onChange={handlePriceChange}
                className="pl-8"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="paymentDate" className="mb-1 block">
              Payment date <span className="text-red-500">*</span>
            </Label>
            <Input
              id="paymentDate"
              name="paymentDate"
              type="date"
              value={values.paymentDate}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label className="mb-1 block">
              File <span className="text-red-500">*</span>
            </Label>
            <div
              className="border-2 border-dashed rounded-md p-6 cursor-pointer"
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              {file ? (
                <div className="flex justify-between items-center">
                  <span className="text-sm">{file.name}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveFile()
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <div className="bg-purple-700 text-white p-3 rounded-full mb-2">
                    <Upload size={24} />
                  </div>
                  <p className="text-sm font-medium">Click to upload</p>
                </div>
              )}
            </div>
            <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="acceptTerms"
              checked={values.acceptTerms}
              onCheckedChange={(checked) => {
                handleCheckboxChange("acceptTerms", checked as boolean)
              }}
            />
            <Label htmlFor="acceptTerms" className="font-normal">
              I accept all{" "}
              <span
                className="text-purple-700 hover:text-purple-900 cursor-pointer underline"
                onClick={(e) => {
                  e.preventDefault()
                  setIsTermsModalOpen(true)
                }}
              >
                terms and conditions
              </span>
            </Label>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-purple-900 hover:bg-purple-800">
              Save
            </Button>
          </div>
        </div>
        {/* Terms and Conditions Modal */}
        <TermsAndConditionsModal
          isOpen={isTermsModalOpen}
          onClose={() => setIsTermsModalOpen(false)}
          serviceType={values.serviceType}
        />
      </DialogContent>
    </Dialog>
  )
}
