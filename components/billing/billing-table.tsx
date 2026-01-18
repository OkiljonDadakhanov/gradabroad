"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { Payment } from "@/types/billing"
import { formatDate, formatCurrency } from "@/lib/utils"
import { useTranslations } from "@/lib/i18n"

interface BillingTableProps {
  payments: Payment[]
  onView: (payment: Payment) => void
}

export function BillingTable({ payments, onView }: BillingTableProps) {
  const t = useTranslations("billing")
  const tCommon = useTranslations("common")
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
            <TableHead>{t("serviceType")}</TableHead>
            <TableHead>{t("paidPrice")}</TableHead>
            <TableHead>{t("startDate")}</TableHead>
            <TableHead>{t("expireDate")}</TableHead>
            <TableHead>{tCommon("status")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.length > 0 ? (
            payments.map((payment) => (
              <TableRow
                key={payment.id}
                className="cursor-pointer hover:bg-purple-50 transition-colors"
                onClick={() => onView(payment)}
              >
                <TableCell className="font-medium">{payment.serviceType}</TableCell>
                <TableCell>{formatCurrency(payment.pricePaid)}</TableCell>
                <TableCell>{formatDate(payment.startDate)}</TableCell>
                <TableCell>{formatDate(payment.expireDate)}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(payment.status)}>{payment.status}</Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                {t("noPayments")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
