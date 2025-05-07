export interface AcademicProgram {
  id: string
  name: string
  category: string
  degreeType: string
  languageRequirement: string
  contractPrice: string
  admissionStart: string
  admissionEnd: string
  documentTypes: string[]
  description: {
    english: string
    korean: string
    russian: string
    uzbek: string
  }
}

export type AcademicProgramFormData = Omit<AcademicProgram, "id">

export const CATEGORIES = [
  "Languages",
  "Computer Science",
  "Engineering",
  "Business",
  "Medicine",
  "Arts",
  "Social Sciences",
  "Natural Sciences",
  "Mathematics",
]

export const DEGREE_TYPES = ["Bachelor", "Master", "PhD", "Certificate", "Diploma"]

export const DOCUMENT_TYPES = [
  "Passport",
  "Diploma",
  "Transcript",
  "CV",
  "Motivation Letter",
  "Recommendation Letter",
  "Language Certificate",
  "Medical Certificate",
]

