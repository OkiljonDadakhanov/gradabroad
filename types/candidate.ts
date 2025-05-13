export interface Candidate {
  id: string
  fullName: string
  faculty: string
  appliedDate: string
  status: CandidateStatus
  email: string
  phone: string
  country: string
  program: string
  documents: {
    passport: boolean
    diploma: boolean
    transcript: boolean
    motivationLetter: boolean
  }
  notes: string
}

export enum CandidateStatus {
  DOCUMENT_SUBMITTED = "Document submitted",
  REJECTED = "Rejected",
  ACCEPTED = "Accepted",
  SENT_FOR_RESENDING = "Sent for resending",
  DOCUMENT_SAVED = "Document saved",
  VISA_TAKEN = "Visa taken",
  STUDYING = "Studying",
}

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
]

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
]

export const PROGRAMS = [
  "Bachelor of Engineering",
  "Bachelor of Computer Science",
  "Bachelor of Business Administration",
  "Master of Science in Data Science",
  "Master of Business Administration",
  "PhD in Computer Science",
  "PhD in Engineering",
  "English Literature",
  "Software Engineering",
  "Medicine",
]
