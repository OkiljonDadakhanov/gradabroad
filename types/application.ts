export type ApplicationStatus =
  | "draft"
  | "document_saved"
  | "submitted"
  | "under_review"
  | "interview"
  | "accepted"
  | "rejected"
  | "confirmed"
  | "visa_taken"
  | "studying";

export interface ApplicationDocument {
  id: number;
  document_type: string;
  document_type_name: string;
  file_url: string;
  status: "pending" | "approved" | "rejected";
  uploaded_at: string;
  notes?: string;
}

export interface ApplicationProgramme {
  id: number;
  name: string;
  field_of_study: string;
  degree_type: string;
  university_name: string;
  university_logo?: string;
}

export interface Application {
  id: number;
  programme: ApplicationProgramme;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
  submitted_at?: string;
  documents: ApplicationDocument[];
  student_name?: string;
  student_email?: string;
  student_phone?: string;
  student_country?: string;
  notes?: string;
}

export interface StudentInfo {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  country: string;
  address: string;
  city: string;
  postal_code: string;
}

export interface EducationInfo {
  highest_degree: string;
  institution_name: string;
  field_of_study: string;
  graduation_year: string;
  gpa?: string;
  gpa_scale?: string;
}

export interface CreateApplicationData {
  programme_id: number;
  personal_info?: StudentInfo;
  education?: EducationInfo;
}

export interface Candidate {
  id: number;
  student: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
    country?: string;
  };
  programme: ApplicationProgramme;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
  submitted_at?: string;
  documents: ApplicationDocument[];
  notes?: string;
}
