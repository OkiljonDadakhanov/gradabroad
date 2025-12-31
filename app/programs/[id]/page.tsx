"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PublicProgram } from "@/types/program";
import { fetchPublic, isAuthenticated } from "@/lib/fetchWithAuth";
import { ENDPOINTS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  GraduationCap,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  Globe,
  ChevronLeft,
  Download,
  Clock,
  CheckCircle,
  Building,
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default function ProgramDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [program, setProgram] = useState<PublicProgram | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchProgram();
    }
  }, [params.id]);

  async function fetchProgram() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetchPublic(ENDPOINTS.PROGRAM_DETAIL(Number(params.id)));

      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Program not found");
        }
        throw new Error("Failed to fetch program details");
      }

      const data = await res.json();
      setProgram(data);
    } catch (err: any) {
      console.error("Error fetching program:", err);
      setError(err.message || "Failed to load program details");
    } finally {
      setLoading(false);
    }
  }

  const handleApply = () => {
    if (!isAuthenticated()) {
      window.location.href = `https://www.gradabroad.net/login?redirect=/programs/${params.id}/apply`;
      return;
    }
    router.push(`/programs/${params.id}/apply`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-64 w-full" />
            </div>
            <div>
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <GraduationCap className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {error || "Program not found"}
          </h2>
          <p className="text-gray-500 mb-6">
            The program you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/programs">
            <Button>
              <ChevronLeft size={18} className="mr-1" />
              Back to Programs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-purple-700" />
              <span className="font-bold text-xl text-gray-900">GradAbroad</span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link href="/programs" className="text-gray-600 hover:text-gray-900">
                Programs
              </Link>
              <Button onClick={handleApply}>Apply Now</Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link
            href="/programs"
            className="text-purple-600 hover:text-purple-800 flex items-center gap-1 text-sm"
          >
            <ChevronLeft size={16} />
            Back to Programs
          </Link>
        </nav>

        {/* Program Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-2xl">
              {program.university.name.charAt(0)}
            </div>
            <div>
              <p className="text-gray-600">{program.university.name}</p>
              {program.university.city && (
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <MapPin size={14} />
                  {program.university.city}, South Korea
                </p>
              )}
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{program.name}</h1>

          <div className="flex flex-wrap gap-3">
            <Badge variant="secondary" className="text-sm py-1 px-3">
              <GraduationCap size={14} className="mr-1" />
              {program.degree_type}
            </Badge>
            <Badge variant="outline" className="text-sm py-1 px-3">
              {program.field_of_study}
            </Badge>
            {program.active && (
              <Badge className="bg-green-100 text-green-700 text-sm py-1 px-3">
                <CheckCircle size={14} className="mr-1" />
                Accepting Applications
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Key Details */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                      <DollarSign size={14} />
                      Tuition Fee
                    </div>
                    <p className="font-semibold text-gray-900">
                      ${parseFloat(program.tuition_fee).toLocaleString()}/sem
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                      <Calendar size={14} />
                      Start Date
                    </div>
                    <p className="font-semibold text-gray-900">
                      {formatDate(program.start_date)}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                      <Clock size={14} />
                      Duration
                    </div>
                    <p className="font-semibold text-gray-900">
                      {program.start_date && program.end_date
                        ? `${Math.ceil(
                            (new Date(program.end_date).getTime() -
                              new Date(program.start_date).getTime()) /
                              (1000 * 60 * 60 * 24 * 365)
                          )} years`
                        : "Contact for info"}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                      <FileText size={14} />
                      Platform Fee
                    </div>
                    <p className="font-semibold text-gray-900">
                      ${parseFloat(program.platform_fee).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Program Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Program</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="english">
                  <TabsList className="mb-4">
                    <TabsTrigger value="english">English</TabsTrigger>
                    {program.about_program_korean && (
                      <TabsTrigger value="korean">한국어</TabsTrigger>
                    )}
                    {program.about_program_russian && (
                      <TabsTrigger value="russian">Русский</TabsTrigger>
                    )}
                    {program.about_program_uzbek && (
                      <TabsTrigger value="uzbek">O'zbek</TabsTrigger>
                    )}
                  </TabsList>
                  <TabsContent value="english">
                    <div
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: program.about_program }}
                    />
                  </TabsContent>
                  {program.about_program_korean && (
                    <TabsContent value="korean">
                      <div
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: program.about_program_korean,
                        }}
                      />
                    </TabsContent>
                  )}
                  {program.about_program_russian && (
                    <TabsContent value="russian">
                      <div
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: program.about_program_russian,
                        }}
                      />
                    </TabsContent>
                  )}
                  {program.about_program_uzbek && (
                    <TabsContent value="uzbek">
                      <div
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: program.about_program_uzbek,
                        }}
                      />
                    </TabsContent>
                  )}
                </Tabs>
              </CardContent>
            </Card>

            {/* Requirements */}
            {program.requirements && program.requirements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {program.requirements.map((req, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <CheckCircle
                          size={18}
                          className={
                            req.required ? "text-purple-600" : "text-gray-400"
                          }
                        />
                        <div>
                          <p className="font-medium text-gray-900">{req.label}</p>
                          {req.min_score && (
                            <p className="text-sm text-gray-500">
                              Minimum score: {req.min_score}
                              {req.max_score && ` - ${req.max_score}`}
                            </p>
                          )}
                          {req.note && (
                            <p className="text-sm text-gray-500">{req.note}</p>
                          )}
                        </div>
                        {req.required && (
                          <Badge variant="secondary" className="ml-auto text-xs">
                            Required
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Required Documents */}
            {program.document_types && program.document_types.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Required Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {program.document_types.map((doc, index) => (
                      <Badge key={index} variant="outline" className="py-1 px-3">
                        <FileText size={14} className="mr-1" />
                        {doc}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg text-gray-900 mb-4">
                  Ready to Apply?
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Start your application today and take the first step towards
                  studying in Korea.
                </p>
                <Button className="w-full mb-4" size="lg" onClick={handleApply}>
                  Apply Now
                </Button>

                {program.results_announcement_date && (
                  <div className="text-sm text-gray-500 text-center">
                    <Clock size={14} className="inline mr-1" />
                    Results announced: {formatDate(program.results_announcement_date)}
                  </div>
                )}

                {/* Download Links */}
                {(program.application_guide_url || program.application_form_url) && (
                  <div className="mt-6 pt-6 border-t space-y-3">
                    <p className="text-sm font-medium text-gray-700">Resources</p>
                    {program.application_guide_url && (
                      <a
                        href={program.application_guide_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800"
                      >
                        <Download size={14} />
                        Download Application Guide
                      </a>
                    )}
                    {program.application_form_url && (
                      <a
                        href={program.application_form_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800"
                      >
                        <Download size={14} />
                        Download Application Form
                      </a>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* University Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">About the University</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-lg">
                    {program.university.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {program.university.name}
                    </p>
                    {program.university.city && (
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin size={12} />
                        {program.university.city}
                      </p>
                    )}
                  </div>
                </div>
                {program.university.website && (
                  <a
                    href={program.university.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800"
                  >
                    <Globe size={14} />
                    Visit University Website
                  </a>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-purple-700" />
              <span className="font-semibold text-gray-900">GradAbroad</span>
            </div>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} GradAbroad. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
