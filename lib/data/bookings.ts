import type { Booking } from '@/lib/types'

export const bookings: Booking[] = [
  // Current year bookings (FERME - confirmed)
  {
    id: 'b1',
    listingId: 'l1',
    guestId: 'g1',
    checkIn: '2026-07-15',
    checkOut: '2026-07-22',
    nights: 7,
    season: 'haute',
    pricePerNight: 97.5, // 65 * 1.5
    totalPrice: 682.5,
    status: 'FERME',
    isNPlus1: false,
    commissionTotal: 109.2,
    commissionPlatform: 54.6,
    commissionHousing: 34.13,
    commissionServices: 20.48,
    housingPointsGenerated: 3.41,
    servicePointsGenerated: 2.05,
    createdAt: '2026-06-10',
  },
  {
    id: 'b2',
    listingId: 'l3',
    guestId: 'g2',
    checkIn: '2026-08-01',
    checkOut: '2026-08-15',
    nights: 14,
    season: 'haute',
    pricePerNight: 180, // 120 * 1.5
    totalPrice: 2520,
    status: 'FERME',
    isNPlus1: false,
    commissionTotal: 403.2,
    commissionPlatform: 201.6,
    commissionHousing: 126,
    commissionServices: 75.6,
    housingPointsGenerated: 12.6,
    servicePointsGenerated: 7.56,
    createdAt: '2026-06-15',
  },
  {
    id: 'b3',
    listingId: 'l4',
    guestId: 'g3',
    checkIn: '2026-06-20',
    checkOut: '2026-06-27',
    nights: 7,
    season: 'moyenne',
    pricePerNight: 225, // 180 * 1.25
    totalPrice: 1575,
    status: 'FERME',
    isNPlus1: false,
    commissionTotal: 252,
    commissionPlatform: 126,
    commissionHousing: 78.75,
    commissionServices: 47.25,
    housingPointsGenerated: 7.88,
    servicePointsGenerated: 4.73,
    createdAt: '2026-06-01',
  },
  // N+1 pre-bookings (OPTION - can become FERME)
  {
    id: 'b4',
    listingId: 'l2',
    guestId: 'g1',
    checkIn: '2026-07-10',
    checkOut: '2026-07-17',
    nights: 7,
    season: 'haute',
    pricePerNight: 127.5, // 85 * 1.5
    totalPrice: 892.5,
    status: 'OPTION',
    isNPlus1: true,
    commissionTotal: 142.8,
    commissionPlatform: 71.4,
    commissionHousing: 44.63,
    commissionServices: 26.78,
    housingPointsGenerated: 4.46,
    servicePointsGenerated: 2.68,
    createdAt: '2026-07-01',
    optionExpiresAt: '2026-04-11', // J-90
  },
  {
    id: 'b5',
    listingId: 'l10',
    guestId: 'g4',
    checkIn: '2026-08-01',
    checkOut: '2026-08-14',
    nights: 14,
    season: 'haute',
    pricePerNight: 330, // 220 * 1.5
    totalPrice: 4620,
    status: 'OPTION',
    isNPlus1: true,
    commissionTotal: 739.2,
    commissionPlatform: 369.6,
    commissionHousing: 231,
    commissionServices: 138.6,
    housingPointsGenerated: 23.1,
    servicePointsGenerated: 13.86,
    createdAt: '2026-07-05',
    optionExpiresAt: '2026-05-03', // J-90
  },
  {
    id: 'b6',
    listingId: 'l6',
    guestId: 'g5',
    checkIn: '2026-05-01',
    checkOut: '2026-05-08',
    nights: 7,
    season: 'moyenne',
    pricePerNight: 118.75, // 95 * 1.25
    totalPrice: 831.25,
    status: 'FERME',
    isNPlus1: true,
    commissionTotal: 133,
    commissionPlatform: 66.5,
    commissionHousing: 41.56,
    commissionServices: 24.94,
    housingPointsGenerated: 4.16,
    servicePointsGenerated: 2.49,
    createdAt: '2026-06-20',
    optionExpiresAt: '2026-02-01', // Already past J-90, so FERME
  },
  // Completed past bookings
  {
    id: 'b7',
    listingId: 'l5',
    guestId: 'g2',
    checkIn: '2027-06-10',
    checkOut: '2027-06-14',
    nights: 4,
    season: 'moyenne',
    pricePerNight: 93.75, // 75 * 1.25
    totalPrice: 375,
    status: 'COMPLETED',
    isNPlus1: false,
    commissionTotal: 60,
    commissionPlatform: 30,
    commissionHousing: 18.75,
    commissionServices: 11.25,
    housingPointsGenerated: 1.88,
    servicePointsGenerated: 1.13,
    createdAt: '2027-06-01',
  },
  {
    id: 'b8',
    listingId: 'l11',
    guestId: 'g6',
    checkIn: '2027-07-15',
    checkOut: '2027-07-22',
    nights: 7,
    season: 'basse',
    pricePerNight: 80, // 80 * 1.0
    totalPrice: 560,
    status: 'COMPLETED',
    isNPlus1: false,
    commissionTotal: 89.6,
    commissionPlatform: 44.8,
    commissionHousing: 28,
    commissionServices: 16.8,
    housingPointsGenerated: 2.8,
    servicePointsGenerated: 1.68,
    createdAt: '2027-06-10',
  },
]

export function getBookingsByListingId(listingId: string): Booking[] {
  return bookings.filter((b) => b.listingId === listingId)
}

export function getBookingsByStatus(status: Booking['status']): Booking[] {
  return bookings.filter((b) => b.status === status)
}

export function getNPlus1Bookings(): Booking[] {
  return bookings.filter((b) => b.isNPlus1)
}

export function getConfirmedBookings(): Booking[] {
  return bookings.filter((b) => b.status === 'FERME' || b.status === 'COMPLETED')
}
