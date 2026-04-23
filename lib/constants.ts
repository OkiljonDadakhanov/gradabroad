export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "https://api.gradabroad.net";

// API Endpoints
export const ENDPOINTS = {
  // Authentication
  LOGIN: "/api/auth/login/",
  REFRESH_TOKEN: "/api/auth/token/refresh/",
  REGISTER_STUDENT: "/api/auth/register/student/",
  REGISTER_UNIVERSITY: "/api/auth/register/university/",

  // Programs (Public)
  PROGRAMS: "/api/programmes/",
  PROGRAM_DETAIL: (id: number) => `/api/programmes/${id}/`,
  STUDENT_READINESS: (id: number) => `/api/programmes/${id}/student-readiness/`,

  // University Programs
  MY_PROGRAMS: "/api/programmes/mine/",
  PROGRAMS_WITH_REQUIREMENTS: "/api/programmes/with-requirements/",
  PROGRAM_WITH_REQUIREMENTS: (id: number) =>
    `/api/programmes/with-requirements/${id}/`,

  // Student Applications
  CREATE_APPLICATION: "/api/applications/",
  MY_APPLICATIONS: "/api/my/applications/",
  APPLICATION: (id: number) => `/api/applications/${id}/`,

  // University Candidates
  CANDIDATES: "/api/applications/candidates/",
  CANDIDATE: (id: number) => `/api/applications/candidates/${id}/`,
  CANDIDATE_STATUSES: "/api/applications/candidates/statuses/",

  // Documents
  APPLICATION_DOCS: "/api/application-docs/",
  ATTACHMENT_DOWNLOAD: (applicationId: number, attachmentId: number) =>
    `/api/applications/${applicationId}/attachments/${attachmentId}/download/`,
  PERSONAL_DOCUMENT_DOWNLOAD: (applicationId: number, documentId: number) =>
    `/api/applications/candidates/${applicationId}/personal-documents/${documentId}/download/`,
  FAMILY_PASSPORT_DOWNLOAD: (applicationId: number, memberId: number) =>
    `/api/applications/candidates/${applicationId}/family-members/${memberId}/passport/download/`,
  FINANCIAL_DOCUMENT_DOWNLOAD: (applicationId: number, documentId: number) =>
    `/api/applications/candidates/${applicationId}/financial-documents/${documentId}/download/`,
  LANGUAGE_CERTIFICATE_DOWNLOAD: (applicationId: number, certificateId: number) =>
    `/api/applications/candidates/${applicationId}/language-certificates/${certificateId}/download/`,
  ACCEPTANCE_LETTER_UPLOAD: (applicationId: number) =>
    `/api/applications/candidates/${applicationId}/acceptance-letter/`,
  ACCEPTANCE_LETTER_DOWNLOAD: (applicationId: number) =>
    `/api/applications/${applicationId}/acceptance-letter/download/`,

  // Chat
  CHAT_MESSAGES: (applicationId: number) =>
    `/api/chat/applications/${applicationId}/messages/`,
  CHAT_INITIATE: (applicationId: number) =>
    `/api/chat/applications/${applicationId}/initiate/`,
  CHAT_STATUS: (applicationId: number) =>
    `/api/chat/applications/${applicationId}/status/`,
  CHAT_MARK_READ: (applicationId: number) =>
    `/api/chat/applications/${applicationId}/mark-read/`,

  // University Profile
  UNIVERSITY_PROFILE: "/api/auth/universities/me/",
  ACCREDITATION_URL: "/api/auth/universities/me/accreditation-url/",

  // Campus Info
  CAMPUS_INFO: "/api/information-about-campus/",

  // Scholarships
  MY_SCHOLARSHIPS: "/api/scholarships/mine/",
  SCHOLARSHIPS: "/api/scholarships/",
  SCHOLARSHIP: (id: number) => `/api/scholarships/${id}/`,

  // Gallery
  GALLERY_CATEGORIES: "/api/media/gallery/categories/",
  GALLERY_IMAGES: "/api/media/gallery/images/",
  GALLERY_IMAGE: (id: number) => `/api/media/gallery/images/${id}/`,
} as const;

// Application Status Flow — mirrors backend STATUS_CHOICES in
// gradabroad_backend/applications/models.py.
export const APPLICATION_STATUS_FLOW = [
  "document_saved",
  "submitted",
  "under_review",
  "resend",
  "interview",
  "accepted",
  "confirmed",
  "visa_taken",
  "studying",
  "waitlisted",
  "rejected",
] as const;

// Status Display Names
export const STATUS_LABELS: Record<string, string> = {
  document_saved: "Draft",
  submitted: "Submitted",
  under_review: "Under Review",
  resend: "Resubmit Requested",
  interview: "Interview",
  accepted: "Accepted",
  confirmed: "Confirmed",
  visa_taken: "Visa Approved",
  studying: "Studying",
  waitlisted: "Waitlisted",
  rejected: "Rejected",
};

// Status Colors (Tailwind classes)
export const STATUS_COLORS: Record<string, string> = {
  document_saved: "bg-gray-100 text-gray-700 border-gray-300",
  submitted: "bg-blue-50 text-blue-700 border-blue-300",
  under_review: "bg-yellow-50 text-yellow-700 border-yellow-300",
  resend: "bg-amber-50 text-amber-700 border-amber-300",
  interview: "bg-purple-50 text-purple-700 border-purple-300",
  accepted: "bg-green-50 text-green-700 border-green-300",
  confirmed: "bg-emerald-50 text-emerald-700 border-emerald-300",
  visa_taken: "bg-indigo-50 text-indigo-700 border-indigo-300",
  studying: "bg-teal-50 text-teal-700 border-teal-300",
  waitlisted: "bg-orange-50 text-orange-700 border-orange-300",
  rejected: "bg-red-50 text-red-700 border-red-300",
};

// Status Badge Variants
export const STATUS_BADGE_VARIANTS: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  document_saved: "secondary",
  submitted: "default",
  under_review: "default",
  resend: "outline",
  interview: "default",
  accepted: "default",
  confirmed: "default",
  visa_taken: "default",
  studying: "default",
  waitlisted: "outline",
  rejected: "destructive",
};

// Valid status transitions for university.
// Linear funnel with side-exits; studying is terminal.
export const VALID_STATUS_TRANSITIONS: Record<string, string[]> = {
  submitted: ["under_review", "rejected", "resend", "waitlisted"],
  under_review: ["interview", "accepted", "rejected", "resend", "waitlisted"],
  interview: ["accepted", "rejected", "resend", "waitlisted"],
  resend: ["under_review", "rejected"],
  waitlisted: ["under_review", "accepted", "rejected"],
  accepted: ["confirmed", "rejected"],
  confirmed: ["visa_taken", "rejected"],
  visa_taken: ["studying"],
  studying: [],
  rejected: [],
  document_saved: [],
};

// Document Status
export const DOCUMENT_STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700",
  approved: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
};
