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

// Student profile information
export interface CandidateStudentProfile {
  first_name: string;
  last_name: string;
  phone_number: string;
  additional_phone: string;
  email_contact: string;
  nationality: string;
  date_of_birth: string | null;
  gender: string;
  passport_number: string;
  passport_expiry_date: string | null;
  address_line1: string;
  address_line2: string;
  city: string;
  state_province: string;
  postal_code: string;
  country: string;
  emergency_full_name: string;
  emergency_relationship: string;
  emergency_phone: string;
}

// Family member information
export interface CandidateFamilyMember {
  id: number;
  full_name: string;
  relation: string;
  date_of_birth: string;
  phone_number: string;
  occupation: string;
  signed_file_url: string | null;
}

// Personal document (passport, birth certificate, etc.)
export interface CandidatePersonalDocument {
  id: number;
  doc_type: string;
  signed_file_url: string;
  uploaded_at: string;
}

// Financial document
export interface CandidateFinancialDocument {
  id: number;
  doc_type: string;
  signed_file_url: string;
  uploaded_at: string;
}

// Language certificate
export interface CandidateLanguageCertificate {
  id: number;
  name: string;
  score_or_level: string;
  issue_date: string;
  expires_at: string | null;
  signed_file_url: string;
  uploaded_at: string;
}

// Candidate detail (from /api/applications/candidates/{id}/)
export interface CandidateDetail extends CandidateListItem {
  applicant_email: string;
  student_profile: CandidateStudentProfile | null;
  family_members: CandidateFamilyMember[];
  personal_documents: CandidatePersonalDocument[];
  financial_documents: CandidateFinancialDocument[];
  language_certificates: CandidateLanguageCertificate[];
  attachments: CandidateAttachment[];
  application_documents: any[];
  acceptance_letter_url: string | null;
  acceptance_letter_uploaded_at: string | null;
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

// File type labels for ApplicationAttachment
export const FILE_TYPE_LABELS: Record<string, string> = {
  // ApplicationAttachment types (from backend)
  transcript: "Transcript",
  recommendation_letter: "Recommendation Letter",
  motivation_letter: "Motivation Letter",
  cv: "CV / Resume",
  payment_receipt: "Payment Receipt",
};

// General application document type labels (from GeneralApplicationDocument model)
export const GENERAL_DOC_TYPE_LABELS: Record<string, string> = {
  sop: "Statement of Purpose",
  study_plan: "Study Plan",
  motivation: "Motivation",
  motivation_letter: "Motivation Letter",
  recommendation_letter_1: "Recommendation Letter #1",
  recommendation_letter_2: "Recommendation Letter #2",
  portfolio: "Portfolio",
  research_proposal: "Research Proposal",
};

// Personal document type labels (from PersonalDocument model)
export const PERSONAL_DOC_TYPE_LABELS: Record<string, string> = {
  passport_copy: "Passport Copy",
  passport_photo: "Passport Photo",
  medical_exam_report: "Medical Exam Report",
  national_id_or_birth_certificate: "National ID / Birth Certificate",
  apostille_birth_certificate: "Apostille Birth Certificate",
};

// Financial document type labels (profile-level documents from FinancialDocument model)
export const FINANCIAL_DOC_TYPE_LABELS: Record<string, string> = {
  bank_balance: "Bank Balance",
  financial_support_letter: "Financial Support Letter",
  family_relationship_certificate: "Family Relationship Certificate",
  sponsor_tax_documents: "Sponsor Tax Documents",
};

// Language certificate name labels
export const LANGUAGE_CERT_LABELS: Record<string, string> = {
  TOPIK: "TOPIK",
  IELTS: "IELTS",
  TOEFL: "TOEFL",
  JLPT: "JLPT",
  OTHER: "Other",
};

// Document categories for grouping ApplicationAttachments
export const DOCUMENT_CATEGORIES: Record<string, { label: string; types: string[] }> = {
  academic: {
    label: "Academic Documents",
    types: ["transcript"],
  },
  application: {
    label: "Application Documents",
    types: ["motivation_letter", "recommendation_letter", "cv"],
  },
  payment: {
    label: "Payment Documents",
    types: ["payment_receipt"],
  },
};
