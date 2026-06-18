import type { Season, AdminConfig } from '@/lib/types'

/**
 * Determines the season based on a date and config
 */
export function getSeasonForDate(date: Date, config: AdminConfig): Season {
  const month = date.getMonth() + 1 // 1-12

  const { seasons } = config

  // Check haute first (typically July-October)
  if (
    (seasons.haute.startMonth <= seasons.haute.endMonth &&
      month >= seasons.haute.startMonth &&
      month <= seasons.haute.endMonth) ||
    (seasons.haute.startMonth > seasons.haute.endMonth &&
      (month >= seasons.haute.startMonth || month <= seasons.haute.endMonth))
  ) {
    return 'haute'
  }

  // Check moyenne (typically April-June)
  if (
    (seasons.moyenne.startMonth <= seasons.moyenne.endMonth &&
      month >= seasons.moyenne.startMonth &&
      month <= seasons.moyenne.endMonth) ||
    (seasons.moyenne.startMonth > seasons.moyenne.endMonth &&
      (month >= seasons.moyenne.startMonth || month <= seasons.moyenne.endMonth))
  ) {
    return 'moyenne'
  }

  // Default to basse
  return 'basse'
}

/**
 * Gets the season multiplier
 */
export function getSeasonMultiplier(season: Season, config: AdminConfig): number {
  return config.seasons[season].multiplier
}

/**
 * Calculates the price per night for a given base price and season
 */
export function calculateSeasonPrice(
  baseLowSeasonPrice: number,
  season: Season,
  config: AdminConfig
): number {
  const multiplier = getSeasonMultiplier(season, config)
  return Math.round(baseLowSeasonPrice * multiplier * 100) / 100
}

/**
 * Gets all three season prices for display
 */
export function getAllSeasonPrices(
  baseLowSeasonPrice: number,
  config: AdminConfig
): { basse: number; moyenne: number; haute: number } {
  return {
    basse: calculateSeasonPrice(baseLowSeasonPrice, 'basse', config),
    moyenne: calculateSeasonPrice(baseLowSeasonPrice, 'moyenne', config),
    haute: calculateSeasonPrice(baseLowSeasonPrice, 'haute', config),
  }
}

/**
 * Gets season label in French
 */
export function getSeasonLabel(season: Season): string {
  const labels: Record<Season, string> = {
    basse: 'Basse saison',
    moyenne: 'Moyenne saison',
    haute: 'Haute saison',
  }
  return labels[season]
}

/**
 * Gets season color for UI
 */
export function getSeasonColor(season: Season): string {
  const colors: Record<Season, string> = {
    basse: 'text-bretagne',
    moyenne: 'text-ocean',
    haute: 'text-coral',
  }
  return colors[season]
}
