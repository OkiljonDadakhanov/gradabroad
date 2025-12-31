import { ApplicationStatus } from "./application";

export interface CandidateStudent {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  country?: string;
  date_of_birth?: string;
}

export interface CandidateProgramme {
  id: number;
  name: string;
  field_of_study: string;
  degree_type: string;
}

export interface CandidateDocument {
  id: number;
  document_type: string;
  document_type_name: string;
  file_url: string;
  status: "pending" | "approved" | "rejected";
  uploaded_at: string;
  notes?: string;
}

export interface Candidate {
  id: number;
  student: CandidateStudent;
  programme: CandidateProgramme;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
  submitted_at?: string;
  documents: CandidateDocument[];
  notes?: string;
}

// For backward compatibility with old components
export enum CandidateStatus {
  DRAFT = "draft",
  DOCUMENT_SAVED = "document_saved",
  SUBMITTED = "submitted",
  UNDER_REVIEW = "under_review",
  INTERVIEW = "interview",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  CONFIRMED = "confirmed",
  VISA_TAKEN = "visa_taken",
  STUDYING = "studying",
}

export const STATUS_OPTIONS: { value: ApplicationStatus; label: string }[] = [
  { value: "submitted", label: "Submitted" },
  { value: "under_review", label: "Under Review" },
  { value: "interview", label: "Interview" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
  { value: "confirmed", label: "Confirmed" },
  { value: "visa_taken", label: "Visa Obtained" },
  { value: "studying", label: "Studying" },
];

export const FACULTIES = [
  "Engineering",
  "Computer Science",
  "Business",
  "Medicine",
  "Arts",
  "Social Sciences",
  "Natural Sciences",
  "Mathematics",
  "Law",
  "Education",
];

export const COUNTRIES = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Argentina",
  "Australia",
  "Bangladesh",
  "Brazil",
  "Canada",
  "China",
  "Egypt",
  "France",
  "Germany",
  "India",
  "Indonesia",
  "Iran",
  "Italy",
  "Japan",
  "Kazakhstan",
  "Kenya",
  "Malaysia",
  "Mexico",
  "Nigeria",
  "Pakistan",
  "Russia",
  "Saudi Arabia",
  "South Korea",
  "Spain",
  "Turkey",
  "United Kingdom",
  "United States",
  "Uzbekistan",
  "Vietnam",
];
