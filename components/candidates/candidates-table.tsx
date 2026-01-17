"use client"
import { Eye, Pencil, Search, Users, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import type { Candidate } from "@/types/candidate"
import { CandidateStatus, FACULTIES } from "@/types/candidate"
import { formatDate } from "@/lib/utils"

// Status badge colors
const statusColors: Record<CandidateStatus, { bg: string; text: string; dot: string }> = {
  [CandidateStatus.DOCUMENT_SAVED]: { bg: "bg-gray-100", text: "text-gray-700", dot: "bg-gray-500" },
  [CandidateStatus.DOCUMENT_SUBMITTED]: { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500" },
  [CandidateStatus.SENT_FOR_RESENDING]: { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
  [CandidateStatus.ACCEPTED]: { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" },
  [CandidateStatus.REJECTED]: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
  [CandidateStatus.VISA_TAKEN]: { bg: "bg-purple-100", text: "text-purple-700", dot: "bg-purple-500" },
  [CandidateStatus.STUDYING]: { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
}

function StatusBadge({ status }: { status: CandidateStatus }) {
  const colors = statusColors[status] || statusColors[CandidateStatus.DOCUMENT_SUBMITTED]
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`}></span>
      {status}
    </span>
  )
}

interface CandidatesTableProps {
  candidates: Candidate[]
  onView: (candidate: Candidate) => void
  onEdit: (candidate: Candidate) => void
  onStatusChange: (candidateId: string, status: CandidateStatus) => void
  searchTerm: string
  onSearchChange: (term: string) => void
  statusFilter: CandidateStatus | ""
  onStatusFilterChange: (status: CandidateStatus | "") => void
  facultyFilter: string
  onFacultyFilterChange: (faculty: string) => void
}

export function CandidatesTable({
  candidates,
  onView,
  onEdit,
  onStatusChange,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  facultyFilter,
  onFacultyFilterChange,
}: CandidatesTableProps) {
  return (
    <div className="space-y-6">
      {/* Filters Card */}
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters</span>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => onStatusFilterChange(value as CandidateStatus | "")}>
              <SelectTrigger className="w-full md:w-[200px] bg-gray-50 border-gray-200">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {Object.values(CandidateStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={facultyFilter} onValueChange={onFacultyFilterChange}>
              <SelectTrigger className="w-full md:w-[200px] bg-gray-50 border-gray-200">
                <SelectValue placeholder="All programs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All programs</SelectItem>
                {FACULTIES.map((faculty) => (
                  <SelectItem key={faculty} value={faculty}>
                    {faculty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table Card */}
      <Card className="border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-50 hover:to-purple-100">
              <TableHead className="font-semibold text-purple-900">Applicant</TableHead>
              <TableHead className="font-semibold text-purple-900">Program</TableHead>
              <TableHead className="font-semibold text-purple-900">Applied Date</TableHead>
              <TableHead className="font-semibold text-purple-900">Status</TableHead>
              <TableHead className="text-right font-semibold text-purple-900">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {candidates.length > 0 ? (
              candidates.map((candidate, index) => (
                <TableRow
                  key={candidate.id}
                  className={`hover:bg-purple-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                        {candidate.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{candidate.fullName || 'Unknown'}</p>
                        {candidate.email && <p className="text-sm text-gray-500">{candidate.email}</p>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-700">{candidate.program || 'N/A'}</p>
                      <p className="text-sm text-gray-500">{candidate.faculty}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-600">{formatDate(candidate.appliedDate)}</span>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={candidate.status}
                      onValueChange={(value) => onStatusChange(candidate.id, value as CandidateStatus)}
                    >
                      <SelectTrigger className="w-[180px] border-0 bg-transparent p-0 h-auto focus:ring-0">
                        <StatusBadge status={candidate.status} />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(CandidateStatus).map((status) => (
                          <SelectItem key={status} value={status}>
                            <StatusBadge status={status} />
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-purple-600 hover:text-purple-700 hover:bg-purple-100"
                        onClick={() => onView(candidate)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:text-gray-700 hover:bg-gray-100"
                        onClick={() => onEdit(candidate)}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-48">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                      <Users className="w-8 h-8 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No candidates yet</h3>
                    <p className="text-gray-500 max-w-sm">
                      When students apply to your programs, they will appear here for review.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
