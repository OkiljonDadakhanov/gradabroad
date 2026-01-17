"use client";

import { useState, useEffect } from "react";
import { StudentLayout } from "@/components/student/student-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { ENDPOINTS, STATUS_COLORS, STATUS_LABELS } from "@/lib/constants";
import { Application, ApplicationStatus } from "@/types/application";
import { STATUS_OPTIONS } from "@/types/candidate";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  Search,
  GraduationCap,
  Calendar,
  FileText,
  MessageSquare,
  Plus,
} from "lucide-react";
import Link from "next/link";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "">("");

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

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.programme?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.programme?.university_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
            <p className="text-gray-500">
              Track and manage all your program applications
            </p>
          </div>
          <Link href="/programs">
            <Button>
              <Plus size={16} className="mr-2" />
              New Application
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by program or university..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={statusFilter || "all"}
            onValueChange={(value) =>
              setStatusFilter(value === "all" ? "" : (value as ApplicationStatus))
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All statuses" />
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
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-14 w-14 rounded-lg" />
                    <div className="flex-1">
                      <Skeleton className="h-6 w-64 mb-2" />
                      <Skeleton className="h-4 w-48 mb-3" />
                      <div className="flex gap-4">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-28" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredApplications.length > 0 ? (
          <div className="space-y-4">
            {filteredApplications.map((app) => (
              <Card key={app.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="p-3 bg-purple-100 rounded-lg self-start">
                      <GraduationCap className="h-8 w-8 text-purple-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {app.programme?.name || "Unknown Program"}
                        </h3>
                        <Badge
                          className={cn(
                            "text-xs",
                            STATUS_COLORS[app.status] || "bg-gray-100"
                          )}
                        >
                          {STATUS_LABELS[app.status] || app.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">
                        {app.programme?.university_name || "University"} •{" "}
                        {app.programme?.degree_type}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          Applied {formatDate(app.created_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText size={14} />
                          {app.documents?.length || 0} documents
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 self-start">
                      <Link href={`/dashboard/applications/${app.id}/chat`}>
                        <Button variant="outline" size="sm">
                          <MessageSquare size={14} className="mr-1" />
                          Chat
                        </Button>
                      </Link>
                      <Link href={`/dashboard/applications/${app.id}`}>
                        <Button size="sm">View Details</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <GraduationCap className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {applications.length === 0
                  ? "No applications yet"
                  : "No matching applications"}
              </h3>
              <p className="text-gray-500 mb-6">
                {applications.length === 0
                  ? "Start your journey by applying to a program"
                  : "Try adjusting your search or filter"}
              </p>
              {applications.length === 0 && (
                <Link href="/programs">
                  <Button>
                    <Plus size={16} className="mr-2" />
                    Browse Programs
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}

        {/* Results count */}
        {!loading && filteredApplications.length > 0 && (
          <p className="text-sm text-gray-500">
            Showing {filteredApplications.length} of {applications.length}{" "}
            application{applications.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>
    </StudentLayout>
  );
}
