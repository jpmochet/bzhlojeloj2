import type { AdminConfig } from '@/lib/types'

export const defaultConfig: AdminConfig = {
  // Commission: 15% total = 5% platform + 7% housing + 3% services
  commission: {
    totalPct: 0.15,
    platformPct: 0.05,
    housingPct: 0.07,
    servicesPct: 0.03,
  },

  // Season multipliers and date ranges
  seasons: {
    basse: { multiplier: 1.0, startMonth: 1, endMonth: 4 }, // Jan-Apr, Oct-Dec
    moyenne: { multiplier: 1.25, startMonth: 5, endMonth: 6 }, // May-Jun, Sep
    haute: { multiplier: 1.5, startMonth: 7, endMonth: 8 }, // Jul-Aug
  },

  // N+1 Anticipation: options become firm at J-90
  optionBecomesFirmDays: 90,

  // Housing Pool Configuration
  eurPerHousingPoint: 10,
  
  // Annual rent equivalent per night by property type
  annualNightEquivalent: {
    T1: 15, // ~450€/month equivalent
    T2: 20, // ~600€/month
    T3: 25, // ~750€/month
    T4: 30, // ~900€/month
  },

  // Expected booked nights per season by property type
  expectedOccupation: {
    T1: { low: 20, mid: 35, high: 45 },  // 100 nights total
    T2: { low: 25, mid: 40, high: 50 },  // 115 nights total
    T3: { low: 30, mid: 45, high: 55 },  // 130 nights total
    T4: { low: 35, mid: 50, high: 60 },  // 145 nights total
  },

  // Commission mode: traveler pays (net factor = 1) or owner pays (net factor = 1 - commission)
  netOwnerFactorMode: 'traveler_pays_commission',
  
  // Order for making properties eligible for annual conversion
  eligibilityOrder: ['T1', 'T2', 'T3', 'T4'],
  withinTypeSorting: 'lowestRequiredPointsFirst',

  // Services Configuration
  eurPerServicePoint: 10,
  ownerSharePct: 1.0, // 100% of service points go to owner
  poolSharePct: 0.0,

  // Service cost coefficients
  coefficients: {
    propertyType: { T1: 1.0, T2: 1.3, T3: 1.7, T4: 2.1 },
    propertyKind: { appartement: 1.0, maison: 1.25 },
    seaProximity: { standard: 1.0, proche_mer: 1.3, vue_mer: 1.5 },
  },
}
