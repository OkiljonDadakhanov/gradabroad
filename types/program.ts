export interface University {
  id: number;
  name: string;
  logo_url?: string;
  city?: string;
  country?: string;
  website?: string;
}

export interface ProgramRequirement {
  id: number;
  requirementType: "document" | "english" | "language" | "score" | "text" | "file" | "passport" | "gpa" | string;
  label: string;
  required: boolean;
  note?: string;
  matching_doc_type?: string;
}

export interface PublicProgram {
  id: number;
  name: string;
  university: University;
  field_of_study: string;
  degree_type: string;
  tuition_fee: string;
  platform_fee: string;
  start_date: string;
  end_date: string;
  results_announcement_date?: string;
  about_program: string;
  about_program_korean?: string;
  about_program_russian?: string;
  about_program_uzbek?: string;
  requirements: ProgramRequirement[];
  document_types: string[];
  application_guide_url?: string;
  application_form_url?: string;
  active: boolean;
}

export interface ProgramFilters {
  search?: string;
  field_of_study?: string;
  degree_type?: string;
  min_price?: number;
  max_price?: number;
  university_id?: number;
}

export interface ProgramsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PublicProgram[];
}

export const DEGREE_TYPES = [
  { value: "Bachelors", label: "Bachelor's Degree" },
  { value: "Masters", label: "Master's Degree" },
  { value: "PhD", label: "PhD / Doctorate" },
  { value: "Language", label: "Language Program" },
  { value: "Exchange", label: "Exchange Program" },
] as const;

export const FIELDS_OF_STUDY = [
  "Computer Science",
  "Engineering",
  "Business Administration",
  "Medicine",
  "Law",
  "Arts & Humanities",
  "Natural Sciences",
  "Social Sciences",
  "Education",
  "Architecture",
  "Agriculture",
  "Music",
  "Design",
  "Other",
] as const;
