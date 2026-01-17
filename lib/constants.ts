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

  // Chat
  CHAT_MESSAGES: (applicationId: number) =>
    `/api/chat/applications/${applicationId}/messages/`,

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

// Application Status Flow
export const APPLICATION_STATUS_FLOW = [
  "draft",
  "document_saved",
  "submitted",
  "under_review",
  "interview",
  "accepted",
  "rejected",
  "confirmed",
  "visa_taken",
  "studying",
] as const;

// Status Display Names
export const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  document_saved: "Documents Saved",
  submitted: "Submitted",
  under_review: "Under Review",
  interview: "Interview",
  accepted: "Accepted",
  rejected: "Rejected",
  confirmed: "Confirmed",
  visa_taken: "Visa Obtained",
  studying: "Studying",
};

// Status Colors (Tailwind classes)
export const STATUS_COLORS: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700 border-gray-300",
  document_saved: "bg-amber-50 text-amber-700 border-amber-300",
  submitted: "bg-blue-50 text-blue-700 border-blue-300",
  under_review: "bg-yellow-50 text-yellow-700 border-yellow-300",
  interview: "bg-purple-50 text-purple-700 border-purple-300",
  accepted: "bg-green-50 text-green-700 border-green-300",
  rejected: "bg-red-50 text-red-700 border-red-300",
  confirmed: "bg-emerald-50 text-emerald-700 border-emerald-300",
  visa_taken: "bg-indigo-50 text-indigo-700 border-indigo-300",
  studying: "bg-teal-50 text-teal-700 border-teal-300",
};

// Status Badge Variants
export const STATUS_BADGE_VARIANTS: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  draft: "secondary",
  document_saved: "outline",
  submitted: "default",
  under_review: "default",
  interview: "default",
  accepted: "default",
  rejected: "destructive",
  confirmed: "default",
  visa_taken: "default",
  studying: "default",
};

// Valid status transitions for university
export const VALID_STATUS_TRANSITIONS: Record<string, string[]> = {
  submitted: ["under_review", "rejected"],
  under_review: ["interview", "accepted", "rejected"],
  interview: ["accepted", "rejected"],
  accepted: ["confirmed", "rejected"],
  confirmed: ["visa_taken"],
  visa_taken: ["studying"],
};

// Document Status
export const DOCUMENT_STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700",
  approved: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
};
