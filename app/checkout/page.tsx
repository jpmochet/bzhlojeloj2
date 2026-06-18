'use client'

import { Suspense, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  MapPin,
  Calendar,
  Clock,
  CreditCard,
  Check,
  Home,
  Wrench,
  TrendingUp,
  ArrowLeft,
  Info,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useConfig } from '@/lib/context/config-context'
import { getListingById } from '@/lib/data/listings'
import { calculatePrice, formatCurrency, formatPercentage } from '@/lib/engines/commission-calculator'
import { getSeasonLabel } from '@/lib/engines/season-price-calculator'
import type { Season } from '@/lib/types'

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { config } = useConfig()

  const listingId = searchParams.get('listingId') || ''
  const season = (searchParams.get('season') || 'haute') as Season
  const nights = parseInt(searchParams.get('nights') || '7')
  const isNPlus1 = searchParams.get('isNPlus1') === 'true'

  const listing = getListingById(listingId)

  const priceCalculation = useMemo(() => {
    if (!listing) return null
    return calculatePrice(listing.baseLowSeasonPrice, nights, season, config)
  }, [listing, nights, season, config])

  if (!listing || !priceCalculation) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Réservation non trouvée</h1>
        <Button asChild>
          <Link href="/logements">Retour aux logements</Link>
        </Button>
      </div>
    )
  }

  const commissionParts = [
    {
      label: 'Plateforme',
      pct: config.commission.platformPct,
      amount: priceCalculation.commissionPlatform,
      color: 'bg-ocean',
      icon: TrendingUp,
    },
    {
      label: 'Logement annuel',
      pct: config.commission.housingPct,
      amount: priceCalculation.commissionHousing,
      color: 'bg-bretagne',
      icon: Home,
    },
    {
      label: 'Services',
      pct: config.commission.servicesPct,
      amount: priceCalculation.commissionServices,
      color: 'bg-coral',
      icon: Wrench,
    },
  ]

  const handlePayment = () => {
    // Placeholder for Stripe integration
    alert('Paiement simule - Integration Stripe a venir')
    router.push('/')
  }

  return (
    <div className="container py-8 max-w-5xl">
      <Button variant="ghost" className="mb-6" asChild>
        <Link href={`/logements/${listing.id}`}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au logement
        </Link>
      </Button>

      <h1 className="text-3xl font-bold mb-8">Confirmer votre réservation</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Listing Summary */}
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="w-24 h-24 rounded-lg bg-ocean-light flex items-center justify-center shrink-0">
                  <Home className="w-8 h-8 text-ocean/30" />
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold text-lg">{listing.title}</h2>
                  <div className="flex items-center gap-1.5 text-muted-foreground text-sm mt-1">
                    <MapPin className="w-4 h-4" />
                    <span>{listing.location}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant="secondary">{listing.propertyType}</Badge>
                    <Badge variant="outline" className="capitalize">
                      {listing.propertyKind}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Détails du séjour</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground">Saison</div>
                    <div className="font-medium">{getSeasonLabel(season)}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground">Durée</div>
                    <div className="font-medium">{nights} nuits</div>
                  </div>
                </div>
              </div>

              {isNPlus1 && (
                <div className="p-4 rounded-lg bg-ocean-light border border-ocean/20">
                  <div className="flex items-center gap-2 font-medium text-ocean mb-2">
                    <Calendar className="w-4 h-4" />
                    Pré-réservation N+1
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Votre réservation sera en statut <strong>OPTION</strong> jusqu&apos;à 
                    J-90 avant l&apos;arrivée, puis passera automatiquement en statut <strong>FERME</strong>.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Commission Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                Repartition de la commission
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      Notre commission est 100% transparente et finance des actions concretes pour la Bretagne.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Visual Pie Chart */}
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-40 h-40">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    {commissionParts.reduce(
                      (acc, part, i) => {
                        const pctOfTotal = (part.pct / config.commission.totalPct) * 100
                        const dashArray = `${pctOfTotal} ${100 - pctOfTotal}`
                        const dashOffset = -acc.offset
                        const colorClass = part.color.replace('bg-', '')
                        
                        acc.elements.push(
                          <circle
                            key={i}
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke={`var(--${colorClass})`}
                            strokeWidth="20"
                            strokeDasharray={dashArray}
                            strokeDashoffset={dashOffset}
                            className="transition-all duration-500"
                          />
                        )
                        acc.offset += pctOfTotal
                        return acc
                      },
                      { elements: [] as JSX.Element[], offset: 0 }
                    ).elements}
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <div className="text-2xl font-bold">
                      {formatPercentage(config.commission.totalPct)}
                    </div>
                    <div className="text-xs text-muted-foreground">Commission</div>
                  </div>
                </div>
              </div>

              {/* Breakdown List */}
              <div className="space-y-3">
                {commissionParts.map((part) => (
                  <div key={part.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${part.color}`} />
                      <div className="flex items-center gap-2">
                        <part.icon className="w-4 h-4 text-muted-foreground" />
                        <span>{part.label}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(part.amount)}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatPercentage(part.pct)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              {/* Points Generated */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-bretagne-light text-center">
                  <div className="text-sm text-muted-foreground">Points logement</div>
                  <div className="font-semibold text-bretagne">
                    +{priceCalculation.housingPointsGenerated.toFixed(1)} pts
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-coral-light text-center">
                  <div className="text-sm text-muted-foreground">Points services</div>
                  <div className="font-semibold text-coral">
                    +{priceCalculation.servicePointsGenerated.toFixed(1)} pts
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Paiement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="mb-2 block">Numero de carte</Label>
                <Input placeholder="1234 5678 9012 3456" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2 block">Date d&apos;expiration</Label>
                  <Input placeholder="MM/AA" />
                </div>
                <div>
                  <Label className="mb-2 block">CVC</Label>
                  <Input placeholder="123" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Check className="w-3 h-3" />
                Paiement securise via Stripe (placeholder)
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-2">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg">Recapitulatif</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {formatCurrency(priceCalculation.pricePerNight)} x {nights} nuits
                  </span>
                  <span>{formatCurrency(priceCalculation.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Commission ({formatPercentage(config.commission.totalPct)})
                  </span>
                  <span>{formatCurrency(priceCalculation.commissionTotal)}</span>
                </div>
                <div className="text-xs text-muted-foreground pl-4 space-y-1">
                  <div className="flex justify-between">
                    <span>Plateforme ({formatPercentage(config.commission.platformPct)})</span>
                    <span>{formatCurrency(priceCalculation.commissionPlatform)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Logement ({formatPercentage(config.commission.housingPct)})</span>
                    <span>{formatCurrency(priceCalculation.commissionHousing)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Services ({formatPercentage(config.commission.servicesPct)})</span>
                    <span>{formatCurrency(priceCalculation.commissionServices)}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{formatCurrency(priceCalculation.totalPrice)}</span>
              </div>

              {isNPlus1 && (
                <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-sm">
                  <div className="font-medium text-yellow-800 mb-1">Statut: OPTION</div>
                  <p className="text-yellow-700 text-xs">
                    Passera en FERME a J-90
                  </p>
                </div>
              )}

              <Button 
                className="w-full bg-coral hover:bg-coral/90 text-coral-foreground" 
                size="lg"
                onClick={handlePayment}
              >
                Confirmer et payer
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                En confirmant, vous acceptez les conditions generales de vente.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="container py-16 text-center">Chargement...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}
