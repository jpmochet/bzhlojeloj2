'use client'

import { Coins, TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { formatPoints } from '@/lib/engines/services-engine'

interface PointsWalletProps {
  balance: number
  earned?: number
  spent?: number
  title?: string
  variant?: 'default' | 'compact'
}

export function PointsWallet({
  balance,
  earned,
  spent,
  title = 'Portefeuille Services',
  variant = 'default',
}: PointsWalletProps) {
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3 px-4 py-2 bg-bretagne-light rounded-lg">
        <Coins className="w-5 h-5 text-bretagne" />
        <div>
          <div className="text-xs text-muted-foreground">{title}</div>
          <div className="font-semibold text-bretagne">{formatPoints(balance)}</div>
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Coins className="w-5 h-5 text-bretagne" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-bretagne mb-4">
          {formatPoints(balance)}
        </div>

        {(earned !== undefined || spent !== undefined) && (
          <div className="space-y-3">
            {earned !== undefined && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <TrendingUp className="w-4 h-4 text-bretagne" />
                  Points gagnes
                </div>
                <span className="font-medium text-bretagne">+{formatPoints(earned)}</span>
              </div>
            )}
            {spent !== undefined && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <TrendingDown className="w-4 h-4 text-coral" />
                  Points depenses
                </div>
                <span className="font-medium text-coral">-{formatPoints(spent)}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface HousingPoolProgressProps {
  current: number
  target: number
  label?: string
}

export function HousingPoolProgress({
  current,
  target,
  label = 'Progression vers le prochain logement',
}: HousingPoolProgressProps) {
  const progress = target > 0 ? Math.min(100, (current / target) * 100) : 0
  const remaining = Math.max(0, target - current)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">
          {formatPoints(current)} / {formatPoints(target)}
        </span>
      </div>
      <Progress value={progress} className="h-2" />
      <div className="text-xs text-muted-foreground">
        Encore {formatPoints(remaining)} points necessaires
      </div>
    </div>
  )
}
