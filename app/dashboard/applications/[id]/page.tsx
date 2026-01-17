"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { StudentLayout } from "@/components/student/student-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { ENDPOINTS, STATUS_COLORS, STATUS_LABELS, APPLICATION_STATUS_FLOW } from "@/lib/constants";
import { Application, ApplicationDocument } from "@/types/application";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  GraduationCap,
  Calendar,
  FileText,
  MessageSquare,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  ChevronLeft,
  Building,
  MapPin,
} from "lucide-react";
import Link from "next/link";

export default function ApplicationDetailPage() {
  const params = useParams();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchApplication();
    }
  }, [params.id]);

  async function fetchApplication() {
    try {
      const res = await fetchWithAuth(ENDPOINTS.APPLICATION(Number(params.id)));
      if (res.ok) {
        const data = await res.json();
        setApplication(data);
      } else if (res.status === 404) {
        setError("Application not found");
      } else {
        setError("Failed to load application");
      }
    } catch (err) {
      console.error("Error fetching application:", err);
      setError("Failed to load application");
    } finally {
      setLoading(false);
    }
  }

  const getStatusIcon = (status: string) => {
    if (status === "rejected") return <XCircle className="h-5 w-5 text-red-500" />;
    if (["accepted", "confirmed", "visa_taken", "studying"].includes(status)) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    return <Clock className="h-5 w-5 text-yellow-500" />;
  };

  const getDocStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  if (loading) {
    return (
      <StudentLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-48" />
              <Skeleton className="h-64" />
            </div>
            <Skeleton className="h-64" />
          </div>
        </div>
      </StudentLayout>
    );
  }

  if (error || !application) {
    return (
      <StudentLayout>
        <div className="text-center py-16">
          <GraduationCap className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {error || "Application not found"}
          </h2>
          <Link href="/dashboard/applications">
            <Button variant="outline">
              <ChevronLeft size={16} className="mr-1" />
              Back to Applications
            </Button>
          </Link>
        </div>
      </StudentLayout>
    );
  }

  const currentStatusIndex = APPLICATION_STATUS_FLOW.indexOf(application.status);

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <Link
          href="/dashboard/applications"
          className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800"
        >
          <ChevronLeft size={16} />
          Back to Applications
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {application.programme?.name || "Application"}
              </h1>
              <Badge
                className={cn(
                  STATUS_COLORS[application.status] || "bg-gray-100"
                )}
              >
                {STATUS_LABELS[application.status] || application.status}
              </Badge>
            </div>
            <p className="text-gray-500">
              Application #{application.id} • Applied {formatDate(application.created_at)}
            </p>
          </div>
          <Link href={`/dashboard/applications/${application.id}/chat`}>
            <Button>
              <MessageSquare size={16} className="mr-2" />
              Chat with University
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Application Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="flex justify-between">
                    {APPLICATION_STATUS_FLOW.slice(0, 6).map((status, index) => {
                      const isCompleted = index < currentStatusIndex;
                      const isCurrent = index === currentStatusIndex;
                      const isRejected = application.status === "rejected";

                      return (
                        <div key={status} className="flex flex-col items-center flex-1">
                          <div
                            className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border-2",
                              isCompleted
                                ? "bg-purple-600 border-purple-600 text-white"
                                : isCurrent
                                ? isRejected
                                  ? "bg-red-100 border-red-500 text-red-700"
                                  : "bg-purple-100 border-purple-500 text-purple-700"
                                : "bg-gray-100 border-gray-300 text-gray-500"
                            )}
                          >
                            {isCompleted ? (
                              <CheckCircle size={16} />
                            ) : isCurrent && isRejected ? (
                              <XCircle size={16} />
                            ) : (
                              index + 1
                            )}
                          </div>
                          <p
                            className={cn(
                              "text-xs mt-2 text-center",
                              isCurrent ? "font-medium text-gray-900" : "text-gray-500"
                            )}
                          >
                            {STATUS_LABELS[status]}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  {/* Progress line */}
                  <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200 -z-10" />
                  <div
                    className="absolute top-4 left-4 h-0.5 bg-purple-600 -z-10"
                    style={{
                      width: `${Math.max(0, (currentStatusIndex / 5) * 100)}%`,
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText size={18} />
                  Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                {application.documents && application.documents.length > 0 ? (
                  <div className="space-y-3">
                    {application.documents.map((doc: ApplicationDocument) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {getDocStatusIcon(doc.status)}
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
                            variant="outline"
                            className={cn(
                              "text-xs",
                              doc.status === "approved"
                                ? "border-green-300 text-green-700"
                                : doc.status === "rejected"
                                ? "border-red-300 text-red-700"
                                : "border-yellow-300 text-yellow-700"
                            )}
                          >
                            {doc.status}
                          </Badge>
                          {doc.file_url && (
                            <a
                              href={doc.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button variant="ghost" size="sm">
                                <Download size={14} />
                              </Button>
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                    <p>No documents uploaded yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Program Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <GraduationCap size={18} />
                  Program Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Program</p>
                  <p className="font-medium">{application.programme?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">University</p>
                  <p className="font-medium flex items-center gap-1">
                    <Building size={14} />
                    {application.programme?.university_name || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Degree Type</p>
                  <p className="font-medium">{application.programme?.degree_type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Field of Study</p>
                  <p className="font-medium">{application.programme?.field_of_study}</p>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar size={18} />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Created</span>
                  <span>{formatDate(application.created_at)}</span>
                </div>
                {application.submitted_at && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Submitted</span>
                    <span>{formatDate(application.submitted_at)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Updated</span>
                  <span>{formatDate(application.updated_at)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link
                  href={`/dashboard/applications/${application.id}/chat`}
                  className="block"
                >
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare size={16} className="mr-2" />
                    Message University
                  </Button>
                </Link>
                {application.programme?.id && (
                  <Link
                    href={`/programs/${application.programme.id}`}
                    className="block"
                  >
                    <Button variant="outline" className="w-full justify-start">
                      <GraduationCap size={16} className="mr-2" />
                      View Program
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
