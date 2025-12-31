"use client";

import { useState, useEffect } from "react";
import { CandidatesTable } from "./candidates-table";
import { CandidateViewModal } from "./candidate-view-modal";
import { CandidateChatModal } from "./candidate-chat-modal";
import { useToast } from "@/hooks/use-toast";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { ENDPOINTS, STATUS_LABELS } from "@/lib/constants";
import { Candidate, STATUS_OPTIONS } from "@/types/candidate";
import { ApplicationStatus } from "@/types/application";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CandidatesSection() {
  const { toast } = useToast();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "">("");
  const [programFilter, setProgramFilter] = useState("");

  useEffect(() => {
    fetchCandidates();
  }, []);

  async function fetchCandidates() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetchWithAuth(ENDPOINTS.CANDIDATES);

      if (!res.ok) {
        throw new Error("Failed to fetch candidates");
      }

      const data = await res.json();
      // Handle both array and paginated response
      const candidatesList = Array.isArray(data) ? data : data.results || [];
      setCandidates(candidatesList);
    } catch (err: any) {
      console.error("Error fetching candidates:", err);
      setError(err.message || "Failed to load candidates");
    } finally {
      setLoading(false);
    }
  }

  // Get unique programs for filter dropdown
  const uniquePrograms = Array.from(
    new Set(candidates.map((c) => c.programme?.name).filter(Boolean))
  );

  const filteredCandidates = candidates.filter((candidate) => {
    const fullName = `${candidate.student?.first_name || ""} ${candidate.student?.last_name || ""}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
      candidate.student?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "" || candidate.status === statusFilter;
    const matchesProgram = programFilter === "" || candidate.programme?.name === programFilter;

    return matchesSearch && matchesStatus && matchesProgram;
  });

  const handleViewCandidate = (candidate: Candidate) => {
    setCurrentCandidate(candidate);
    setIsViewModalOpen(true);
  };

  const handleChatWithCandidate = (candidate: Candidate) => {
    setCurrentCandidate(candidate);
    setIsChatModalOpen(true);
  };

  const handleStatusChange = async (candidateId: number, newStatus: ApplicationStatus) => {
    try {
      const res = await fetchWithAuth(ENDPOINTS.CANDIDATE(candidateId), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to update status");
      }

      // Update local state
      setCandidates(
        candidates.map((c) =>
          c.id === candidateId ? { ...c, status: newStatus } : c
        )
      );

      toast({
        title: "Status updated",
        description: `Application status changed to ${STATUS_LABELS[newStatus] || newStatus}.`,
      });
    } catch (err: any) {
      console.error("Error updating status:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to update status",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="mb-6">
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="flex gap-4 mb-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="border rounded-md">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center p-4 border-b last:border-b-0">
              <Skeleton className="h-5 w-48 mr-4" />
              <Skeleton className="h-5 w-32 mr-4" />
              <Skeleton className="h-5 w-24 mr-4" />
              <Skeleton className="h-8 w-32 mr-4" />
              <Skeleton className="h-8 w-20 ml-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Failed to load candidates
        </h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <Button onClick={fetchCandidates} variant="outline">
          <RefreshCw size={16} className="mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-purple-900">Candidates</h2>
        <Button onClick={fetchCandidates} variant="outline" size="sm">
          <RefreshCw size={14} className="mr-2" />
          Refresh
        </Button>
      </div>

      <CandidatesTable
        candidates={filteredCandidates}
        onView={handleViewCandidate}
        onChat={handleChatWithCandidate}
        onStatusChange={handleStatusChange}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        programFilter={programFilter}
        onProgramFilterChange={setProgramFilter}
        programs={uniquePrograms}
      />

      {/* View Candidate Modal */}
      {currentCandidate && (
        <CandidateViewModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          candidate={currentCandidate}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Chat Modal */}
      <CandidateChatModal
        candidate={currentCandidate}
        open={isChatModalOpen}
        onOpenChange={setIsChatModalOpen}
      />
    </>
  );
}
