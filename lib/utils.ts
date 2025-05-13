import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return `id-${Math.random().toString(36).substring(2, 9)}`
}

export function formatDate(dateString: string): string {
  if (!dateString) return "-"

  const date = new Date(dateString)
  return date
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, ".")
}

export function formatCurrency(amount: number): string {
  return `$ ${amount.toLocaleString()}`
}
