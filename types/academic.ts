export interface AcademicProgram {
  id: string;
  name: string;
  category: string;
  degree_type: string;
  languageRequirement: LanguageRequirement[];
  contractPrice: string;
  tuitionPeriod?: string;
  platformApplicationFee?: string;
  paymentInstructions?: string;
  admissionStart: string;
  results_announcement_date?: string | null;
  application_guide_url?: string | null;
  application_form_url?: string | null;
  admissionEnd: string;
  documentTypes: DocumentRequirement[];
  active?: boolean;
  description: {
    english: string;
    korean: string;
    russian: string;
    uzbek: string;
  };
}

export interface LanguageRequirement {
  name: string; // e.g., "IELTS"
  requirement: string; // e.g., "Minimum Score: 6.5"
}

export interface DocumentRequirement {
  name: string;
  description: string;
  sampleFile?: File | null;
  sampleFileUrl?: string;
}

export interface AcademicProgramFormData extends Omit<AcademicProgram, "id" | "admissionStart" | "admissionEnd" | "results_announcement_date"> {
  start_date: Date;
  end_date: Date;
  results_announcement_date: Date;
  admissionStart: Date;
  admissionEnd: Date;
}

export interface AcademicProgramEditFormData extends Omit<AcademicProgram, "admissionStart" | "admissionEnd" | "results_announcement_date"> {
  admissionStart: Date;
  admissionEnd: Date;
  results_announcement_date: Date;
}

export const CATEGORIES = [
  "Administration Studies",
  "Architecture Studies",
  "Art Studies",
  "Aviation",
  "Business Studies",
  "Construction",
  "Cosmetology Studies",
  "Design Studies",
  "Economic Studies",
  "Education",
  "Energy Studies",
  "Engineering Studies",
  "Environmental Studies",
  "Fashion",
  "Food and Beverage Studies",
  "General Studies",
  "Health Care",
  "Humanities Studies",
  "Journalism and Mass Communication",
  "Languages",
  "Law Studies",
  "Life Sciences",
  "Life Skills",
  "Management Studies",
  "Marketing Studies",
  "Natural Sciences",
  "Performing Arts",
  "Professional Studies",
  "Self-Improvement",
  "Social Sciences",
  "Sport and Exercise Studies",
  "Sustainability Studies",
  "Technology Studies",
  "Tourism and Hospitality",
  "Computer Science",
  "Medicine",
  "Mathematics",
];

export const DEGREE_TYPES = [
  "Vocational or Professional",
  "Bachelor",
  "Master",
  "PhD",
  "Certificate",
  "Diploma",
];

export const TUITION_PERIODS = [
  "Per Semester",
  "Per Year",
];

export const DOCUMENT_TYPES = [
  "Passport",
  "Diploma",
  "Transcript",
  "CV",
  "Motivation Letter",
  "Recommendation Letter",
  "Language Certificate",
  "Medical Certificate",
];
