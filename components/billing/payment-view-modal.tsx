"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Payment } from "@/types/billing"
import { formatDate, formatCurrency } from "@/lib/utils"
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key } from "react"

interface PaymentViewModalProps {
  isOpen: boolean
  onClose: () => void
  payment: Payment
}

export function PaymentViewModal({ isOpen, onClose, payment }: PaymentViewModalProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Accepted":
        return "bg-green-100 text-green-800"
      case "Rejected":
        return "bg-red-100 text-red-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Expired":
        return "bg-gray-100 text-gray-800"
      case "Processing":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Payment Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <Card className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Service type</p>
                <p className="font-medium">{payment.serviceType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Price to be paid($)</p>
                <p className="font-medium">{formatCurrency(payment.priceToBePaid)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Price($)</p>
                <p className="font-medium">{formatCurrency(payment.pricePaid)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Start date</p>
                <p className="font-medium">{payment.startDate ? formatDate(payment.startDate) : "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Expire date</p>
                <p className="font-medium">{formatDate(payment.expireDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <Badge className={getStatusColor(payment.status)}>{payment.status}</Badge>
              </div>
            </div>

            {payment.description && (
              <div className="mt-4">
                <p className="text-sm text-gray-500">Description</p>
                <p>{payment.description || "-"}</p>
              </div>
            )}
          </Card>

          <div>
            <h3 className="font-medium text-lg mb-3">Payment History</h3>
            <Card>
              <div className="p-4">
                <div className="grid grid-cols-3 gap-4 font-medium text-purple-900 bg-purple-50 p-2 rounded-md mb-2">
                  <div>Payment date</div>
                  <div>Price($)</div>
                  <div>File</div>
                </div>
                {payment.paymentHistory.map((item: { date: string; amount: number; fileUrl: string | undefined; fileName: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }, index: Key | null | undefined) => (
                  <div key={index} className="grid grid-cols-3 gap-4 py-2 border-b last:border-0">
                    <div>{formatDate(item.date)}</div>
                    <div>{formatCurrency(item.amount)}</div>
                    <div>
                      <a href={item.fileUrl} className="text-blue-600 hover:underline" target="_blank" rel="noreferrer">
                        {item.fileName}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

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
