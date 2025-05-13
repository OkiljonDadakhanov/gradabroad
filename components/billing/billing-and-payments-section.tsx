"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BillingTable } from "./billing-table"
import { PaymentViewModal } from "./payment-view-modal"
import { PaymentAddModal } from "./payment-add-modal"
import { useToast } from "@/hooks/use-toast"
import type { Payment, PaymentFormData, PaymentHistoryItem } from "@/types/billing"
import { ServiceType, PaymentStatus } from "@/types/billing"
import { generateId } from "@/lib/utils"

export function BillingAndPaymentsSection() {
  const { toast } = useToast()
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: "pay-1",
      serviceType: ServiceType.GOLD,
      pricePaid: 1000,
      priceToBePaid: 1000,
      startDate: "2025-01-14",
      expireDate: "2026-01-14",
      status: PaymentStatus.ACCEPTED,
      description: "",
      paymentHistory: [
        {
          date: "2025-01-14",
          amount: 1000,
          fileUrl: "#",
          fileName: "1 (2).jpg",
        },
      ],
    },
  ])

  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [currentPayment, setCurrentPayment] = useState<Payment | null>(null)

  const handleViewPayment = (payment: Payment) => {
    setCurrentPayment(payment)
    setIsViewModalOpen(true)
  }

  const handleAddPayment = (formData: PaymentFormData) => {
    // Create a payment history item
    const paymentHistoryItem: PaymentHistoryItem = {
      date: formData.paymentDate,
      amount: formData.price,
      fileUrl: "#", // In a real app, this would be the URL to the uploaded file
      fileName: formData.fileName || "receipt.pdf",
    }

    // Calculate expire date (1 year from payment date)
    const startDate = new Date(formData.paymentDate)
    const expireDate = new Date(startDate)
    expireDate.setFullYear(expireDate.getFullYear() + 1)

    // Create new payment
    const newPayment: Payment = {
      id: generateId(),
      serviceType: formData.serviceType,
      pricePaid: formData.price,
      priceToBePaid: formData.priceToBePaid,
      startDate: formData.paymentDate,
      expireDate: expireDate.toISOString().split("T")[0],
      status: PaymentStatus.ACCEPTED, // Default to accepted for demo
      description: "",
      paymentHistory: [paymentHistoryItem],
    }

    setPayments([...payments, newPayment])
    setIsAddModalOpen(false)

    toast({
      title: "Payment added",
      description: `Payment for ${formData.serviceType} service has been successfully added.`,
      variant: "success",
    })
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-purple-900">Billing and Payments</h2>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-purple-900 hover:bg-purple-800">
          <Plus className="mr-2 h-4 w-4" /> Add
        </Button>
      </div>

      <BillingTable payments={payments} onView={handleViewPayment} />

      {/* View Payment Modal */}
      {currentPayment && (
        <PaymentViewModal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} payment={currentPayment} />
      )}

      {/* Add Payment Modal */}
      <PaymentAddModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={handleAddPayment} />
    </>
  )
}
