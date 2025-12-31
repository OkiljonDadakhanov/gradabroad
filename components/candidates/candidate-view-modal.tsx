"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Candidate, STATUS_OPTIONS, CandidateDocument } from "@/types/candidate";
import { ApplicationStatus } from "@/types/application";
import { STATUS_COLORS, STATUS_LABELS, DOCUMENT_STATUS_COLORS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  FileText,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
} from "lucide-react";

interface CandidateViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate;
  onStatusChange: (candidateId: number, status: ApplicationStatus) => void;
}

export function CandidateViewModal({
  isOpen,
  onClose,
  candidate,
  onStatusChange,
}: CandidateViewModalProps) {
  const getDocumentStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-purple-900">
              Application Details
            </DialogTitle>
            <Badge
              className={cn(
                "ml-4",
                STATUS_COLORS[candidate.status] || "bg-gray-100"
              )}
            >
              {STATUS_LABELS[candidate.status] || candidate.status}
            </Badge>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">
              Documents ({candidate.documents?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-4">
            {/* Student Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <User size={18} />
                  Student Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Full Name</p>
                  <p className="font-medium">
                    {candidate.student?.first_name} {candidate.student?.last_name}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 flex items-center gap-1">
                    <Mail size={12} />
                    Email
                  </p>
                  <p className="font-medium">{candidate.student?.email}</p>
                </div>
                {candidate.student?.phone && (
                  <div>
                    <p className="text-gray-500 flex items-center gap-1">
                      <Phone size={12} />
                      Phone
                    </p>
                    <p className="font-medium">{candidate.student?.phone}</p>
                  </div>
                )}
                {candidate.student?.country && (
                  <div>
                    <p className="text-gray-500 flex items-center gap-1">
                      <MapPin size={12} />
                      Country
                    </p>
                    <p className="font-medium">{candidate.student?.country}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Program Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <GraduationCap size={18} />
                  Program Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Program Name</p>
                  <p className="font-medium">{candidate.programme?.name}</p>
                </div>
                <div>
                  <p className="text-gray-500">Degree Type</p>
                  <p className="font-medium">{candidate.programme?.degree_type}</p>
                </div>
                <div>
                  <p className="text-gray-500">Field of Study</p>
                  <p className="font-medium">{candidate.programme?.field_of_study}</p>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar size={18} />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Created</span>
                  <span>{formatDate(candidate.created_at)}</span>
                </div>
                {candidate.submitted_at && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Submitted</span>
                    <span>{formatDate(candidate.submitted_at)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Updated</span>
                  <span>{formatDate(candidate.updated_at)}</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                {candidate.documents && candidate.documents.length > 0 ? (
                  <div className="space-y-3">
                    {candidate.documents.map((doc: CandidateDocument) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {getDocumentStatusIcon(doc.status)}
                          <div>
                            <p className="font-medium text-sm">
                              {doc.document_type_name || doc.document_type}
                            </p>
                            <p className="text-xs text-gray-500">
                              Uploaded {formatDate(doc.uploaded_at)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={cn(
                              "text-xs",
                              DOCUMENT_STATUS_COLORS[doc.status] || "bg-gray-100"
                            )}
                          >
                            {doc.status}
                          </Badge>
                          {doc.file_url && (
                            <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" size="sm">
                                <Download size={14} className="mr-1" />
                                View
                              </Button>
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                    <p>No documents uploaded yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="actions" className="mt-4 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Update Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={candidate.status}
                  onValueChange={(value) =>
                    onStatusChange(candidate.id, value as ApplicationStatus)
                  }
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-3">
                <Button variant="outline">
                  <MessageSquare size={16} className="mr-2" />
                  Message Student
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
