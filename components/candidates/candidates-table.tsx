"use client"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { CandidateListItem } from "@/types/candidate"
import { STATUS_OPTIONS } from "@/types/candidate"
import { STATUS_COLORS, STATUS_LABELS } from "@/lib/constants"
import { formatDate } from "@/lib/utils"
import { useTranslations } from "@/lib/i18n"

interface CandidatesTableProps {
  candidates: CandidateListItem[]
  onView: (candidate: CandidateListItem) => void
  searchTerm: string
  onSearchChange: (term: string) => void
  statusFilter: string
  onStatusFilterChange: (status: string) => void
  loading?: boolean
}

export function CandidatesTable({
  candidates,
  onView,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  loading = false,
}: CandidatesTableProps) {
  const t = useTranslations("candidates")
  const tCommon = useTranslations("common")

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder={t("filterByStatus")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allStatuses")}</SelectItem>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-purple-50 dark:bg-purple-950/30">
            <TableRow>
              <TableHead className="w-[200px] dark:text-gray-300">{t("studentName")}</TableHead>
              <TableHead className="dark:text-gray-300">{t("program")}</TableHead>
              <TableHead className="dark:text-gray-300">{t("applicationDate")}</TableHead>
              <TableHead className="dark:text-gray-300">{t("status")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  {tCommon("loading")}
                </TableCell>
              </TableRow>
            ) : candidates.length > 0 ? (
              candidates.map((candidate) => (
                <TableRow
                  key={candidate.id}
                  className="cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-colors"
                  onClick={() => onView(candidate)}
                >
                  <TableCell className="font-medium">
                    {candidate.applicant_full_name}
                  </TableCell>
                  <TableCell>{candidate.programme_name}</TableCell>
                  <TableCell>
                    {candidate.applied_date ? formatDate(candidate.applied_date) : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge className={STATUS_COLORS[candidate.status] || "bg-gray-100 text-gray-700"}>
                      {STATUS_LABELS[candidate.status] || candidate.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-gray-500">
                  {t("noApplications")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
