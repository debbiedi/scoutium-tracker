// Scoutium Video Tagging Ücret Tablosu
// 0-25 dakika = 120 TL
// 25-45 dakika = 240 TL
// 45-70 dakika = 360 TL
// 70-90 dakika = 480 TL

export interface PriceTier {
  minMinutes: number
  maxMinutes: number
  price: number
  label: string
}

export const PRICE_TIERS: PriceTier[] = [
  { minMinutes: 0, maxMinutes: 25, price: 120, label: '0-25 dk' },
  { minMinutes: 25, maxMinutes: 45, price: 240, label: '25-45 dk' },
  { minMinutes: 45, maxMinutes: 70, price: 360, label: '45-70 dk' },
  { minMinutes: 70, maxMinutes: 90, price: 480, label: '70-90 dk' },
]

/**
 * Dakika süresine göre ücreti hesaplar
 * @param durationMinutes Maç süresi (dakika)
 * @returns Ücret (TL)
 */
export function calculatePrice(durationMinutes: number): number {
  // Edge case: 0 veya negatif süre
  if (durationMinutes <= 0) return 0
  
  // Edge case: 90 dakikadan fazla
  if (durationMinutes > 90) return 480
  
  for (const tier of PRICE_TIERS) {
    if (durationMinutes > tier.minMinutes && durationMinutes <= tier.maxMinutes) {
      return tier.price
    }
  }
  
  // 0-25 aralığı için (0 < x <= 25)
  if (durationMinutes > 0 && durationMinutes <= 25) {
    return 120
  }
  
  return 0
}

/**
 * Fiyatı Türk Lirası formatında döndürür
 * @param amount Miktar
 * @returns Formatlanmış string (örn: "₺120,00")
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Dakika süresine göre ücret tier'ını bulur
 * @param durationMinutes Maç süresi (dakika)
 * @returns PriceTier veya undefined
 */
export function getPriceTier(durationMinutes: number): PriceTier | undefined {
  if (durationMinutes <= 0) return undefined
  if (durationMinutes > 90) return PRICE_TIERS[3]
  
  for (const tier of PRICE_TIERS) {
    if (durationMinutes > tier.minMinutes && durationMinutes <= tier.maxMinutes) {
      return tier
    }
  }
  
  if (durationMinutes > 0 && durationMinutes <= 25) {
    return PRICE_TIERS[0]
  }
  
  return undefined
}
