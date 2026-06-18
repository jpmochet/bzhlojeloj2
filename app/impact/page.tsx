'use client'

export const dynamic = 'force-dynamic'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Home,
  Wrench,
  TrendingUp,
  Calculator,
  MapPin,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ImpactCounters } from '@/components/impact-counters'
import { HousingPoolProgress, PointsWallet } from '@/components/points-wallet'
import { useConfig } from '@/lib/context/config-context'
import { useImpact } from '@/lib/context/impact-context'
import { listings, getEligibleAnnualListings } from '@/lib/data/listings'
import { serviceOrders, services, serviceCategories } from '@/lib/data/services'
import { formatCurrency } from '@/lib/engines/commission-calculator'
import { calculatePrice } from '@/lib/engines/commission-calculator'
import {
  getEligibilityStatusLabel,
  getEligibilityStatusColor,
} from '@/lib/engines/housing-pool-engine'
import {
  calculateFundingProgress,
  calculateRemainingPoints,
} from '@/lib/engines/housing-delta-calculator'
import { getServiceOrderStatusLabel, getServiceOrderStatusColor } from '@/lib/engines/services-engine'
import type { Season, PropertyType } from '@/lib/types'

export default function ImpactPage() {
  const { config } = useConfig()
  const { stats, housingPool, servicesPool } = useImpact()

  const eligibleListings = getEligibleAnnualListings()
  const completedServices = serviceOrders.filter((so) => so.status === 'VALIDE')

  // Simulator state
  const [simBasePriceLow, setSimBasePriceLow] = useState(100)
  const [simSeason, setSimSeason] = useState<Season>('haute')
  const [simNights, setSimNights] = useState(7)

  const simulatedImpact = useMemo(() => {
    return calculatePrice(simBasePriceLow, simNights, simSeason, config)
  }, [simBasePriceLow, simNights, simSeason, config])

  // Find next listing to become eligible
  const nextEligibleListing = listings
    .filter((l) => l.annualEligibilityStatus === 'SEASONAL_ONLY')
    .sort((a, b) => a.baseLowSeasonPrice - b.baseLowSeasonPrice)[0]

  // Service stats
  const serviceStats = useMemo(() => {
    const byCategory = serviceCategories.map((cat) => {
      const catServices = services.filter((s) => s.categoryId === cat.id)
      const catOrders = serviceOrders.filter((so) =>
        catServices.some((s) => s.id === so.serviceId)
      )
      const completed = catOrders.filter((so) => so.status === 'VALIDE').length
      return { ...cat, total: catOrders.length, completed }
    })
    return byCategory.filter((c) => c.total > 0)
  }, [])

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Impact dynamique</h1>
        <p className="text-muted-foreground">
          Suivez en temps réel l&apos;impact collectif de nos réservations sur le logement et les services en Bretagne.
        </p>
      </div>

      {/* Global Stats */}
      <div className="mb-8">
        <ImpactCounters />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="housing" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="housing" className="gap-2">
            <Home className="w-4 h-4" />
            Logement à l&apos;année
          </TabsTrigger>
          <TabsTrigger value="services" className="gap-2">
            <Wrench className="w-4 h-4" />
            Services propriétaires
          </TabsTrigger>
        </TabsList>

        {/* Housing Tab */}
        <TabsContent value="housing" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Housing Pool Card */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-bretagne-light flex items-center justify-center">
                    <Home className="w-4 h-4 text-bretagne" />
                  </div>
                  Pool Logement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold text-bretagne">
                  {housingPool.totalPoints.toLocaleString()} pts
                </div>
                <div className="text-sm text-muted-foreground">
                  = {formatCurrency(housingPool.totalEuros)}
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Points gagnes</span>
                    <span className="text-bretagne">+{housingPool.pointsEarned}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Points utilises</span>
                    <span className="text-coral">-{housingPool.pointsSpent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Logements convertis</span>
                    <span className="font-medium">{housingPool.listingsConverted}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Eligible Listings */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Logements éligibles à l&apos;annuel</CardTitle>
                <CardDescription>
                  {eligibleListings.length} logement{eligibleListings.length !== 1 ? 's' : ''} en cours de conversion
                </CardDescription>
              </CardHeader>
              <CardContent>
                {eligibleListings.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Aucun logement éligible pour le moment. Continuez à réserver !
                  </p>
                ) : (
                  <div className="space-y-4">
                    {eligibleListings.map((listing) => (
                      <div
                        key={listing.id}
                        className="flex items-center gap-4 p-4 rounded-lg border"
                      >
                        <div className="w-16 h-16 rounded-lg bg-bretagne-light flex items-center justify-center shrink-0">
                          <Home className="w-6 h-6 text-bretagne/50" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium truncate">{listing.title}</h4>
                            <Badge className={getEligibilityStatusColor(listing.annualEligibilityStatus)}>
                              {getEligibilityStatusLabel(listing.annualEligibilityStatus)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
                            <MapPin className="w-3 h-3" />
                            <span>{listing.city}</span>
                            <span>-</span>
                            <span>{listing.propertyType}</span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>{listing.allocatedHousingPoints} / {listing.requiredHousingPoints} pts</span>
                              <span>{calculateFundingProgress(listing).toFixed(0)}%</span>
                            </div>
                            <Progress value={calculateFundingProgress(listing)} className="h-2" />
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/logements/${listing.id}`}>
                            Voir
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Progress to Next Eligible */}
          {nextEligibleListing && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Prochain logement éligible</CardTitle>
                <CardDescription>
                  Progression vers le prochain logement à convertir en location annuelle
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{nextEligibleListing.title}</span>
                      <Badge variant="outline">{nextEligibleListing.propertyType}</Badge>
                    </div>
                    <HousingPoolProgress
                      current={housingPool.totalPoints}
                      target={500} // Example target for next conversion
                      label="Pool actuel vers prochain seuil"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Simulator */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Simulateur d&apos;impact
              </CardTitle>
              <CardDescription>
                Calculez l&apos;impact de votre future réservation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <Label className="mb-2 block">Prix base (basse saison)</Label>
                  <Input
                    type="number"
                    value={simBasePriceLow}
                    onChange={(e) => setSimBasePriceLow(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Saison</Label>
                  <Select value={simSeason} onValueChange={(v: Season) => setSimSeason(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basse">Basse</SelectItem>
                      <SelectItem value="moyenne">Moyenne</SelectItem>
                      <SelectItem value="haute">Haute</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-2 block">Nuits</Label>
                  <Input
                    type="number"
                    value={simNights}
                    onChange={(e) => setSimNights(parseInt(e.target.value) || 1)}
                    min={1}
                  />
                </div>
                <div className="flex items-end">
                  <div className="w-full p-3 rounded-lg bg-muted text-center">
                    <div className="text-sm text-muted-foreground">Total</div>
                    <div className="font-semibold">{formatCurrency(simulatedImpact.totalPrice)}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-ocean-light text-center">
                  <div className="text-sm text-muted-foreground mb-1">Commission totale</div>
                  <div className="font-semibold text-ocean">
                    {formatCurrency(simulatedImpact.commissionTotal)}
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-bretagne-light text-center">
                  <div className="text-sm text-muted-foreground mb-1">Vers logement</div>
                  <div className="font-semibold text-bretagne">
                    {formatCurrency(simulatedImpact.commissionHousing)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    +{simulatedImpact.housingPointsGenerated.toFixed(1)} pts
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-coral-light text-center">
                  <div className="text-sm text-muted-foreground mb-1">Vers services</div>
                  <div className="font-semibold text-coral">
                    {formatCurrency(simulatedImpact.commissionServices)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    +{simulatedImpact.servicePointsGenerated.toFixed(1)} pts
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-muted text-center">
                  <div className="text-sm text-muted-foreground mb-1">Plateforme</div>
                  <div className="font-semibold">
                    {formatCurrency(simulatedImpact.commissionPlatform)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Services Pool Card */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-coral-light flex items-center justify-center">
                    <Wrench className="w-4 h-4 text-coral" />
                  </div>
                  Pool Services
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold text-coral">
                  {servicesPool.totalPoints.toLocaleString()} pts
                </div>
                <div className="text-sm text-muted-foreground">
                  = {formatCurrency(servicesPool.totalEuros)}
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Services realises</span>
                    <span className="font-medium">{servicesPool.servicesCompleted}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services by Category */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Services par categorie</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {serviceStats.map((cat) => (
                    <div key={cat.id} className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">{cat.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {cat.completed} / {cat.total}
                          </span>
                        </div>
                        <Progress
                          value={cat.total > 0 ? (cat.completed / cat.total) * 100 : 0}
                          className="h-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Completed Services */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Services recemment valides</CardTitle>
            </CardHeader>
            <CardContent>
              {completedServices.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Aucun service valide pour le moment.
                </p>
              ) : (
                <div className="space-y-3">
                  {completedServices.slice(0, 5).map((order) => {
                    const service = services.find((s) => s.id === order.serviceId)
                    const listing = listings.find((l) => l.id === order.listingId)
                    return (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-3 rounded-lg border"
                      >
                        <div>
                          <div className="font-medium">{service?.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {listing?.title}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getServiceOrderStatusColor(order.status)}>
                            {getServiceOrderStatusLabel(order.status)}
                          </Badge>
                          <div className="text-sm text-muted-foreground mt-1">
                            {order.pointsCost} pts
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
