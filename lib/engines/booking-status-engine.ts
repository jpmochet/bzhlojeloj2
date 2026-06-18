import type { AdminConfig, Booking, BookingStatus } from '@/lib/types'

/**
 * Calculates the date when an option becomes firm (J-90)
 */
export function calculateOptionExpiryDate(
  checkInDate: string,
  config: AdminConfig
): string {
  const checkIn = new Date(checkInDate)
  const expiryDate = new Date(checkIn)
  expiryDate.setDate(expiryDate.getDate() - config.optionBecomesFirmDays)
  return expiryDate.toISOString().split('T')[0]
}

/**
 * Checks if an option should become firm based on current date
 */
export function shouldBecomesFirm(booking: Booking, config: AdminConfig): boolean {
  if (booking.status !== 'OPTION') return false
  if (!booking.isNPlus1) return false

  const today = new Date()
  const checkIn = new Date(booking.checkIn)
  const daysUntilCheckIn = Math.ceil(
    (checkIn.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  )

  return daysUntilCheckIn <= config.optionBecomesFirmDays
}

/**
 * Gets days remaining until option becomes firm
 */
export function getDaysUntilFirm(booking: Booking): number | null {
  if (!booking.optionExpiresAt) return null

  const today = new Date()
  const expiryDate = new Date(booking.optionExpiresAt)
  const daysRemaining = Math.ceil(
    (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  )

  return Math.max(0, daysRemaining)
}

/**
 * Gets booking status label in French
 */
export function getBookingStatusLabel(status: BookingStatus): string {
  const labels: Record<BookingStatus, string> = {
    OPTION: 'Option',
    FERME: 'Ferme',
    COMPLETED: 'Termine',
    CANCELLED: 'Annule',
  }
  return labels[status]
}

/**
 * Gets booking status color for UI
 */
export function getBookingStatusColor(status: BookingStatus): string {
  const colors: Record<BookingStatus, string> = {
    OPTION: 'bg-yellow-100 text-yellow-800',
    FERME: 'bg-bretagne-light text-bretagne',
    COMPLETED: 'bg-ocean-light text-ocean',
    CANCELLED: 'bg-destructive/10 text-destructive',
  }
  return colors[status]
}

/**
 * Filters bookings that count toward confirmed occupation
 */
export function getConfirmedOccupationBookings(bookings: Booking[]): Booking[] {
  return bookings.filter((b) => b.status === 'FERME' || b.status === 'COMPLETED')
}

/**
 * Calculates total confirmed nights
 */
export function calculateConfirmedNights(bookings: Booking[]): number {
  return getConfirmedOccupationBookings(bookings).reduce(
    (total, booking) => total + booking.nights,
    0
  )
}

/**
 * Calculates total projected nights (including options)
 */
export function calculateProjectedNights(bookings: Booking[]): number {
  return bookings
    .filter((b) => b.status !== 'CANCELLED')
    .reduce((total, booking) => total + booking.nights, 0)
}

/**
 * Formats date for display in French format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

/**
 * Formats date range for display
 */
export function formatDateRange(checkIn: string, checkOut: string): string {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
  }
  const startDate = new Date(checkIn)
  const endDate = new Date(checkOut)

  const startStr = new Intl.DateTimeFormat('fr-FR', options).format(startDate)
  const endStr = new Intl.DateTimeFormat('fr-FR', {
    ...options,
    year: 'numeric',
  }).format(endDate)

  return `${startStr} - ${endStr}`
}
