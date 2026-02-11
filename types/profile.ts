export interface ProfileData {
  name: string;
  type: string;
  classification: string;
  address: string;
  city: string;
  zipCode: string;
  telephone: string;
  email: string;
  accreditationNumber: string;
  signed_accreditation_document_url: string | File | null;
  logo_url: string | File | null;
  website: string;
  representativeName: string;
  representativeEmail: string;

  telegramLink: string;
  instagramLink: string;
  youtubeLink: string;
  facebookLink: string;
}

export interface CampusInfoData {
  id?: number;
  yearOfEstablishment: string;
  numberOfGraduates: string;
  proportionOfEmployedGraduates: string;
  rankingWithinCountry: string;
  globalRankingPosition: string;

  hasDormitories: boolean;
  dormitoryFeeRangeMin: string;
  dormitoryFeeRangeMax: string;
  aboutUniversity: {
    english: string;
    korean?: string;
    russian?: string;
    uzbek?: string;
  };
}
