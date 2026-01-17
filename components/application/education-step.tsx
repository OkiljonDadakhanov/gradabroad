"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const educationSchema = z.object({
  highest_degree: z.string().min(1, "Degree level is required"),
  institution_name: z.string().min(1, "Institution name is required"),
  field_of_study: z.string().min(1, "Field of study is required"),
  graduation_year: z.string().min(1, "Graduation year is required"),
  gpa: z.string().optional(),
  english_proficiency: z.string().min(1, "English proficiency is required"),
  english_test_score: z.string().optional(),
  additional_qualifications: z.string().optional(),
});

export type EducationData = z.infer<typeof educationSchema>;

interface EducationStepProps {
  data: Partial<EducationData>;
  onNext: (data: EducationData) => void;
  onBack: () => void;
}

const DEGREE_LEVELS = [
  "High School Diploma",
  "Associate Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "Doctoral Degree",
  "Professional Degree",
];

const ENGLISH_PROFICIENCY = [
  "Native Speaker",
  "IELTS",
  "TOEFL",
  "Cambridge (CAE/CPE)",
  "Duolingo English Test",
  "Other",
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 50 }, (_, i) => (CURRENT_YEAR - i).toString());

export function EducationStep({ data, onNext, onBack }: EducationStepProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EducationData>({
    resolver: zodResolver(educationSchema),
    defaultValues: data,
  });

  const highestDegree = watch("highest_degree");
  const graduationYear = watch("graduation_year");
  const englishProficiency = watch("english_proficiency");

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="highest_degree">Highest Degree Obtained *</Label>
          <Select
            value={highestDegree}
            onValueChange={(value) => setValue("highest_degree", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select degree level" />
            </SelectTrigger>
            <SelectContent>
              {DEGREE_LEVELS.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.highest_degree && (
            <p className="text-sm text-red-500">{errors.highest_degree.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="graduation_year">Graduation Year *</Label>
          <Select
            value={graduationYear}
            onValueChange={(value) => setValue("graduation_year", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {YEARS.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.graduation_year && (
            <p className="text-sm text-red-500">{errors.graduation_year.message}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="institution_name">Institution Name *</Label>
          <Input
            id="institution_name"
            {...register("institution_name")}
            placeholder="Name of your university or college"
          />
          {errors.institution_name && (
            <p className="text-sm text-red-500">{errors.institution_name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="field_of_study">Field of Study *</Label>
          <Input
            id="field_of_study"
            {...register("field_of_study")}
            placeholder="e.g., Computer Science, Business"
          />
          {errors.field_of_study && (
            <p className="text-sm text-red-500">{errors.field_of_study.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="gpa">GPA (if applicable)</Label>
          <Input
            id="gpa"
            {...register("gpa")}
            placeholder="e.g., 3.5/4.0"
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="font-medium text-gray-900 mb-4">English Proficiency</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="english_proficiency">Proficiency Type *</Label>
            <Select
              value={englishProficiency}
              onValueChange={(value) => setValue("english_proficiency", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select proficiency type" />
              </SelectTrigger>
              <SelectContent>
                {ENGLISH_PROFICIENCY.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.english_proficiency && (
              <p className="text-sm text-red-500">{errors.english_proficiency.message}</p>
            )}
          </div>

          {englishProficiency && englishProficiency !== "Native Speaker" && (
            <div className="space-y-2">
              <Label htmlFor="english_test_score">Test Score</Label>
              <Input
                id="english_test_score"
                {...register("english_test_score")}
                placeholder="e.g., IELTS 7.0, TOEFL 100"
              />
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="additional_qualifications">
          Additional Qualifications (optional)
        </Label>
        <Textarea
          id="additional_qualifications"
          {...register("additional_qualifications")}
          placeholder="List any relevant certifications, awards, publications, or work experience"
          rows={4}
        />
      </div>

      <div className="flex justify-between pt-6 border-t">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit">Continue</Button>
      </div>
    </form>
  );
}
