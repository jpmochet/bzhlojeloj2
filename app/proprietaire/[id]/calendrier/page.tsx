'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Calendar as DayCalendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getListingById } from '@/lib/data/listings'
import { getBookingsByListingId } from '@/lib/data/bookings'
import { ArrowLeft, Calendar as CalendarIcon, MapPin } from 'lucide-react'

const monthMap: Record<string, number> = {
  janvier: 0,
  fevrier: 1,
  février: 1,
  mars: 2,
  avril: 3,
  mai: 4,
  juin: 5,
  juillet: 6,
  aout: 7,
  août: 7,
  septembre: 8,
  octobre: 9,
  novembre: 10,
  decembre: 11,
  décembre: 11,
}

function getDaysBetween(startDate: string, endDate: string) {
  const dates: Date[] = []
  const current = new Date(startDate)
  const end = new Date(endDate)

  while (current < end) {
    dates.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }

  return dates
}

function parseMonthYear(value: string): Date | null {
  const normalized = value.toLowerCase().trim().replace(/ç/g, 'c').replace(/[^a-z0-9 ]/g, '')
  const parts = normalized.split(' ').filter(Boolean)
  if (parts.length < 2) return null

  const year = Number(parts[parts.length - 1])
  const month = monthMap[parts.slice(0, -1).join(' ')]
  if (Number.isNaN(year) || month === undefined) return null

  return new Date(year, month, 1)
}

function formatDateIso(date: Date) {
  return date.toISOString().slice(0, 10)
}

export default function ListingCalendarPage() {
  const params = useParams() as { id?: string }
  const listingId = params?.id ?? ''
  const listing = useMemo(() => getListingById(listingId), [listingId])
  const bookings = useMemo(() => getBookingsByListingId(listingId), [listingId])

  const bookedDates = useMemo(
    () => bookings.flatMap((booking) => getDaysBetween(booking.checkIn, booking.checkOut)),
    [bookings],
  )

  const reservedStartDate = useMemo(() => {
    if (!listing?.reservedFrom) return null
    return parseMonthYear(listing.reservedFrom)
  }, [listing?.reservedFrom])

  const reservedYearDates = useMemo(() => {
    if (!reservedStartDate) return []
    const reservedEndDate = new Date(reservedStartDate)
    reservedEndDate.setFullYear(reservedEndDate.getFullYear() + 1)
    return getDaysBetween(formatDateIso(reservedStartDate), formatDateIso(reservedEndDate))
  }, [reservedStartDate])

  const disabledDates = useMemo(
    () => [...bookedDates, ...reservedYearDates],
    [bookedDates, reservedYearDates],
  )

  const isAnnualReserved = Boolean(listing?.reservedFrom && listing.annualEligibilityStatus !== 'SEASONAL_ONLY')

  const annualMonths = useMemo(() => {
    if (!reservedStartDate) return []
    return Array.from({ length: 12 }, (_, index) => {
      const monthDate = new Date(reservedStartDate)
      monthDate.setMonth(monthDate.getMonth() + index)
      return {
        key: monthDate.toISOString(),
        label: monthDate.toLocaleString('fr-FR', { month: 'long', year: 'numeric' }),
        status: 'Réservé',
      }
    })
  }, [reservedStartDate])

  const calendarStartMonth = reservedStartDate ?? new Date()
  const calendarEndMonth = useMemo(() => {
    if (!reservedStartDate) return null
    const endMonth = new Date(reservedStartDate)
    endMonth.setFullYear(endMonth.getFullYear() + 1)
    return endMonth
  }, [reservedStartDate])

  const today = new Date()

  if (!listing) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Logement introuvable</h1>
        <Button asChild>
          <Link href="/proprietaire">Retour au tableau de bord</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30 py-10">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Calendrier du logement</h1>
            <p className="text-muted-foreground">Consultez les périodes déjà réservées pour ce logement.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" className="gap-2">
              <Link href="/proprietaire">
                <ArrowLeft className="h-4 w-4" /> Retour
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/logements/${listing.id}`}>
                Voir la fiche logement
              </Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{listing.title}</CardTitle>
            <div className="text-sm text-muted-foreground mt-1">{listing.location}</div>
          </CardHeader>
          <CardContent className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-4">
              <div className="rounded-lg border border-dashed border-primary/50 bg-primary/5 p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span>Légende</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-3 w-3 rounded-full bg-muted" />
                    <span>Disponible</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-3 w-3 rounded-full bg-muted/50 opacity-70" />
                    <span>Réservé / bloqué</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border bg-background p-4 overflow-x-auto">
                <DayCalendar
                  mode="single"
                  numberOfMonths={2}
                  defaultMonth={calendarStartMonth}
                  disabled={disabledDates}
                  className="w-full min-w-[700px]"
                />
              </div>

              {isAnnualReserved ? (
                <div className="space-y-3">
                  <h2 className="text-lg font-semibold">Réservation annuelle mois par mois</h2>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {annualMonths.map((month) => (
                      <div key={month.key} className="rounded-lg border p-4 bg-background">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium">{month.label}</span>
                          <Badge variant="secondary">{month.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">Période réservée à l’année</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <h2 className="text-lg font-semibold">Réservations</h2>
                  {bookings.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Aucune réservation enregistrée pour ce logement.</p>
                  ) : (
                    <div className="space-y-3">
                      {bookings.map((booking) => (
                        <div key={booking.id} className="rounded-lg border p-4 bg-background">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="font-semibold">{booking.status}</div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(booking.checkIn).toLocaleDateString('fr-FR')} – {new Date(booking.checkOut).toLocaleDateString('fr-FR')}
                              </div>
                            </div>
                            <Badge variant="secondary">{booking.isNPlus1 ? 'N+1' : 'Confirmée'}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
