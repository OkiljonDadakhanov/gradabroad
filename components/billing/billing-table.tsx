"use client"

import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { Payment } from "@/types/billing"
import { formatDate, formatCurrency } from "@/lib/utils"

interface BillingTableProps {
  payments: Payment[]
  onView: (payment: Payment) => void
}

export function BillingTable({ payments, onView }: BillingTableProps) {
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
    <div className="rounded-md border">
      <Table>
        <TableHeader className="bg-purple-50">
          <TableRow>
            <TableHead>Service type</TableHead>
            <TableHead>Paid price($)</TableHead>
            <TableHead>Start date</TableHead>
            <TableHead>Expire date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">View</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.length > 0 ? (
            payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.serviceType}</TableCell>
                <TableCell>{formatCurrency(payment.pricePaid)}</TableCell>
                <TableCell>{formatDate(payment.startDate)}</TableCell>
                <TableCell>{formatDate(payment.expireDate)}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(payment.status)}>{payment.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-purple-200 hover:bg-purple-300"
                    onClick={() => onView(payment)}
                  >
                    <Eye className="h-5 w-5 text-purple-700" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No payment records found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
