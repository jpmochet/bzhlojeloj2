'use client'

import { useEffect, useRef, useState } from 'react'
import { Home, Wrench, Euro, CalendarDays, TrendingUp } from 'lucide-react'
import { useImpact } from '@/lib/context/impact-context'
import { formatCurrency } from '@/lib/engines/commission-calculator'

function useCountUp(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const startTime = performance.now()

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)
            // Ease out quad
            const easeProgress = 1 - (1 - progress) * (1 - progress)
            setCount(Math.floor(easeProgress * target))

            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }

          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [target, duration])

  return { count, ref }
}

interface CounterCardProps {
  icon: React.ReactNode
  label: string
  value: number
  format?: 'number' | 'currency' | 'points'
  color: string
}

function CounterCard({ icon, label, value, format = 'number', color }: CounterCardProps) {
  const { count, ref } = useCountUp(value)

  const formattedValue = () => {
    switch (format) {
      case 'currency':
        return formatCurrency(count)
      case 'points':
        return `${count.toLocaleString('fr-FR')} pts`
      default:
        return count.toLocaleString('fr-FR')
    }
  }

  return (
    <div ref={ref} className={`rounded-xl p-6 ${color}`}>
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <span className="text-sm font-medium opacity-80">{label}</span>
      </div>
      <div className="text-3xl font-bold">{formattedValue()}</div>
    </div>
  )
}

interface ImpactCountersProps {
  showTotalCollected?: boolean
}

export function ImpactCounters({ showTotalCollected = true }: ImpactCountersProps) {
  const { stats, housingPool, servicesPool } = useImpact()
  const gridClasses = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'

  return (
    <div className={gridClasses}>
      {showTotalCollected && (
        <CounterCard
          icon={<Euro className="w-6 h-6" />}
          label="Total collecte"
          value={stats.totalCollected}
          format="currency"
          color="bg-ocean-light text-ocean"
        />
      )}
      <CounterCard
        icon={<CalendarDays className="w-6 h-6" />}
        label="Nuitées réservées"
        value={stats.totalNights}
        color="bg-muted text-foreground"
      />
      <CounterCard
        icon={<Home className="w-6 h-6" />}
        label="Fonds logement"
        value={housingPool.totalPoints}
        format="points"
        color="bg-bretagne-light text-bretagne"
      />
      <CounterCard
        icon={<Wrench className="w-6 h-6" />}
        label="Points services"
        value={servicesPool.totalPoints}
        format="points"
        color="bg-coral-light text-coral"
      />
      <CounterCard
        icon={<TrendingUp className="w-6 h-6" />}
        label="Services realises"
        value={stats.servicesCompleted}
        color="bg-coral-light text-coral"
      />
    </div>
  )
}

export function ImpactCountersCompact() {
  const { stats, housingPool } = useImpact()

  return (
    <div className="flex flex-wrap items-center gap-6 text-sm">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-ocean" />
        <span className="text-muted-foreground">Collecte:</span>
        <span className="font-semibold">{formatCurrency(stats.totalCollected)}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-bretagne" />
        <span className="text-muted-foreground">Logement:</span>
        <span className="font-semibold">{housingPool.totalPoints} pts</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-coral" />
        <span className="text-muted-foreground">Services:</span>
        <span className="font-semibold">{stats.servicesCompleted}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">Logements annuels:</span>
        <span className="font-semibold">{stats.listingsEligibleAnnual}</span>
      </div>
    </div>
  )
}
