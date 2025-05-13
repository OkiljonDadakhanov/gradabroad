export interface DocumentType {
  id: string
  name: {
    english: string
    korean: string
    russian: string
    uzbek: string
  }
  additionalInfo: string
}

export type DocumentTypeFormData = Omit<DocumentType, "id">

export const defaultDocumentTypeFormData: DocumentTypeFormData = {
  name: {
    english: "",
    korean: "",
    russian: "",
    uzbek: "",
  },
  additionalInfo: "",
}
