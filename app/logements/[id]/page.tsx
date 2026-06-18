'use client'

import { use, useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  MapPin,
  Users,
  Bed,
  Bath,
  Home,
  Building2,
  Waves,
  Check,
  Calendar,
  ArrowRight,
  Info,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { SeasonPriceTable } from '@/components/season-price-table'
import { CommissionBreakdown } from '@/components/commission-breakdown'
import { HousingPoolProgress } from '@/components/points-wallet'
import { ReservationCalendar } from '@/components/reservation-calendar'
import { useConfig } from '@/lib/context/config-context'
import { getListingById } from '@/lib/data/listings'
import { getBookingsByListingId } from '@/lib/data/bookings'
import { calculatePrice, calculatePriceForDateRange, formatCurrency } from '@/lib/engines/commission-calculator'
import {
  getSeasonForDate,
  getSeasonLabel,
} from '@/lib/engines/season-price-calculator'
import {
  getEligibilityStatusLabel,
  getEligibilityStatusColor,
} from '@/lib/engines/housing-pool-engine'
import {
  calculateFundingProgress,
  calculateRemainingPoints,
} from '@/lib/engines/housing-delta-calculator'
import { formatDateRange, getBookingStatusLabel, getBookingStatusColor } from '@/lib/engines/booking-status-engine'
import type { Season } from '@/lib/types'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function ListingDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const router = useRouter()
  const { config } = useConfig()
  const listing = getListingById(id)
  const existingBookings = getBookingsByListingId(id)

  const [checkIn, setCheckIn] = useState<Date | null>(null)
  const [checkOut, setCheckOut] = useState<Date | null>(null)
  const [isNPlus1, setIsNPlus1] = useState(false)

  // Ensure dates are in correct order
  const validCheckIn = checkIn && checkOut && checkOut < checkIn ? checkOut : checkIn
  const validCheckOut = checkIn && checkOut && checkOut < checkIn ? checkIn : checkOut

  const nights = useMemo(() => {
    if (!validCheckIn || !validCheckOut) return 0
    return Math.ceil((validCheckOut.getTime() - validCheckIn.getTime()) / (1000 * 60 * 60 * 24))
  }, [validCheckIn, validCheckOut])

  const season = useMemo(() => {
    if (!validCheckIn) return 'haute'
    return getSeasonForDate(validCheckIn, config)
  }, [validCheckIn, config])

  const priceCalculation = useMemo(() => {
    if (!listing || !validCheckIn || !validCheckOut) return null
    return calculatePriceForDateRange(listing.baseLowSeasonPrice, validCheckIn, validCheckOut, config)
  }, [listing, validCheckIn, validCheckOut, config])

  if (!listing) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Logement non trouve</h1>
        <Button asChild>
          <Link href="/logements">Retour aux logements</Link>
        </Button>
      </div>
    )
  }

  const PropertyIcon = listing.propertyKind === 'maison' ? Home : Building2
  const fundingProgress = calculateFundingProgress(listing)
  const remainingPoints = calculateRemainingPoints(listing)

  const handleReserve = () => {
    if (!validCheckIn || !validCheckOut) return
    const params = new URLSearchParams({
      listingId: listing.id,
      checkIn: validCheckIn.toISOString().split('T')[0],
      checkOut: validCheckOut.toISOString().split('T')[0],
      season,
      nights: nights.toString(),
      isNPlus1: isNPlus1.toString(),
    })
    router.push(`/checkout?${params.toString()}`)
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="secondary">{listing.propertyType}</Badge>
              <Badge variant="outline" className="capitalize">
                <PropertyIcon className="w-3 h-3 mr-1" />
                {listing.propertyKind}
              </Badge>
              {listing.seaProximity !== 'standard' && (
                <Badge className="bg-ocean text-ocean-foreground">
                  <Waves className="w-3 h-3 mr-1" />
                  {listing.seaProximity === 'vue_mer' ? 'Vue mer' : 'Proche mer'}
                </Badge>
              )}
              {listing.annualEligibilityStatus !== 'SEASONAL_ONLY' && (
                <Badge className={getEligibilityStatusColor(listing.annualEligibilityStatus)}>
                  {getEligibilityStatusLabel(listing.annualEligibilityStatus)}
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{listing.location}</span>
            </div>
          </div>

          {/* Image placeholder */}
          <div className="aspect-video bg-ocean-light rounded-xl flex items-center justify-center">
            <PropertyIcon className="w-24 h-24 text-ocean/30" />
          </div>

          {/* Details */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-muted-foreground" />
              <span>{listing.maxGuests} voyageurs</span>
            </div>
            {listing.bedrooms > 0 && (
              <div className="flex items-center gap-2">
                <Bed className="w-5 h-5 text-muted-foreground" />
                <span>{listing.bedrooms} chambre{listing.bedrooms > 1 ? 's' : ''}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Bath className="w-5 h-5 text-muted-foreground" />
              <span>{listing.bathrooms} salle{listing.bathrooms > 1 ? 's' : ''} de bain</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Description</h2>
            <p className="text-muted-foreground">{listing.description}</p>
          </div>

          {/* Amenities */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Equipements</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {listing.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-bretagne" />
                  <span className="text-sm">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Season Pricing */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Tarifs par saison</h2>
            <SeasonPriceTable
              baseLowSeasonPrice={listing.baseLowSeasonPrice}
              highlightSeason={season}
            />
          </div>

          {/* Impact Block */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Impact de votre réservation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CommissionBreakdown amount={priceCalculation?.subtotal} />
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 rounded-lg bg-bretagne-light">
                  <div className="text-muted-foreground mb-1">Points logement générés</div>
                  <div className="font-semibold text-bretagne">
                    +{priceCalculation?.housingPointsGenerated.toFixed(1)} pts
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-coral-light">
                  <div className="text-muted-foreground mb-1">Points services générés</div>
                  <div className="font-semibold text-coral">
                    +{priceCalculation?.servicePointsGenerated.toFixed(1)} pts
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Annual Eligibility Progress */}
          {listing.annualEligibilityStatus !== 'SEASONAL_ONLY' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Progression vers la location annuelle</CardTitle>
              </CardHeader>
              <CardContent>
                <HousingPoolProgress
                  current={listing.allocatedHousingPoints}
                  target={listing.requiredHousingPoints}
                  label="Financement de la conversion"
                />
              </CardContent>
            </Card>
          )}

          {/* N+1 Pre-bookings */}
          {existingBookings.filter(b => b.isNPlus1).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Pré-réservations N+1
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {existingBookings.filter(b => b.isNPlus1).map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted"
                    >
                      <div>
                        <div className="font-medium">
                          {formatDateRange(booking.checkIn, booking.checkOut)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {booking.nights} nuits - {getSeasonLabel(booking.season)}
                        </div>
                      </div>
                      <Badge className={getBookingStatusColor(booking.status)}>
                        {getBookingStatusLabel(booking.status)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Booking Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Reserver</span>
                <span className="text-2xl">
                  {formatCurrency(priceCalculation?.pricePerNight || 0)}
                  <span className="text-sm font-normal text-muted-foreground">/nuit</span>
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Calendar */}
              <div>
                <Label className="mb-2 block">Sélectionnez vos dates</Label>
                <ReservationCalendar
                  checkIn={checkIn}
                  checkOut={checkOut}
                  onCheckInChange={setCheckIn}
                  onCheckOutChange={setCheckOut}
                  existingBookings={existingBookings}
                />
              </div>

              {/* Saison affichée */}
              {validCheckIn && (
                <div className="p-3 bg-muted rounded-lg text-sm">
                  <p className="text-muted-foreground">Saison</p>
                  <p className="font-semibold">{getSeasonLabel(season)}</p>
                </div>
              )}

              {/* N+1 Toggle */}
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                <input
                  type="checkbox"
                  id="nplus1"
                  checked={isNPlus1}
                  onChange={(e) => setIsNPlus1(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="nplus1" className="flex-1 cursor-pointer">
                  Pré-réservation N+1
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      Reservez pour l&apos;annee prochaine. Statut OPTION jusqu&apos;a J-90, puis FERME automatiquement.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <Separator />

              {/* Tarifs par saison */}
              <div className="space-y-2 text-xs">
                <p className="font-semibold text-muted-foreground">Tarifs par nuit</p>
                {(['basse', 'moyenne', 'haute'] as const).map((s) => {
                  const price = listing ? listing.baseLowSeasonPrice * config.seasons[s].multiplier : 0
                  return (
                    <div key={s} className="flex justify-between">
                      <span className="text-muted-foreground">{getSeasonLabel(s)}</span>
                      <span className={s === season ? 'font-semibold text-foreground' : ''}>{formatCurrency(price)}</span>
                    </div>
                  )
                })}
              </div>

              <Separator />

              {/* Price Breakdown by Season */}
              {priceCalculation && validCheckIn && validCheckOut && priceCalculation.seasonBreakdown && (
                <div className="space-y-2 text-xs border-t pt-2">
                  <p className="text-muted-foreground font-semibold">Détail par saison</p>
                  {priceCalculation.seasonBreakdown.map((period, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span className="text-muted-foreground">
                        {getSeasonLabel(period.season)}: {formatCurrency(period.pricePerNight)} × {period.nights}n
                      </span>
                      <span>{formatCurrency(period.subtotal)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Price Breakdown */}
              {priceCalculation && validCheckIn && validCheckOut && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Sous-total ({nights} nuits)
                    </span>
                    <span>{formatCurrency(priceCalculation.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Commission ({(config.commission.totalPct * 100).toFixed(0)}%)
                    </span>
                    <span>{formatCurrency(priceCalculation.commissionTotal)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(priceCalculation.totalPrice)}</span>
                  </div>
                </div>
              )}

              <Button
                className="w-full bg-coral hover:bg-coral/90 text-coral-foreground"
                size="lg"
                onClick={handleReserve}
                disabled={!validCheckIn || !validCheckOut}
              >
                Réserver
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Vous ne serez pas debite maintenant
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
