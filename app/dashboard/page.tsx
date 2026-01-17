"use client";

import { useState, useEffect } from "react";
import { StudentLayout } from "@/components/student/student-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { ENDPOINTS, STATUS_COLORS, STATUS_LABELS } from "@/lib/constants";
import { Application } from "@/types/application";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  FileText,
  Clock,
  CheckCircle,
  GraduationCap,
  ArrowRight,
  Plus,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    try {
      const res = await fetchWithAuth(ENDPOINTS.MY_APPLICATIONS);
      if (res.ok) {
        const data = await res.json();
        setApplications(Array.isArray(data) ? data : data.results || []);
      }
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setLoading(false);
    }
  }

  const stats = {
    total: applications.length,
    pending: applications.filter((a) =>
      ["draft", "document_saved", "submitted", "under_review"].includes(a.status)
    ).length,
    accepted: applications.filter((a) =>
      ["accepted", "confirmed", "visa_taken", "studying"].includes(a.status)
    ).length,
  };

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500">
              Track your applications and manage your profile
            </p>
          </div>
          <Link href="/programs">
            <Button>
              <Plus size={16} className="mr-2" />
              Apply to Program
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FileText className="h-6 w-6 text-purple-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Applications</p>
                  <p className="text-2xl font-bold">
                    {loading ? <Skeleton className="h-8 w-12" /> : stats.total}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">In Progress</p>
                  <p className="text-2xl font-bold">
                    {loading ? <Skeleton className="h-8 w-12" /> : stats.pending}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Accepted</p>
                  <p className="text-2xl font-bold">
                    {loading ? <Skeleton className="h-8 w-12" /> : stats.accepted}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Applications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Applications</CardTitle>
            {applications.length > 0 && (
              <Link href="/dashboard/applications">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight size={14} className="ml-1" />
                </Button>
              </Link>
            )}
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-48 mb-2" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-6 w-24" />
                  </div>
                ))}
              </div>
            ) : applications.length > 0 ? (
              <div className="space-y-4">
                {applications.slice(0, 5).map((app) => (
                  <Link
                    key={app.id}
                    href={`/dashboard/applications/${app.id}`}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <GraduationCap className="h-6 w-6 text-purple-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {app.programme?.name || "Unknown Program"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Applied {formatDate(app.created_at)}
                      </p>
                    </div>
                    <Badge
                      className={cn(
                        STATUS_COLORS[app.status] || "bg-gray-100"
                      )}
                    >
                      {STATUS_LABELS[app.status] || app.status}
                    </Badge>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <GraduationCap className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No applications yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Start your journey by applying to a program
                </p>
                <Link href="/programs">
                  <Button>
                    <Plus size={16} className="mr-2" />
                    Browse Programs
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </StudentLayout>
  );
}
