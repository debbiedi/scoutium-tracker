import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

/**
 * Tarihi Türkçe formatında döndürür
 * @param dateString ISO date string
 * @returns Formatlanmış tarih (örn: "15 Ocak 2024")
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

/**
 * Tarihi kısa formatta döndürür
 * @param dateString ISO date string
 * @returns Formatlanmış tarih (örn: "15.01.2024")
 */
export function formatDateShort(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}
