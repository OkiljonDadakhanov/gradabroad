export interface Payment {
  id: string
  serviceType: ServiceType
  pricePaid: number
  priceToBePaid: number
  startDate: string
  expireDate: string
  status: PaymentStatus
  description: string
  paymentHistory: PaymentHistoryItem[]
}

export interface PaymentHistoryItem {
  date: string
  amount: number
  fileUrl: string
  fileName: string
}

export enum ServiceType {
  GOLD = "Gold",
  SILVER = "Silver",
  BRONZE = "Bronze",
  PREMIUM = "Premium",
  STANDARD = "Standard",
}

export enum PaymentStatus {
  PENDING = "Pending",
  ACCEPTED = "Accepted",
  REJECTED = "Rejected",
  EXPIRED = "Expired",
  PROCESSING = "Processing",
}

export interface PaymentFormData {
  serviceType: ServiceType
  priceToBePaid: number
  price: number
  paymentDate: string
  file: File | null
  fileName: string
  acceptTerms: boolean
}

export const defaultPaymentFormData: PaymentFormData = {
  serviceType: ServiceType.GOLD,
  priceToBePaid: 1000,
  price: 1000,
  paymentDate: new Date().toISOString().split("T")[0],
  file: null,
  fileName: "",
  acceptTerms: false,
}
