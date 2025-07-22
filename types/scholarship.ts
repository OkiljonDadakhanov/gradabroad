export interface Scholarship {
  id: string;
  degreeType: string;
  academicProgram: string;
  description: {
    english: string;
    korean: string;
    russian: string;
    uzbek: string;
  };
}

export type ScholarshipFormData = Omit<Scholarship, "id">;

export const DEGREE_TYPES = [
  "Vocational or Professional",
  "Bachelor",
  "Master",
  "PhD",
  "Certificate",
  "Diploma",
];

export const ACADEMIC_PROGRAMS = [
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
];
