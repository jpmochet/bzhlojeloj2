'use client'

import { useConfig } from '@/lib/context/config-context'
import { getAllSeasonPrices, getSeasonLabel } from '@/lib/engines/season-price-calculator'
import { formatCurrency } from '@/lib/engines/commission-calculator'
import type { Season } from '@/lib/types'

interface SeasonPriceTableProps {
  baseLowSeasonPrice: number
  highlightSeason?: Season
  compact?: boolean
}

export function SeasonPriceTable({
  baseLowSeasonPrice,
  highlightSeason,
  compact = false,
}: SeasonPriceTableProps) {
  const { config } = useConfig()
  const prices = getAllSeasonPrices(baseLowSeasonPrice, config)

  const seasons: Season[] = ['basse', 'moyenne', 'haute']
  const seasonColors: Record<Season, string> = {
    basse: 'bg-bretagne-light border-bretagne',
    moyenne: 'bg-ocean-light border-ocean',
    haute: 'bg-coral-light border-coral',
  }

  if (compact) {
    return (
      <div className="flex items-center gap-3 text-sm">
        {seasons.map((season) => (
          <div
            key={season}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${
              highlightSeason === season
                ? `${seasonColors[season]} border-2`
                : 'bg-muted'
            }`}
          >
            <span className="text-muted-foreground capitalize">{season.slice(0, 3)}:</span>
            <span className="font-medium">{formatCurrency(prices[season])}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="rounded-lg border overflow-hidden">
      <div className="grid grid-cols-3 divide-x">
        {seasons.map((season) => (
          <div
            key={season}
            className={`p-4 text-center ${
              highlightSeason === season ? seasonColors[season] : ''
            }`}
          >
            <div className="text-sm text-muted-foreground mb-1">
              {getSeasonLabel(season)}
            </div>
            <div className="text-lg font-semibold">
              {formatCurrency(prices[season])}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              / nuit
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              x{config.seasons[season].multiplier}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
