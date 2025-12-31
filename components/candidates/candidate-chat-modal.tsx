"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ChatContainer } from "@/components/chat/chat-container";
import { Candidate } from "@/types/candidate";
import { STATUS_COLORS, STATUS_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { User, GraduationCap } from "lucide-react";

interface CandidateChatModalProps {
  candidate: Candidate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CandidateChatModal({
  candidate,
  open,
  onOpenChange,
}: CandidateChatModalProps) {
  if (!candidate) return null;

  const studentName = candidate.student
    ? `${candidate.student.first_name || ""} ${candidate.student.last_name || ""}`.trim() ||
      candidate.student.email
    : "Unknown Student";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-full">
                <User className="h-5 w-5 text-purple-700" />
              </div>
              <div>
                <DialogTitle className="text-left">{studentName}</DialogTitle>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                  <GraduationCap size={14} />
                  {candidate.programme?.name || "Unknown Program"}
                </p>
              </div>
            </div>
            <Badge
              className={cn(
                STATUS_COLORS[candidate.status] || "bg-gray-100"
              )}
            >
              {STATUS_LABELS[candidate.status] || candidate.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <ChatContainer
            applicationId={candidate.id}
            userType="university"
            className="h-full"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
