'use client'

import { useConfig } from '@/lib/context/config-context'
import { formatPercentage, formatCurrency } from '@/lib/engines/commission-calculator'

interface CommissionBreakdownProps {
  amount?: number
  showLabels?: boolean
  compact?: boolean
}

export function CommissionBreakdown({
  amount,
  showLabels = true,
  compact = false,
}: CommissionBreakdownProps) {
  const { config } = useConfig()
  const { commission } = config

  const platformAmount = amount ? amount * commission.platformPct : null
  const housingAmount = amount ? amount * commission.housingPct : null
  const servicesAmount = amount ? amount * commission.servicesPct : null

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="font-medium">{formatPercentage(commission.totalPct)}</span>
        <span className="text-muted-foreground">=</span>
        <span className="text-ocean">{formatPercentage(commission.platformPct)}</span>
        <span className="text-muted-foreground">+</span>
        <span className="text-bretagne">{formatPercentage(commission.housingPct)}</span>
        <span className="text-muted-foreground">+</span>
        <span className="text-coral">{formatPercentage(commission.servicesPct)}</span>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Commission totale</span>
        <span className="font-semibold">
          {formatPercentage(commission.totalPct)}
          {amount && <span className="ml-2 text-muted-foreground">({formatCurrency(amount * commission.totalPct)})</span>}
        </span>
      </div>

      <div className="h-3 rounded-full overflow-hidden flex bg-muted">
        <div
          className="bg-ocean h-full"
          style={{ width: `${(commission.platformPct / commission.totalPct) * 100}%` }}
        />
        <div
          className="bg-bretagne h-full"
          style={{ width: `${(commission.housingPct / commission.totalPct) * 100}%` }}
        />
        <div
          className="bg-coral h-full"
          style={{ width: `${(commission.servicesPct / commission.totalPct) * 100}%` }}
        />
      </div>

      {showLabels && (
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-ocean" />
              <span className="text-muted-foreground">Plateforme</span>
            </div>
            <span className="font-medium text-ocean">
              {formatPercentage(commission.platformPct)}
              {platformAmount && (
                <span className="block text-xs text-muted-foreground">
                  {formatCurrency(platformAmount)}
                </span>
              )}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-bretagne" />
              <span className="text-muted-foreground">Logement</span>
            </div>
            <span className="font-medium text-bretagne">
              {formatPercentage(commission.housingPct)}
              {housingAmount && (
                <span className="block text-xs text-muted-foreground">
                  {formatCurrency(housingAmount)}
                </span>
              )}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-coral" />
              <span className="text-muted-foreground">Services</span>
            </div>
            <span className="font-medium text-coral">
              {formatPercentage(commission.servicesPct)}
              {servicesAmount && (
                <span className="block text-xs text-muted-foreground">
                  {formatCurrency(servicesAmount)}
                </span>
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
