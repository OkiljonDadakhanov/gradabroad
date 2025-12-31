"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { StudentLayout } from "@/components/student/student-layout";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatContainer } from "@/components/chat/chat-container";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { ENDPOINTS, STATUS_COLORS, STATUS_LABELS } from "@/lib/constants";
import { Application } from "@/types/application";
import {
  ChevronLeft,
  GraduationCap,
  Building,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ApplicationChatPage() {
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

  if (loading) {
    return (
      <StudentLayout>
        <div className="h-[calc(100vh-8rem)] flex flex-col">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-20 mb-4" />
          <Skeleton className="flex-1" />
        </div>
      </StudentLayout>
    );
  }

  if (error || !application) {
    return (
      <StudentLayout>
        <div className="text-center py-16">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {error || "Application not found"}
          </h2>
          <Link
            href="/dashboard/applications"
            className="text-purple-600 hover:text-purple-800"
          >
            Back to Applications
          </Link>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="h-[calc(100vh-8rem)] flex flex-col">
        {/* Header */}
        <div className="mb-4">
          <Link
            href={`/dashboard/applications/${params.id}`}
            className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800 mb-3"
          >
            <ChevronLeft size={16} />
            Back to Application
          </Link>

          <Card>
            <CardHeader className="py-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Building className="h-5 w-5 text-purple-700" />
                  </div>
                  <div>
                    <CardTitle className="text-base">
                      {application.programme?.university_name || "University"}
                    </CardTitle>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <GraduationCap size={14} />
                      {application.programme?.name}
                    </p>
                  </div>
                </div>
                <Badge
                  className={cn(
                    STATUS_COLORS[application.status] || "bg-gray-100"
                  )}
                >
                  {STATUS_LABELS[application.status] || application.status}
                </Badge>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Chat Container */}
        <Card className="flex-1 overflow-hidden">
          <ChatContainer
            applicationId={Number(params.id)}
            userType="student"
            className="h-full"
          />
        </Card>
      </div>
    </StudentLayout>
  );
}
