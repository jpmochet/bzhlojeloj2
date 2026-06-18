import type { AdminConfig, Booking, Listing, AnnualEligibilityStatus } from '@/lib/types'

/**
 * Calculates housing points earned from a booking
 */
export function calculateHousingPointsFromBooking(
  booking: Booking,
  config: AdminConfig
): number {
  const housingContribution = booking.totalPrice * config.commission.housingPct
  return Math.round((housingContribution / config.eurPerHousingPoint) * 100) / 100
}

/**
 * Calculates total housing points earned from confirmed bookings
 */
export function calculateTotalHousingPoints(
  bookings: Booking[],
  config: AdminConfig
): number {
  return bookings
    .filter((b) => b.status === 'FERME' || b.status === 'COMPLETED')
    .reduce((total, booking) => {
      return total + calculateHousingPointsFromBooking(booking, config)
    }, 0)
}

/**
 * Checks if a listing can be allocated points (moved to ELIGIBLE_ANNUAL)
 */
export function canAllocateToListing(
  listing: Listing,
  availablePoints: number
): boolean {
  if (listing.annualEligibilityStatus !== 'SEASONAL_ONLY') {
    return false
  }
  return availablePoints >= listing.requiredHousingPoints
}

/**
 * Checks if a listing can be pre-booked for annual rental
 */
export function canPrebookAnnual(
  listing: Listing,
  availablePoolPoints: number
): { canPrebook: boolean; reason?: string } {
  if (listing.annualEligibilityStatus !== 'ELIGIBLE_ANNUAL') {
    return {
      canPrebook: false,
      reason: 'Ce logement n\'est pas encore eligible a la location annuelle.',
    }
  }

  const remainingPoints = listing.requiredHousingPoints - listing.allocatedHousingPoints
  if (availablePoolPoints < remainingPoints) {
    return {
      canPrebook: false,
      reason: `Fonds insuffisants. Il manque ${remainingPoints - availablePoolPoints} points.`,
    }
  }

  return { canPrebook: true }
}

/**
 * Simulates pre-booking an annual listing
 */
export function simulateAnnualPrebook(
  listing: Listing,
  poolPoints: number
): {
  updatedListing: Listing
  remainingPoolPoints: number
  pointsSpent: number
} {
  const remainingNeeded = listing.requiredHousingPoints - listing.allocatedHousingPoints
  const pointsSpent = Math.min(remainingNeeded, poolPoints)

  const updatedListing: Listing = {
    ...listing,
    allocatedHousingPoints: listing.allocatedHousingPoints + pointsSpent,
    annualEligibilityStatus:
      listing.allocatedHousingPoints + pointsSpent >= listing.requiredHousingPoints
        ? 'ANNUAL_PREBOOKED'
        : listing.annualEligibilityStatus,
  }

  return {
    updatedListing,
    remainingPoolPoints: poolPoints - pointsSpent,
    pointsSpent,
  }
}

/**
 * Gets status label in French
 */
export function getEligibilityStatusLabel(status: AnnualEligibilityStatus): string {
  const labels: Record<AnnualEligibilityStatus, string> = {
    SEASONAL_ONLY: 'Saisonnier uniquement',
    ELIGIBLE_ANNUAL: 'Eligible annuel',
    ANNUAL_PREBOOKED: 'Pre-reserve annuel',
    ANNUAL_ACTIVE: 'Location annuelle active',
  }
  return labels[status]
}

/**
 * Gets status color for UI
 */
export function getEligibilityStatusColor(status: AnnualEligibilityStatus): string {
  const colors: Record<AnnualEligibilityStatus, string> = {
    SEASONAL_ONLY: 'bg-muted text-muted-foreground',
    ELIGIBLE_ANNUAL: 'bg-bretagne-light text-bretagne',
    ANNUAL_PREBOOKED: 'bg-ocean-light text-ocean',
    ANNUAL_ACTIVE: 'bg-coral-light text-coral',
  }
  return colors[status]
}
