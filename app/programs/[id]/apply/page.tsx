"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { WizardProgress } from "@/components/application/wizard-progress";
import { PersonalInfoStep, PersonalInfoData } from "@/components/application/personal-info-step";
import { EducationStep, EducationData } from "@/components/application/education-step";
import { DocumentsStep, DocumentFile } from "@/components/application/documents-step";
import { ReviewStep } from "@/components/application/review-step";
import { fetchWithAuth, fetchPublic, isAuthenticated } from "@/lib/fetchWithAuth";
import { ENDPOINTS } from "@/lib/constants";
import { PublicProgram } from "@/types/program";
import { toast } from "sonner";
import {
  GraduationCap,
  ChevronLeft,
  Building,
  Calendar,
  DollarSign,
  CheckCircle,
} from "lucide-react";

const WIZARD_STEPS = ["Personal Info", "Education", "Documents", "Review"];

const REQUIRED_DOCUMENTS = [
  "passport",
  "transcript",
  "diploma",
  "cv",
  "motivation_letter",
  "english_certificate",
];

export default function ApplyPage() {
  const params = useParams();
  const router = useRouter();
  const [program, setProgram] = useState<PublicProgram | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState<number | null>(null);

  // Form data states
  const [personalInfo, setPersonalInfo] = useState<Partial<PersonalInfoData>>({});
  const [education, setEducation] = useState<Partial<EducationData>>({});
  const [documents, setDocuments] = useState<DocumentFile[]>([]);

  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error("Please login to apply");
      window.location.href = "https://www.gradabroad.net/login";
      return;
    }
    fetchProgram();
  }, [params.id]);

  async function fetchProgram() {
    try {
      const res = await fetchPublic(`${ENDPOINTS.PROGRAMS}${params.id}/`);
      if (res.ok) {
        const data = await res.json();
        setProgram(data);
      } else {
        toast.error("Program not found");
        router.push("/programs");
      }
    } catch (err) {
      console.error("Error fetching program:", err);
      toast.error("Failed to load program");
    } finally {
      setLoading(false);
    }
  }

  const handlePersonalInfoNext = (data: PersonalInfoData) => {
    setPersonalInfo(data);
    setCurrentStep(1);
  };

  const handleEducationNext = (data: EducationData) => {
    setEducation(data);
    setCurrentStep(2);
  };

  const handleDocumentsNext = () => {
    setCurrentStep(3);
  };

  const handleSubmit = async () => {
    try {
      // Create application
      const createRes = await fetchWithAuth(ENDPOINTS.MY_APPLICATIONS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          programme_id: Number(params.id),
          personal_info: personalInfo,
          education: education,
        }),
      });

      if (!createRes.ok) {
        const error = await createRes.json();
        throw new Error(error.detail || "Failed to create application");
      }

      const application = await createRes.json();
      setApplicationId(application.id);

      // Upload documents
      for (const doc of documents) {
        if (doc.file && doc.status === "uploaded") {
          const formData = new FormData();
          formData.append("file", doc.file);
          formData.append("document_type", doc.type);
          formData.append("application_id", application.id.toString());

          await fetchWithAuth(ENDPOINTS.APPLICATION_DOCS, {
            method: "POST",
            body: formData,
          });
        }
      }

      // Submit application
      await fetchWithAuth(ENDPOINTS.APPLICATION(application.id), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "submitted" }),
      });

      setSubmitted(true);
      toast.success("Application submitted successfully!");
    } catch (err) {
      console.error("Error submitting application:", err);
      toast.error(err instanceof Error ? err.message : "Failed to submit application");
      throw err;
    }
  };

  const handleEdit = (step: number) => {
    setCurrentStep(step);
  };

  const handleCancel = () => {
    router.push(`/programs/${params.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Skeleton className="h-8 w-48 mb-8" />
          <Skeleton className="h-24 mb-6" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <GraduationCap className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Program not found</h2>
          <Link href="/programs">
            <Button>Browse Programs</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                Application Submitted!
              </h1>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Your application for <strong>{program.name}</strong> has been
                submitted successfully. You can track its progress in your
                dashboard.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href={`/dashboard/applications/${applicationId}`}>
                  <Button>View Application</Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline">Go to Dashboard</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back link */}
        <Link
          href={`/programs/${params.id}`}
          className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800 mb-6"
        >
          <ChevronLeft size={16} />
          Back to Program
        </Link>

        {/* Program Summary Card */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg self-start">
                <GraduationCap className="h-8 w-8 text-purple-700" />
              </div>
              <div className="flex-1">
                <h1 className="font-semibold text-gray-900">{program.name}</h1>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Building size={14} />
                    {program.university.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    Starts {program.start_date}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign size={14} />
                    {program.tuition_fee
                      ? `$${parseFloat(program.tuition_fee).toLocaleString()}`
                      : "Contact for price"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wizard Progress */}
        <div className="mb-8">
          <WizardProgress steps={WIZARD_STEPS} currentStep={currentStep} />
        </div>

        {/* Wizard Content */}
        <Card>
          <CardHeader>
            <CardTitle>{WIZARD_STEPS[currentStep]}</CardTitle>
          </CardHeader>
          <CardContent>
            {currentStep === 0 && (
              <PersonalInfoStep
                data={personalInfo}
                onNext={handlePersonalInfoNext}
                onCancel={handleCancel}
              />
            )}
            {currentStep === 1 && (
              <EducationStep
                data={education}
                onNext={handleEducationNext}
                onBack={() => setCurrentStep(0)}
              />
            )}
            {currentStep === 2 && (
              <DocumentsStep
                documents={documents}
                requiredDocuments={REQUIRED_DOCUMENTS}
                onDocumentsChange={setDocuments}
                onNext={handleDocumentsNext}
                onBack={() => setCurrentStep(1)}
              />
            )}
            {currentStep === 3 && (
              <ReviewStep
                personalInfo={personalInfo as PersonalInfoData}
                education={education as EducationData}
                documents={documents}
                programName={program.name}
                onSubmit={handleSubmit}
                onBack={() => setCurrentStep(2)}
                onEdit={handleEdit}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
