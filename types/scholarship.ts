export interface Scholarship {
  id: string
  degreeType: string
  academicProgram: string
  description: {
    english: string
    korean: string
    russian: string
    uzbek: string
  }
}

export type ScholarshipFormData = Omit<Scholarship, "id">

export const DEGREE_TYPES = ["Bachelor", "Master", "PhD", "Certificate", "Diploma"]

export const ACADEMIC_PROGRAMS = [
  "English Literature",
  "Data Science",
  "Software Engineering",
  "Business Administration",
  "Medicine",
  "Economics",
  "Computer Science",
  "Mechanical Engineering",
  "Civil Engineering",
  "Psychology",
]

