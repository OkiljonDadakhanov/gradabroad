"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PersonalInfoData } from "./personal-info-step";
import { EducationData } from "./education-step";
import { DocumentFile } from "./documents-step";
import {
  User,
  GraduationCap,
  FileText,
  CheckCircle,
  Edit,
  Loader2,
} from "lucide-react";
import { useState } from "react";

interface ReviewStepProps {
  personalInfo: PersonalInfoData;
  education: EducationData;
  documents: DocumentFile[];
  programName: string;
  onSubmit: () => Promise<void>;
  onBack: () => void;
  onEdit: (step: number) => void;
}

export function ReviewStep({
  personalInfo,
  education,
  documents,
  programName,
  onSubmit,
  onBack,
  onEdit,
}: ReviewStepProps) {
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!agreed) return;
    setSubmitting(true);
    try {
      await onSubmit();
    } finally {
      setSubmitting(false);
    }
  };

  const uploadedDocs = documents.filter((d) => d.status === "uploaded");

  return (
    <div className="space-y-6">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <p className="text-purple-800 text-sm">
          Please review your application details before submitting. You can edit
          any section by clicking the edit button.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <CardTitle className="text-base flex items-center gap-2">
            <User size={18} />
            Personal Information
          </CardTitle>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onEdit(0)}
          >
            <Edit size={14} className="mr-1" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Full Name</p>
              <p className="font-medium">
                {personalInfo.first_name} {personalInfo.last_name}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium">{personalInfo.email}</p>
            </div>
            <div>
              <p className="text-gray-500">Phone</p>
              <p className="font-medium">{personalInfo.phone}</p>
            </div>
            <div>
              <p className="text-gray-500">Date of Birth</p>
              <p className="font-medium">{personalInfo.date_of_birth}</p>
            </div>
            <div>
              <p className="text-gray-500">Nationality</p>
              <p className="font-medium">{personalInfo.nationality}</p>
            </div>
            <div>
              <p className="text-gray-500">Country of Residence</p>
              <p className="font-medium">{personalInfo.country_of_residence}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-gray-500">Address</p>
              <p className="font-medium">{personalInfo.address}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <CardTitle className="text-base flex items-center gap-2">
            <GraduationCap size={18} />
            Education Background
          </CardTitle>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onEdit(1)}
          >
            <Edit size={14} className="mr-1" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Highest Degree</p>
              <p className="font-medium">{education.highest_degree}</p>
            </div>
            <div>
              <p className="text-gray-500">Institution</p>
              <p className="font-medium">{education.institution_name}</p>
            </div>
            <div>
              <p className="text-gray-500">Field of Study</p>
              <p className="font-medium">{education.field_of_study}</p>
            </div>
            <div>
              <p className="text-gray-500">Graduation Year</p>
              <p className="font-medium">{education.graduation_year}</p>
            </div>
            {education.gpa && (
              <div>
                <p className="text-gray-500">GPA</p>
                <p className="font-medium">{education.gpa}</p>
              </div>
            )}
            <div>
              <p className="text-gray-500">English Proficiency</p>
              <p className="font-medium">
                {education.english_proficiency}
                {education.english_test_score &&
                  ` (${education.english_test_score})`}
              </p>
            </div>
            {education.additional_qualifications && (
              <div className="md:col-span-2">
                <p className="text-gray-500">Additional Qualifications</p>
                <p className="font-medium">
                  {education.additional_qualifications}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText size={18} />
            Documents ({uploadedDocs.length} uploaded)
          </CardTitle>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onEdit(2)}
          >
            <Edit size={14} className="mr-1" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-2">
            {uploadedDocs.map((doc) => (
              <Badge
                key={doc.id}
                variant="outline"
                className="flex items-center gap-1"
              >
                <CheckCircle size={12} className="text-green-600" />
                {doc.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-50">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Checkbox
                id="terms"
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked === true)}
              />
              <Label htmlFor="terms" className="text-sm leading-relaxed">
                I confirm that all information provided is accurate and complete.
                I understand that providing false information may result in the
                rejection of my application or cancellation of my enrollment. I
                agree to the terms and conditions of <strong>{programName}</strong>.
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-6 border-t">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!agreed || submitting}
          className="min-w-[140px]"
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Application"
          )}
        </Button>
      </div>
    </div>
  );
}
