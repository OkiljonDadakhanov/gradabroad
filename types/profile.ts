export interface ProfileData {
  name: string;
  type: string;
  classification: string;
  address: string;
  city: string;
  zipCode: string;
  latitude: string;
  longitude: string;
  email: string;
  telephone: string;
  accreditationNumber: string;
  accreditationDocument: string;
  telegramLink: string;
  instagramLink: string;
  youtubeLink: string;
  facebookLink: string;
  avatar: string;
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
  };
}
