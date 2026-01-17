"use client"
import { Eye, Pencil, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Candidate } from "@/types/candidate"
import { CandidateStatus, FACULTIES } from "@/types/candidate"
import { formatDate } from "@/lib/utils"

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
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={(value) => onStatusFilterChange(value as CandidateStatus | "")}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filter by status" />
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
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filter by faculty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All faculties</SelectItem>
            {FACULTIES.map((faculty) => (
              <SelectItem key={faculty} value={faculty}>
                {faculty}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-purple-50">
            <TableRow>
              <TableHead className="w-[250px]">Full Name</TableHead>
              <TableHead>Faculty</TableHead>
              <TableHead>Applied Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {candidates.length > 0 ? (
              candidates.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell className="font-medium">{candidate.fullName}</TableCell>
                  <TableCell>{candidate.faculty}</TableCell>
                  <TableCell>{formatDate(candidate.appliedDate)}</TableCell>
                  <TableCell>
                    <Select
                      value={candidate.status}
                      onValueChange={(value) => onStatusChange(candidate.id, value as CandidateStatus)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue>{candidate.status}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(CandidateStatus).map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="bg-purple-200 hover:bg-purple-300"
                        onClick={() => onView(candidate)}
                      >
                        <Eye className="h-5 w-5 text-purple-700" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="bg-purple-200 hover:bg-purple-300"
                        onClick={() => onEdit(candidate)}
                      >
                        <Pencil className="h-5 w-5 text-purple-700" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center bg-purple-100">
                  No candidates right now
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
