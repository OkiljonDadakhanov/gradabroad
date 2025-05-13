export interface SponsoredContent {
  id: string
  name: {
    english: string
    korean: string
    russian: string
    uzbek: string
  }
  description: {
    english: string
    korean: string
    russian: string
    uzbek: string
  }
  imageUrl: string
  videoUrl: string
  startDate: string
  endDate: string
  isActive: boolean
  targetUrl: string
}

export type SponsoredContentFormData = Omit<SponsoredContent, "id">

export const defaultSponsoredContent: SponsoredContentFormData = {
  name: {
    english: "",
    korean: "",
    russian: "",
    uzbek: "",
  },
  description: {
    english: "",
    korean: "",
    russian: "",
    uzbek: "",
  },
  imageUrl: "",
  videoUrl: "",
  startDate: new Date().toISOString().split("T")[0],
  endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split("T")[0],
  isActive: true,
  targetUrl: "",
}
