import type {
  AdminConfig,
  Booking,
  Listing,
  Service,
  ServiceOrder,
  ServiceOrderStatus,
} from '@/lib/types'

/**
 * Calculates service points earned from a booking
 */
export function calculateServicePointsFromBooking(
  booking: Booking,
  config: AdminConfig
): { ownerPoints: number; poolPoints: number } {
  const servicesContribution = booking.totalPrice * config.commission.servicesPct
  const totalPoints = servicesContribution / config.eurPerServicePoint

  return {
    ownerPoints: Math.round(totalPoints * config.ownerSharePct * 100) / 100,
    poolPoints: Math.round(totalPoints * config.poolSharePct * 100) / 100,
  }
}

/**
 * Checks if a service is available for a given listing
 */
export function isServiceAvailableForListing(
  service: Service,
  listing: Listing
): boolean {
  if (!service.availableFor) return true

  if (service.availableFor.propertyTypes) {
    if (!service.availableFor.propertyTypes.includes(listing.propertyType)) {
      return false
    }
  }

  if (service.availableFor.propertyKinds) {
    if (!service.availableFor.propertyKinds.includes(listing.propertyKind)) {
      return false
    }
  }

  return true
}

/**
 * Calculates the cost in points for a service based on property coefficients
 */
export function calculateServiceCost(
  service: Service,
  listing: Listing,
  config: AdminConfig
): number {
  const typeCoeff = config.coefficients.propertyType[listing.propertyType]
  const kindCoeff = config.coefficients.propertyKind[listing.propertyKind]
  // Land area coefficient: 0.5m² = 0, 1000m² = 1.5, etc. (linear from 500)
  let landCoeff = 1.0
  if (listing.landArea && listing.landArea > 500) {
    landCoeff = 1.0 + (listing.landArea - 500) / 1000 * 0.5
  }

  return Math.round(service.basePoints * typeCoeff * kindCoeff * landCoeff)
}

/**
 * Checks if owner has enough points for a service
 */
export function canAffordService(
  ownerBalance: number,
  serviceCost: number
): boolean {
  return ownerBalance >= serviceCost
}

/**
 * Gets service order status label in French
 */
export function getServiceOrderStatusLabel(status: ServiceOrderStatus): string {
  const labels: Record<ServiceOrderStatus, string> = {
    DEMANDE: 'Demande',
    PLANIFIE: 'Planifie',
    REALISE: 'Realise',
    VALIDE: 'Valide',
  }
  return labels[status]
}

/**
 * Gets service order status color for UI
 */
export function getServiceOrderStatusColor(status: ServiceOrderStatus): string {
  const colors: Record<ServiceOrderStatus, string> = {
    DEMANDE: 'bg-yellow-100 text-yellow-800',
    PLANIFIE: 'bg-ocean-light text-ocean',
    REALISE: 'bg-bretagne-light text-bretagne',
    VALIDE: 'bg-coral-light text-coral',
  }
  return colors[status]
}

/**
 * Gets next status in the workflow
 */
export function getNextStatus(
  currentStatus: ServiceOrderStatus
): ServiceOrderStatus | null {
  const workflow: Record<ServiceOrderStatus, ServiceOrderStatus | null> = {
    DEMANDE: 'PLANIFIE',
    PLANIFIE: 'REALISE',
    REALISE: 'VALIDE',
    VALIDE: null,
  }
  return workflow[currentStatus]
}

/**
 * Calculates total service points for an owner from all their bookings
 */
export function calculateOwnerTotalServicePoints(
  ownerListingIds: string[],
  bookings: Booking[],
  config: AdminConfig
): number {
  return bookings
    .filter(
      (b) =>
        ownerListingIds.includes(b.listingId) &&
        (b.status === 'FERME' || b.status === 'COMPLETED')
    )
    .reduce((total, booking) => {
      const { ownerPoints } = calculateServicePointsFromBooking(booking, config)
      return total + ownerPoints
    }, 0)
}

/**
 * Calculates total points spent on services by an owner
 */
export function calculateOwnerSpentServicePoints(
  serviceOrders: ServiceOrder[],
  ownerId: string
): number {
  return serviceOrders
    .filter((so) => so.ownerId === ownerId && so.status === 'VALIDE')
    .reduce((total, order) => total + order.pointsCost, 0)
}

/**
 * Groups services by category for display
 */
export function groupServicesByCategory(
  services: Service[],
  categories: { id: string; name: string }[]
): Map<string, Service[]> {
  const grouped = new Map<string, Service[]>()

  categories.forEach((cat) => {
    grouped.set(
      cat.name,
      services.filter((s) => s.categoryId === cat.id && s.isActive)
    )
  })

  return grouped
}

/**
 * Formats points for display
 */
export function formatPoints(points: number): string {
  return `${points.toFixed(0)} pts`
}
