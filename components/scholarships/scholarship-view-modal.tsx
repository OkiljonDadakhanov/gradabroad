"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Scholarship } from "@/types/scholarship";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";

interface ScholarshipViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  scholarship: Scholarship;
  programName: string; // passed from parent
}

export function ScholarshipViewModal({
  isOpen,
  onClose,
  scholarship,
  programName,
}: ScholarshipViewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {scholarship.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <Card className="p-4 space-y-3">
            <div>
              <p className="text-sm text-gray-500">Academic Program</p>
              <p className="font-medium">{programName}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Coverage</p>
              <p className="font-medium">{scholarship.coverage || "-"}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Eligibility Criteria</p>
              <p className="font-medium">
                {scholarship.eligibility_criteria || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Application Deadline</p>
              <p className="font-medium">
                {scholarship.application_deadline
                  ? format(
                      new Date(scholarship.application_deadline),
                      "yyyy-MM-dd"
                    )
                  : "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium">
                {scholarship.is_active ? "Active" : "Inactive"}
              </p>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button
              onClick={onClose}
              className="bg-purple-900 hover:bg-purple-800 text-white"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
