import type { AdminConfig, PriceCalculation, Season } from '@/lib/types'
import { calculateSeasonPrice, getSeasonForDate } from './season-price-calculator'
import type { AdminConfig, Season, PriceCalculation } from '@/lib/types'

interface SeasonBreakdown {
  season: Season
  nights: number
  pricePerNight: number
  subtotal: number
}

interface PriceWithSeasonBreakdown extends PriceCalculation {
  seasonBreakdown: SeasonBreakdown[]
}

/**
 * Calculates price for a date range, accounting for season changes
 */
export function calculatePriceForDateRange(
  baseLowSeasonPrice: number,
  checkIn: Date,
  checkOut: Date,
  config: AdminConfig
): PriceWithSeasonBreakdown {
  const seasonBreakdown: SeasonBreakdown[] = []
  let subtotal = 0

  // Calculate total nights first
  const totalNights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))

  if (totalNights <= 0) {
    return {
      basePrice: baseLowSeasonPrice,
      seasonMultiplier: 1,
      pricePerNight: 0,
      nights: 0,
      subtotal: 0,
      commissionTotal: 0,
      commissionPlatform: 0,
      commissionHousing: 0,
      commissionServices: 0,
      totalPrice: 0,
      housingPointsGenerated: 0,
      servicePointsGenerated: 0,
      seasonBreakdown: [],
    }
  }

  // Group nights by season
  const seasonNights: Record<Season, number> = { basse: 0, moyenne: 0, haute: 0 }
  let currentDate = new Date(checkIn)

  while (currentDate < checkOut) {
    const season = getSeasonForDate(currentDate, config)
    seasonNights[season]++
    currentDate.setDate(currentDate.getDate() + 1)
  }

  // Calculate breakdown
  for (const season of ['basse', 'moyenne', 'haute'] as const) {
    const nights = seasonNights[season]
    if (nights > 0) {
      const pricePerNight = calculateSeasonPrice(baseLowSeasonPrice, season, config)
      const periodSubtotal = pricePerNight * nights
      subtotal += periodSubtotal

      seasonBreakdown.push({
        season,
        nights,
        pricePerNight,
        subtotal: periodSubtotal,
      })
    }
  }

  // Commission breakdown
  const commissionTotal = round(subtotal * config.commission.totalPct)
  const commissionPlatform = round(subtotal * config.commission.platformPct)
  const commissionHousing = round(subtotal * config.commission.housingPct)
  const commissionServices = round(subtotal * config.commission.servicesPct)

  // Total price for traveler
  const totalPrice = subtotal + commissionTotal

  // Points generated
  const housingPointsGenerated = round(commissionHousing / config.eurPerHousingPoint)
  const servicePointsGenerated = round(commissionServices / config.eurPerServicePoint)

  const avgPrice = subtotal / totalNights

  return {
    basePrice: baseLowSeasonPrice,
    seasonMultiplier: 1, // Not used for multi-season
    pricePerNight: avgPrice,
    nights: totalNights,
    subtotal,
    commissionTotal,
    commissionPlatform,
    commissionHousing,
    commissionServices,
    totalPrice,
    housingPointsGenerated,
    servicePointsGenerated,
    seasonBreakdown,
  }
}

/**
 * Calculates full price breakdown including commission split
 */
export function calculatePrice(
  baseLowSeasonPrice: number,
  nights: number,
  season: Season,
  config: AdminConfig
): PriceCalculation {
  const pricePerNight = calculateSeasonPrice(baseLowSeasonPrice, season, config)
  const subtotal = pricePerNight * nights

  // Commission breakdown
  const commissionTotal = round(subtotal * config.commission.totalPct)
  const commissionPlatform = round(subtotal * config.commission.platformPct)
  const commissionHousing = round(subtotal * config.commission.housingPct)
  const commissionServices = round(subtotal * config.commission.servicesPct)

  // Total price for traveler
  const totalPrice = subtotal + commissionTotal

  // Points generated
  const housingPointsGenerated = round(commissionHousing / config.eurPerHousingPoint)
  const servicePointsGenerated = round(commissionServices / config.eurPerServicePoint)

  return {
    basePrice: baseLowSeasonPrice,
    seasonMultiplier: config.seasons[season].multiplier,
    pricePerNight,
    nights,
    subtotal,
    commissionTotal,
    commissionPlatform,
    commissionHousing,
    commissionServices,
    totalPrice,
    housingPointsGenerated,
    servicePointsGenerated,
  }
}

/**
 * Validates that commission parts sum to total
 */
export function validateCommissionSplit(config: AdminConfig): boolean {
  const sum =
    config.commission.platformPct +
    config.commission.housingPct +
    config.commission.servicesPct

  // Allow for floating point imprecision
  return Math.abs(sum - config.commission.totalPct) < 0.0001
}

/**
 * Formats percentage for display (e.g., 0.08 -> "8%")
 */
export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(0)}%`
}

/**
 * Formats currency for display
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(value)
}

/**
 * Utility to round to 2 decimal places
 */
function round(value: number): number {
  return Math.round(value * 100) / 100
}

/**
 * Gets commission breakdown as percentages for display
 */
export function getCommissionBreakdown(config: AdminConfig): {
  total: string
  platform: string
  housing: string
  services: string
} {
  return {
    total: formatPercentage(config.commission.totalPct),
    platform: formatPercentage(config.commission.platformPct),
    housing: formatPercentage(config.commission.housingPct),
    services: formatPercentage(config.commission.servicesPct),
  }
}

/**
 * Calculates commission from gross revenue
 */
export function calculateCommission(
  grossRevenue: number,
  config: AdminConfig
): {
  total: number
  platform: number
  housing: number
  services: number
} {
  return {
    total: round(grossRevenue * config.commission.totalPct),
    platform: round(grossRevenue * config.commission.platformPct),
    housing: round(grossRevenue * config.commission.housingPct),
    services: round(grossRevenue * config.commission.servicesPct),
  }
}
