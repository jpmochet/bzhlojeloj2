'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import {
  Calendar,
  Clock,
  TrendingUp,
  Home,
  Check,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useConfig } from '@/lib/context/config-context'
import { useImpact } from '@/lib/context/impact-context'
import { bookings, getNPlus1Bookings, getConfirmedBookings } from '@/lib/data/bookings'
import { listings } from '@/lib/data/listings'
import { formatCurrency } from '@/lib/engines/commission-calculator'
import {
  getDaysUntilFirm,
  getBookingStatusLabel,
  getBookingStatusColor,
  formatDateRange,
  calculateConfirmedNights,
  calculateProjectedNights,
} from '@/lib/engines/booking-status-engine'
import { getSeasonLabel } from '@/lib/engines/season-price-calculator'

export default function AnticipationPage() {
  const { config } = useConfig()
  const { housingPool } = useImpact()

  const nPlus1Bookings = getNPlus1Bookings()
  const confirmedBookings = getConfirmedBookings()

  // Stats
  const stats = useMemo(() => {
    const optionBookings = nPlus1Bookings.filter((b) => b.status === 'OPTION')
    const fermeBookings = nPlus1Bookings.filter((b) => b.status === 'FERME')
    
    const optionNights = optionBookings.reduce((sum, b) => sum + b.nights, 0)
    const fermeNights = fermeBookings.reduce((sum, b) => sum + b.nights, 0)
    
    const optionRevenue = optionBookings.reduce((sum, b) => sum + b.totalPrice, 0)
    const fermeRevenue = fermeBookings.reduce((sum, b) => sum + b.totalPrice, 0)
    
    const projectedHousingPoints = fermeBookings.reduce(
      (sum, b) => sum + b.housingPointsGenerated,
      0
    )

    return {
      optionCount: optionBookings.length,
      fermeCount: fermeBookings.length,
      optionNights,
      fermeNights,
      optionRevenue,
      fermeRevenue,
      projectedHousingPoints,
    }
  }, [nPlus1Bookings])

  // Projection - how many listings could become eligible
  const projectedEligibleListings = useMemo(() => {
    const futurePoints = housingPool.totalPoints + stats.projectedHousingPoints
    // Simplified: count how many T1s we could fund (assuming ~300 pts each)
    return Math.floor(futurePoints / 300)
  }, [housingPool.totalPoints, stats.projectedHousingPoints])

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Anticipation N+1</h1>
        <p className="text-muted-foreground">
          Gérez les pré-réservations pour l&apos;année prochaine et suivez les projections d&apos;impact.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <span className="text-sm text-muted-foreground">Options</span>
            </div>
            <div className="text-2xl font-bold">{stats.optionCount}</div>
            <div className="text-sm text-muted-foreground">
              {stats.optionNights} nuits - {formatCurrency(stats.optionRevenue)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-bretagne-light flex items-center justify-center">
                <Check className="w-5 h-5 text-bretagne" />
              </div>
              <span className="text-sm text-muted-foreground">Fermes</span>
            </div>
            <div className="text-2xl font-bold">{stats.fermeCount}</div>
            <div className="text-sm text-muted-foreground">
              {stats.fermeNights} nuits - {formatCurrency(stats.fermeRevenue)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-ocean-light flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-ocean" />
              </div>
              <span className="text-sm text-muted-foreground">Points projetes</span>
            </div>
            <div className="text-2xl font-bold">+{stats.projectedHousingPoints.toFixed(0)}</div>
            <div className="text-sm text-muted-foreground">
              Points logement (reserves fermes)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-coral-light flex items-center justify-center">
                <Home className="w-5 h-5 text-coral" />
              </div>
              <span className="text-sm text-muted-foreground">Logements eligibles</span>
            </div>
            <div className="text-2xl font-bold">{projectedEligibleListings}</div>
            <div className="text-sm text-muted-foreground">
              Projection fin N+1
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Nuitées confirmées */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Nuitées confirmées N+1</CardTitle>
          <CardDescription>
            Uniquement les réservations FERME comptent pour les projections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-8">
            <div className="flex-1">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Nuitees confirmees (FERME)
                </span>
                <span className="font-medium">{stats.fermeNights} / {stats.fermeNights + stats.optionNights}</span>
              </div>
              <Progress
                value={
                  stats.fermeNights + stats.optionNights > 0
                    ? (stats.fermeNights / (stats.fermeNights + stats.optionNights)) * 100
                    : 0
                }
                className="h-3"
              />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-bretagne">
                {formatCurrency(stats.fermeRevenue)}
              </div>
              <div className="text-sm text-muted-foreground">CA confirme</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pre-reservations Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Pré-réservations N+1
          </CardTitle>
          <CardDescription>
            Les options deviennent fermes automatiquement à J-{config.optionBecomesFirmDays}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {nPlus1Bookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">Aucune pré-réservation N+1</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Les voyageurs peuvent réserver pour l&apos;année prochaine depuis les pages logements.
              </p>
              <Button asChild>
                <Link href="/logements">Voir les logements</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Logement</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Saison</TableHead>
                    <TableHead>Nuits</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>J-90</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {nPlus1Bookings.map((booking) => {
                    const listing = listings.find((l) => l.id === booking.listingId)
                    const daysUntilFirm = getDaysUntilFirm(booking)
                    
                    return (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{listing?.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {listing?.city}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {formatDateRange(booking.checkIn, booking.checkOut)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getSeasonLabel(booking.season)}
                          </Badge>
                        </TableCell>
                        <TableCell>{booking.nights}</TableCell>
                        <TableCell>{formatCurrency(booking.totalPrice)}</TableCell>
                        <TableCell>
                          <Badge className={getBookingStatusColor(booking.status)}>
                            {getBookingStatusLabel(booking.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {booking.status === 'OPTION' && daysUntilFirm !== null ? (
                            <div className="flex items-center gap-1.5">
                              {daysUntilFirm <= 30 ? (
                                <AlertCircle className="w-4 h-4 text-yellow-500" />
                              ) : (
                                <Clock className="w-4 h-4 text-muted-foreground" />
                              )}
                              <span className={daysUntilFirm <= 30 ? 'text-yellow-600 font-medium' : ''}>
                                {daysUntilFirm}j
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Housing Pool Projection */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">Projection du pool logement</CardTitle>
          <CardDescription>
            Evolution projetee du pool en fonction des reservations confirmees N+1
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-lg bg-muted text-center">
              <div className="text-sm text-muted-foreground mb-1">Pool actuel</div>
              <div className="text-2xl font-bold">{housingPool.totalPoints} pts</div>
            </div>
            <div className="p-4 rounded-lg bg-bretagne-light text-center">
              <div className="text-sm text-muted-foreground mb-1">+ Points N+1 (FERME)</div>
              <div className="text-2xl font-bold text-bretagne">
                +{stats.projectedHousingPoints.toFixed(0)} pts
              </div>
            </div>
            <div className="p-4 rounded-lg bg-ocean-light text-center">
              <div className="text-sm text-muted-foreground mb-1">Pool projete</div>
              <div className="text-2xl font-bold text-ocean">
                {(housingPool.totalPoints + stats.projectedHousingPoints).toFixed(0)} pts
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Avec ce pool projeté, nous pourrions rendre éligibles{' '}
              <strong className="text-foreground">{projectedEligibleListings} logements supplémentaires</strong>{' '}
              à la location annuelle.
            </p>
            <Button asChild>
              <Link href="/impact">
                Voir l&apos;impact en detail
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
