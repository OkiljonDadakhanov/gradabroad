"use client";

import { Eye, Search, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Candidate, STATUS_OPTIONS } from "@/types/candidate";
import { ApplicationStatus } from "@/types/application";
import { STATUS_COLORS, STATUS_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface CandidatesTableProps {
  candidates: Candidate[];
  onView: (candidate: Candidate) => void;
  onChat: (candidate: Candidate) => void;
  onStatusChange: (candidateId: number, status: ApplicationStatus) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: ApplicationStatus | "";
  onStatusFilterChange: (status: ApplicationStatus | "") => void;
  programFilter: string;
  onProgramFilterChange: (program: string) => void;
  programs: string[];
}

export function CandidatesTable({
  candidates,
  onView,
  onChat,
  onStatusChange,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  programFilter,
  onProgramFilterChange,
  programs,
}: CandidatesTableProps) {
  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select
          value={statusFilter || "all"}
          onValueChange={(value) =>
            onStatusFilterChange(value === "all" ? "" : (value as ApplicationStatus))
          }
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={programFilter || "all"}
          onValueChange={(value) =>
            onProgramFilterChange(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filter by program" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All programs</SelectItem>
            {programs.map((program) => (
              <SelectItem key={program} value={program}>
                {program}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-purple-50">
            <TableRow>
              <TableHead className="w-[200px]">Student</TableHead>
              <TableHead>Program</TableHead>
              <TableHead>Applied Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {candidates.length > 0 ? (
              candidates.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {candidate.student?.first_name} {candidate.student?.last_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {candidate.student?.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{candidate.programme?.name}</p>
                      <p className="text-sm text-gray-500">
                        {candidate.programme?.degree_type}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(candidate.created_at)}</TableCell>
                  <TableCell>
                    <Select
                      value={candidate.status}
                      onValueChange={(value) =>
                        onStatusChange(candidate.id, value as ApplicationStatus)
                      }
                    >
                      <SelectTrigger className="w-[150px]">
                        <Badge
                          className={cn(
                            "font-normal",
                            STATUS_COLORS[candidate.status] || "bg-gray-100"
                          )}
                        >
                          {STATUS_LABELS[candidate.status] || candidate.status}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {candidate.documents?.length || 0} docs
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="bg-purple-100 hover:bg-purple-200"
                        onClick={() => onView(candidate)}
                        title="View details"
                      >
                        <Eye className="h-4 w-4 text-purple-700" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="bg-blue-100 hover:bg-blue-200"
                        onClick={() => onChat(candidate)}
                        title="Chat with student"
                      >
                        <MessageSquare className="h-4 w-4 text-blue-700" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center bg-purple-50">
                  <p className="text-gray-500">No candidates found</p>
                  <p className="text-sm text-gray-400">
                    Candidates will appear here when students apply to your programs
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Results count */}
      {candidates.length > 0 && (
        <p className="text-sm text-gray-500">
          Showing {candidates.length} candidate{candidates.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
