import type { HousingPool, ServicesPool, ImpactStats, Owner } from '@/lib/types'

export const housingPool: HousingPool = {
  totalPoints: 8500,
  totalEuros: 85000, // 8500 * 10€
  pointsEarned: 12000,
  pointsSpent: 3500,
  listingsConverted: 1,
}

export const servicesPool: ServicesPool = {
  totalPoints: 4200,
  totalEuros: 42000, // 4200 * 10€
  servicesCompleted: 120,
}

export const impactStats: ImpactStats = {
  totalCollected: 192900, // Total commissions collected
  totalHousingContribution: 60280, // 5% portion
  totalServicesContribution: 36170, // 3% portion
  housingPoolPoints: 8500,
  servicesPoolPoints: 4200,
  listingsEligibleAnnual: 3,
  listingsConvertedAnnual: 1,
  servicesCompleted: 120,
  totalBookings: 45,
  totalNights: 3120,
}

export const owners: Owner[] = [
  {
    id: 'o1',
    name: 'Marie Dupont',
    email: 'marie.dupont@email.fr',
    servicePointsBalance: 85,
    listings: ['l1', 'l3'],
  },
  {
    id: 'o2',
    name: 'Jean Martin',
    email: 'jean.martin@email.fr',
    servicePointsBalance: 120,
    listings: ['l2', 'l7'],
  },
  {
    id: 'o3',
    name: 'Pierre Leroy',
    email: 'pierre.leroy@email.fr',
    servicePointsBalance: 200,
    listings: ['l4', 'l10'],
  },
  {
    id: 'o4',
    name: 'Sophie Bernard',
    email: 'sophie.bernard@email.fr',
    servicePointsBalance: 45,
    listings: ['l5', 'l9'],
  },
  {
    id: 'o5',
    name: 'Yves Moreau',
    email: 'yves.moreau@email.fr',
    servicePointsBalance: 65,
    listings: ['l6', 'l11'],
  },
  {
    id: 'o6',
    name: 'Anne Petit',
    email: 'anne.petit@email.fr',
    servicePointsBalance: 95,
    listings: ['l8', 'l12'],
  },
]

export function getOwnerById(id: string): Owner | undefined {
  return owners.find((o) => o.id === id)
}
