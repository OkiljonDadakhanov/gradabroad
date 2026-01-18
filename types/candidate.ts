import { ApplicationStatus } from "./application";

// Candidate list item (from /api/applications/candidates/)
export interface CandidateListItem {
  id: number;
  applicant_full_name: string;
  programme_name: string;
  applied_date: string | null;
  status: ApplicationStatus;
  remarks: string;
}

// Attachment in candidate detail
export interface CandidateAttachment {
  id: number;
  application_id: number;
  file_type: string;
  file: string;
  uploaded_at: string;
  signed_file_url: string;
}

// Candidate detail (from /api/applications/candidates/{id}/)
export interface CandidateDetail extends CandidateListItem {
  applicant_email: string;
  attachments: CandidateAttachment[];
  application_documents: any[];
}

// For backward compatibility
export type Candidate = CandidateListItem;

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

// File type labels
export const FILE_TYPE_LABELS: Record<string, string> = {
  // Personal Documents
  cv: "CV / Resume",
  passport: "Passport",
  photo: "Photo",

  // Academic Documents
  diploma: "Diploma",
  transcript: "Transcript",
  degree_certificate: "Degree Certificate",

  // Application Documents
  motivation_letter: "Motivation Letter",
  sop: "Statement of Purpose",
  study_plan: "Study Plan",
  recommendation: "Recommendation Letter",
  recommendation_letter_1: "Recommendation Letter #1",
  recommendation_letter_2: "Recommendation Letter #2",
  portfolio: "Portfolio",
  research_proposal: "Research Proposal",

  // Certificates
  language_certificate: "Language Certificate",
  ielts: "IELTS Certificate",
  toefl: "TOEFL Certificate",
  topik: "TOPIK Certificate",

  // Financial Documents
  bank_statement: "Bank Statement",
  financial_guarantee: "Financial Guarantee",
  scholarship_letter: "Scholarship Letter",

  // Other
  other: "Other Document",
};

// Document categories for grouping
export const DOCUMENT_CATEGORIES: Record<string, { label: string; types: string[] }> = {
  personal: {
    label: "Personal Documents",
    types: ["cv", "passport", "photo"],
  },
  academic: {
    label: "Academic Documents",
    types: ["diploma", "transcript", "degree_certificate"],
  },
  application: {
    label: "Application Documents",
    types: ["motivation_letter", "sop", "study_plan", "recommendation", "recommendation_letter_1", "recommendation_letter_2", "portfolio", "research_proposal"],
  },
  certificates: {
    label: "Certificates",
    types: ["language_certificate", "ielts", "toefl", "topik"],
  },
  financial: {
    label: "Financial Documents",
    types: ["bank_statement", "financial_guarantee", "scholarship_letter"],
  },
  other: {
    label: "Other Documents",
    types: ["other"],
  },
};
