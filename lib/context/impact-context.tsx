'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import type { ImpactStats, HousingPool, ServicesPool } from '@/lib/types'
import {
  impactStats as initialImpactStats,
  housingPool as initialHousingPool,
  servicesPool as initialServicesPool,
} from '@/lib/data/pools'

interface ImpactContextValue {
  stats: ImpactStats
  housingPool: HousingPool
  servicesPool: ServicesPool
  addHousingPoints: (points: number) => void
  spendHousingPoints: (points: number) => void
  addServicesPoints: (points: number) => void
  incrementServicesCompleted: () => void
}

const ImpactContext = createContext<ImpactContextValue | null>(null)

export function ImpactProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<ImpactStats>(initialImpactStats)
  const [housingPool, setHousingPool] = useState<HousingPool>(initialHousingPool)
  const [servicesPool, setServicesPool] = useState<ServicesPool>(initialServicesPool)

  const addHousingPoints = (points: number) => {
    setHousingPool((prev) => ({
      ...prev,
      totalPoints: prev.totalPoints + points,
      pointsEarned: prev.pointsEarned + points,
    }))
    setStats((prev) => ({
      ...prev,
      housingPoolPoints: prev.housingPoolPoints + points,
    }))
  }

  const spendHousingPoints = (points: number) => {
    setHousingPool((prev) => ({
      ...prev,
      totalPoints: prev.totalPoints - points,
      pointsSpent: prev.pointsSpent + points,
    }))
  }

  const addServicesPoints = (points: number) => {
    setServicesPool((prev) => ({
      ...prev,
      totalPoints: prev.totalPoints + points,
    }))
    setStats((prev) => ({
      ...prev,
      servicesPoolPoints: prev.servicesPoolPoints + points,
    }))
  }

  const incrementServicesCompleted = () => {
    setServicesPool((prev) => ({
      ...prev,
      servicesCompleted: prev.servicesCompleted + 1,
    }))
    setStats((prev) => ({
      ...prev,
      servicesCompleted: prev.servicesCompleted + 1,
    }))
  }

  return (
    <ImpactContext.Provider
      value={{
        stats,
        housingPool,
        servicesPool,
        addHousingPoints,
        spendHousingPoints,
        addServicesPoints,
        incrementServicesCompleted,
      }}
    >
      {children}
    </ImpactContext.Provider>
  )
}

export function useImpact() {
  const context = useContext(ImpactContext)
  if (!context) {
    throw new Error('useImpact must be used within an ImpactProvider')
  }
  return context
}
