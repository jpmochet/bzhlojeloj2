"use client"

export const dynamic = 'force-dynamic'

import { useState } from "react"
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Home, Wallet, Settings, PlusCircle, Star, Calendar, TrendingUp, Wrench, CheckCircle, Clock, AlertCircle, Users } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { listings } from "@/lib/data/listings"
import { serviceOrders, services, serviceCategories } from "@/lib/data/services"
import { defaultConfig } from "@/lib/data/config"
import { calculateSeasonPrice, getSeasonForDate } from "@/lib/engines/season-price-calculator"
import { calculateCommission } from "@/lib/engines/commission-calculator"
import { calculateServiceCost, getServiceOrderStatusColor, getServiceOrderStatusLabel } from '@/lib/engines/services-engine'
import { ServiceOrderDialog } from "@/components/service-order-dialog"

// Mock owner data
const ownerListings = [
  {
    id: 'l2',
    title: 'Appartement T2 proche plage',
    description: 'Bel appartement lumineux à 200m de la Grande Plage de Dinard.',
    location: 'Dinard, Centre',
    city: 'Dinard',
    propertyType: 'T2',
    propertyKind: 'appartement',
    seaProximity: 'proche_mer',
    baseLowSeasonPrice: 85,
    images: ['/images/listings/t2-dinard-1.jpg'],
    amenities: ['WiFi', 'Parking', 'Balcon', 'Cuisine équipée'],
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 4,
    ownerId: 'o1',
    annualEligibilityStatus: 'SEASONAL_ONLY',
    requiredHousingPoints: 0,
    allocatedHousingPoints: 0,
    isActive: true,
    createdAt: '2024-02-10',
    displayStatus: 'En cours de validation',
  },
  {
    id: 'l1',
    title: 'Studio cosy face à la mer',
    description: 'Charmant studio avec vue imprenable sur la baie de Saint-Malo.',
    location: 'Saint-Malo, Intra-muros',
    city: 'Saint-Malo',
    propertyType: 'T1',
    propertyKind: 'appartement',
    seaProximity: 'vue_mer',
    baseLowSeasonPrice: 65,
    images: ['/images/listings/studio-saintmalo-1.jpg'],
    amenities: ['WiFi', 'Cuisine équipée', 'Lave-linge', 'Vue mer'],
    bedrooms: 0,
    bathrooms: 1,
    maxGuests: 2,
    ownerId: 'o1',
    annualEligibilityStatus: 'SEASONAL_ONLY',
    requiredHousingPoints: 0,
    allocatedHousingPoints: 0,
    isActive: true,
    createdAt: '2024-01-15',
    displayStatus: 'Location saisonnière',
  },
  {
    id: 'l3',
    title: 'Maison de pêcheur rénovée',
    description: 'Maison rénovée au cœur de Cancale.',
    location: 'Cancale, Port',
    city: 'Cancale',
    propertyType: 'T3',
    propertyKind: 'maison',
    seaProximity: 'proche_mer',
    baseLowSeasonPrice: 120,
    images: ['/images/listings/maison-cancale-1.jpg'],
    amenities: ['WiFi', 'Jardin', 'Barbecue', 'Parking', 'Terrasse'],
    bedrooms: 2,
    bathrooms: 1,
    maxGuests: 5,
    ownerId: 'o1',
    annualEligibilityStatus: 'ELIGIBLE_ANNUAL',
    requiredHousingPoints: 450,
    allocatedHousingPoints: 200,
    isActive: true,
    createdAt: '2024-01-20',
    displayStatus: 'Éligible à l’année',
  },
  {
    id: 'l8',
    title: 'Maison traditionnelle Quimper',
    description: 'Maison bretonne avec jardin fleuri.',
    location: 'Quimper, Centre historique',
    city: 'Quimper',
    propertyType: 'T3',
    propertyKind: 'maison',
    seaProximity: 'standard',
    baseLowSeasonPrice: 100,
    images: ['/images/listings/maison-quimper-1.jpg'],
    amenities: ['WiFi', 'Jardin', 'Parking', 'Terrasse'],
    bedrooms: 2,
    bathrooms: 1,
    maxGuests: 5,
    ownerId: 'o1',
    annualEligibilityStatus: 'ANNUAL_PREBOOKED',
    requiredHousingPoints: 380,
    allocatedHousingPoints: 380,
    isActive: true,
    createdAt: '2024-01-10',
    displayStatus: 'Réservé à l’année',
    reservedFrom: 'juillet 2026',
  },
] as Array<typeof listings[number] & { displayStatus: string; reservedFrom?: string }>
const ownerServicePoints = 485
const ownerServiceOrders = serviceOrders.filter(o => o.ownerId === "owner_1")

const statusColors = {
  requested: "bg-yellow-100 text-yellow-800",
  scheduled: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  validated: "bg-emerald-100 text-emerald-800"
}

const statusLabels = {
  requested: "Demande",
  scheduled: "Planifie",
  completed: "Realise",
  validated: "Valide"
}

export default function OwnerPage() {
  const [activeTab, setActiveTab] = useState("logements")
  const [showAddListing, setShowAddListing] = useState(false)
  const [showServiceDialog, setShowServiceDialog] = useState(false)
  const [ownerServicePointsBalance, setOwnerServicePointsBalance] = useState(ownerServicePoints)
  const [serviceOrdersList, setServiceOrdersList] = useState(ownerServiceOrders)
  const [showCandidatures, setShowCandidatures] = useState<string | null>(null)
  const [acceptedCandidatures, setAcceptedCandidatures] = useState<Record<string, string>>({})
  const [newListing, setNewListing] = useState({
    title: "",
    type: "T2" as "T1" | "T2" | "T3" | "T4",
    propertyType: "appartement" as "appartement" | "maison",
    seaProximity: "standard" as "standard" | "proche_mer" | "vue_mer",
    baseLowPrice: 80,
    bedrooms: 1,
    landArea: 0,
    terraceArea: 0,
  })

  // Calculate owner stats
  const totalBookings = 12
  const totalRevenue = 8450
  const avgOccupancy = 68
  const totalPointsEarned = 845

  // Simulate revenue calculation
  const simulateRevenue = (baseLowPrice: number) => {
    const config = defaultConfig
    const occupation = config.expectedOccupation.T2
    const lowNights = occupation.low
    const midNights = occupation.mid
    const highNights = occupation.high

    const lowPrice = baseLowPrice
    const midPrice = baseLowPrice * config.seasons.moyenne.multiplier
    const highPrice = baseLowPrice * config.seasons.haute.multiplier

    const grossRevenue = (lowNights * lowPrice) + (midNights * midPrice) + (highNights * highPrice)
    const commission = calculateCommission(grossRevenue, config)

    return {
      grossRevenue,
      netRevenue: grossRevenue - commission.total,
      housingPoints: Math.round(commission.housing / config.eurPerHousingPoint),
      servicePoints: Math.round(commission.services / config.eurPerServicePoint),
    }
  }

  const revenueSimulation = simulateRevenue(newListing.baseLowPrice)

  const handleServiceOrder = (listingId: string, serviceId: string, scheduledDate: string, notes: string, cost: number, flexibilityDays: number = 0) => {
    const newOrder = {
      id: `so${serviceOrdersList.length + 1}`,
      serviceId,
      ownerId: "owner_1",
      listingId,
      status: "DEMANDE" as const,
      pointsCost: cost,
      requestedAt: new Date().toISOString().split('T')[0],
      scheduledAt: scheduledDate,
      notes,
      desiredDate: scheduledDate,
      flexibilityDays,
    }

    setServiceOrdersList([...serviceOrdersList, newOrder])
    setOwnerServicePointsBalance(ownerServicePointsBalance - cost)
  }

  const getCandidaturesForService = (serviceOrderId: string) => {
    // Mock candidatures - in real app these would come from prestataire application data
    const mockCandidatures = [
      { id: 'cand1', prestataireId: 'sp1', prestataireName: 'Pierre Leblanc', proposedDates: ['2026-07-22', '2026-07-23'], comment: 'Je peux faire entre le 22 et 23 juillet' },
      { id: 'cand2', prestataireId: 'sp2', prestataireName: 'Marie Dupont', proposedDates: ['2026-07-25'], comment: 'Disponible le 25 juillet' },
    ]
    return mockCandidatures
  }

  const handleAcceptCandidature = (serviceOrderId: string, candidatureId: string, proposedDate: string) => {
    // Update the service order to PLANIFIE status with the accepted date
    setServiceOrdersList(serviceOrdersList.map(order =>
      order.id === serviceOrderId
        ? { ...order, status: 'PLANIFIE' as const, scheduledAt: proposedDate }
        : order
    ))

    setAcceptedCandidatures({
      ...acceptedCandidatures,
      [serviceOrderId]: candidatureId
    })

    setShowCandidatures(null)
    alert('Candidature acceptée! Le service passe à l\'état planifié.')
  }

  const canCancelService = (scheduledDate: string) => {
    const scheduled = new Date(scheduledDate)
    const today = new Date()
    const daysUntil = Math.ceil((scheduled.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntil >= 7
  }

  const handleCancelService = (serviceOrderId: string) => {
    const order = serviceOrdersList.find(o => o.id === serviceOrderId)
    if (!order?.scheduledAt) return

    if (!canCancelService(order.scheduledAt)) {
      alert('Impossible d\'annuler. L\'annulation est possible jusqu\'à une semaine avant la date prévue.')
      return
    }

    if (confirm('Annuler ce service? Les points seront perdus.')) {
      setServiceOrdersList(serviceOrdersList.filter(o => o.id !== serviceOrderId))
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Espace Propriétaire</h1>
          <p className="text-primary-foreground/80">Gérez vos logements et services</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Home className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Logements</p>
                  <p className="text-2xl font-bold">{ownerListings.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Revenus totaux</p>
                  <p className="text-2xl font-bold">{totalRevenue.toLocaleString()}EUR</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Occupation</p>
                  <p className="text-2xl font-bold">{avgOccupancy}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-coral-light rounded-lg">
                  <Star className="h-5 w-5 text-coral" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Points services</p>
                  <p className="text-2xl font-bold">{ownerServicePoints}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="logements" className="gap-2">
              <Home className="h-4 w-4" />
              Mes logements
            </TabsTrigger>
            <TabsTrigger value="services" className="gap-2">
              <Wrench className="h-4 w-4" />
              Services
            </TabsTrigger>
            <TabsTrigger value="simulation" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Simulation
            </TabsTrigger>
          </TabsList>

          {/* Logements Tab */}
          <TabsContent value="logements" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Tableau de bord</p>
                <h2 className="text-xl font-semibold">Mes logements</h2>
              </div>
              <Button onClick={() => setShowAddListing(!showAddListing)} className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Ajouter un nouveau logement
              </Button>
            </div>

            {showAddListing && (
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle>Nouveau logement</CardTitle>
                  <CardDescription>Remplissez les informations de votre bien</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Titre</Label>
                      <Input 
                        placeholder="Ex: Appartement vue mer Saint-Malo"
                        value={newListing.title}
                        onChange={(e) => setNewListing({...newListing, title: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Typologie</Label>
                      <Select 
                        value={newListing.type} 
                        onValueChange={(v) => setNewListing({...newListing, type: v as typeof newListing.type})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="T1">T1 (Studio)</SelectItem>
                          <SelectItem value="T2">T2 (2 pieces)</SelectItem>
                          <SelectItem value="T3">T3 (3 pieces)</SelectItem>
                          <SelectItem value="T4">T4+ (4+ pieces)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Type de bien</Label>
                      <Select 
                        value={newListing.propertyType} 
                        onValueChange={(v) => setNewListing({...newListing, propertyType: v as typeof newListing.propertyType})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="appartement">Appartement</SelectItem>
                          <SelectItem value="maison">Maison</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Proximite mer</Label>
                      <Select 
                        value={newListing.seaProximity} 
                        onValueChange={(v) => setNewListing({...newListing, seaProximity: v as typeof newListing.seaProximity})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="proche_mer">Proche mer (moins de 500m)</SelectItem>
                          <SelectItem value="vue_mer">Vue mer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Prix base basse saison (EUR/nuit)</Label>
                      <Input 
                        type="number"
                        value={newListing.baseLowPrice}
                        onChange={(e) => setNewListing({...newListing, baseLowPrice: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Nombre de chambres</Label>
                      <Input
                        type="number"
                        min={0}
                        value={newListing.bedrooms}
                        onChange={(e) => setNewListing({...newListing, bedrooms: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Surface du terrain (m²) {newListing.propertyType === 'appartement' && <span className="text-xs text-muted-foreground">(optionnel)</span>}</Label>
                      <Input
                        type="number"
                        min={0}
                        value={newListing.landArea || ''}
                        onChange={(e) => setNewListing({...newListing, landArea: parseInt(e.target.value) || 0})}
                        placeholder={newListing.propertyType === 'maison' ? "Ex: 600 m²" : "Terrasse, balcon, cour..."}
                      />
                      {newListing.propertyType === 'maison' && (
                        <p className="text-xs text-muted-foreground">Cela affecte le coût des services de jardinage</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Surface de terrasse (m²) {newListing.propertyType === 'appartement' && <span className="text-xs text-muted-foreground">(optionnel)</span>}</Label>
                      <Input
                        type="number"
                        min={0}
                        value={newListing.terraceArea || ''}
                        onChange={(e) => setNewListing({...newListing, terraceArea: parseInt(e.target.value) || 0})}
                        placeholder={newListing.propertyType === 'maison' ? "Ex: 50 m²" : "Balcon, petite terrasse..."}
                      />
                      {newListing.propertyType === 'maison' && (
                        <p className="text-xs text-muted-foreground">Affecte le coût du nettoyage terrasse</p>
                      )}
                    </div>
                  </div>

                  {/* Revenue Preview */}
                  <div className="mt-4 p-4 bg-background rounded-lg border">
                    <h4 className="font-medium mb-3">Estimation revenus annuels</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Revenu brut</p>
                        <p className="font-semibold">{revenueSimulation.grossRevenue.toLocaleString()}EUR</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Revenu net</p>
                        <p className="font-semibold text-green-600">{revenueSimulation.netRevenue.toLocaleString()}EUR</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Points logement generes</p>
                        <p className="font-semibold text-primary">{revenueSimulation.housingPoints} pts</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Points services reçus</p>
                        <p className="font-semibold text-coral">{revenueSimulation.servicePoints} pts</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setShowAddListing(false)}>Annuler</Button>
                    <Button>Soumettre</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Existing Listings */}
            <div className="grid md:grid-cols-2 gap-4">
              {ownerListings.map(listing => (
                <Card key={listing.id}>
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center">
                        <Home className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{listing.title}</h3>
                            <p className="text-sm text-muted-foreground">{listing.location}</p>
                            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                              <Badge variant="secondary">{listing.displayStatus}</Badge>
                              {listing.reservedFrom && (
                                <span className="text-muted-foreground">À partir de {listing.reservedFrom}</span>
                              )}
                            </div>
                            {listing.displayStatus === 'Réservé à l’année' && (
                              <p className="text-sm text-muted-foreground mt-2">
                                Revenu moyen de 1500&nbsp;€/mois pour un loyer de 800&nbsp;€/mois versé par le locataire (delta financé par les points logements)
                              </p>
                            )}
                          </div>
                          <Badge variant="outline">{listing.propertyType}</Badge>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
                          {listing.displayStatus !== 'Réservé à l’année' && (
                            <>
                              <span>{listing.baseLowSeasonPrice}EUR/nuit (basse)</span>
                              <span className="text-muted-foreground">|</span>
                            </>
                          )}
                          <span>{listing.maxGuests} voyageurs</span>
                          <span className="text-muted-foreground">|</span>
                          <span>{listing.bedrooms > 0 ? `${listing.bedrooms} chambre${listing.bedrooms > 1 ? 's' : ''}` : 'Studio'}</span>
                          {listing.landArea && (
                            <>
                              <span className="text-muted-foreground">|</span>
                              <span className="text-muted-foreground">{listing.landArea} m² terrain</span>
                            </>
                          )}
                          {listing.terraceArea && (
                            <>
                              <span className="text-muted-foreground">|</span>
                              <span className="text-muted-foreground">{listing.terraceArea} m² terrasse</span>
                            </>
                          )}
                        </div>
                        <div className="mt-3 flex gap-2">
                          <Button asChild size="sm" variant="outline">
                            <Link href={`/proprietaire/${listing.id}/modifier`}>Modifier</Link>
                          </Button>
                          <Button asChild size="sm" variant="outline">
                            <Link href={`/proprietaire/${listing.id}/calendrier`}>Calendrier</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            {/* Wallet */}
            <Card className="bg-gradient-to-br from-coral/10 to-coral/5 border-coral/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-coral/20 rounded-full">
                      <Wallet className="h-6 w-6 text-coral" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Votre solde points services</p>
                      <p className="text-3xl font-bold">{ownerServicePointsBalance} pts</p>
                      <p className="text-sm text-muted-foreground">= {ownerServicePointsBalance * defaultConfig.eurPerServicePoint}EUR de services</p>
                    </div>
                  </div>
                  <Button className="gap-2" onClick={() => setShowServiceDialog(true)}>
                    <PlusCircle className="h-4 w-4" />
                    Commander un service
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Service Catalog */}
            <Card>
              <CardHeader>
                <CardTitle>Catalogue de services</CardTitle>
                <CardDescription>Services disponibles pour vos logements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {services.filter(s => s.isActive).slice(0, 6).map(service => {
                    // Calculate adjusted cost for owner's first listing
                    const listing = ownerListings[0]
                    const adjustedCost = listing
                      ? calculateServiceCost(service, listing, defaultConfig)
                      : service.basePoints

                    return (
                      <div key={service.id} className="p-4 border rounded-lg hover:border-primary/50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{service.name}</h4>
                          <Badge variant="secondary">{adjustedCost} pts</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">{service.categoryId}</span>
                          <Button size="sm" variant="outline" onClick={() => setShowServiceDialog(true)}>Commander</Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Orders Status Tabs */}
            <Tabs defaultValue="all" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all" className="gap-2">
                  <span>Toutes</span>
                  <Badge variant="secondary">{serviceOrdersList.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="en-cours" className="gap-2">
                  <Clock className="h-4 w-4" />
                  <span>En cours</span>
                </TabsTrigger>
                <TabsTrigger value="realisees" className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Réalisées</span>
                </TabsTrigger>
                <TabsTrigger value="validees" className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Validées</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Toutes mes commandes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {serviceOrdersList.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        Aucune commande pour le moment
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Service</TableHead>
                            <TableHead>Logement</TableHead>
                            <TableHead>Date demande</TableHead>
                            <TableHead>Date planification</TableHead>
                            <TableHead>Fenêtre de flexibilité</TableHead>
                            <TableHead>Points</TableHead>
                            <TableHead>Statut</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {serviceOrdersList.map(order => {
                            const service = services.find(s => s.id === order.serviceId)
                            const listing = listings.find(l => l.id === order.listingId)
                            const flexText = order.flexibilityDays && order.flexibilityDays > 0
                              ? `±${order.flexibilityDays}j`
                              : 'Fixe'
                            return (
                              <TableRow key={order.id}>
                                <TableCell className="font-medium">{service?.name}</TableCell>
                                <TableCell>{listing?.title ? `${listing.title.substring(0, 25)}...` : '–'}</TableCell>
                                <TableCell>{new Date(order.requestedAt).toLocaleDateString('fr-FR')}</TableCell>
                                <TableCell>{order.scheduledAt ? new Date(order.scheduledAt).toLocaleDateString('fr-FR') : '–'}</TableCell>
                                <TableCell className="text-sm">{flexText}</TableCell>
                                <TableCell>{order.pointsCost} pts</TableCell>
                                <TableCell>
                                  <Badge className={getServiceOrderStatusColor(order.status)}>
                                    {getServiceOrderStatusLabel(order.status)}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="en-cours" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Services en cours</CardTitle>
                    <CardDescription>Services demandés ou planifiés</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {serviceOrdersList.filter(o => ['DEMANDE', 'PLANIFIE'].includes(o.status)).length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        Aucun service en cours
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {serviceOrdersList.filter(o => ['DEMANDE', 'PLANIFIE'].includes(o.status)).map(order => {
                          const service = services.find(s => s.id === order.serviceId)
                          const listing = listings.find(l => l.id === order.listingId)
                          const getDateRange = () => {
                            if (!order.desiredDate || !order.flexibilityDays || order.flexibilityDays === 0) {
                              return order.desiredDate ? new Date(order.desiredDate).toLocaleDateString('fr-FR') : '–'
                            }
                            const desired = new Date(order.desiredDate)
                            const startDate = new Date(desired.getTime() - order.flexibilityDays * 24 * 60 * 60 * 1000)
                            const endDate = new Date(desired.getTime() + order.flexibilityDays * 24 * 60 * 60 * 1000)
                            return `Du ${startDate.toLocaleDateString('fr-FR')} au ${endDate.toLocaleDateString('fr-FR')}`
                          }
                          return (
                            <Card key={order.id} className="border-blue-200 bg-blue-50">
                              <CardContent className="pt-6">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-sm">{service?.name}</h4>
                                    <p className="text-sm text-muted-foreground mt-1">{listing?.title}</p>
                                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                                      <span>Demandé le: {new Date(order.requestedAt).toLocaleDateString('fr-FR')}</span>
                                      <span>Date souhaitée: {order.desiredDate ? new Date(order.desiredDate).toLocaleDateString('fr-FR') : '–'}</span>
                                    </div>
                                    <div className="flex items-center gap-4 mt-2 text-xs">
                                      <span className="text-muted-foreground">Flexibilité: <span className="font-medium text-foreground">{order.flexibilityDays && order.flexibilityDays > 0 ? `±${order.flexibilityDays} jours` : 'Fixe'}</span></span>
                                      <span className="text-muted-foreground">{getDateRange()}</span>
                                    </div>
                                    {order.status === 'PLANIFIE' && order.scheduledAt && (
                                      <p className="text-xs mt-2 font-medium text-blue-700">Planifié pour: {new Date(order.scheduledAt).toLocaleDateString('fr-FR')}</p>
                                    )}
                                    {order.notes && <p className="text-xs mt-2 text-muted-foreground">{order.notes}</p>}
                                  </div>
                                  <div className="text-right flex flex-col items-end gap-2">
                                    <div>
                                      <div className="text-lg font-bold">{order.pointsCost} pts</div>
                                      <Badge className="mt-2" variant="secondary">
                                        {getServiceOrderStatusLabel(order.status)}
                                      </Badge>
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                      {order.status === 'DEMANDE' && (
                                        <>
                                          <Button size="sm" variant="outline" onClick={() => setShowCandidatures(order.id)} className="gap-1">
                                            <Users className="h-3 w-3" />
                                            Candidatures
                                          </Button>
                                        </>
                                      )}
                                      {order.status === 'PLANIFIE' && (
                                        <Button size="sm" variant="outline" onClick={() => handleCancelService(order.id)} className="gap-1 text-red-600 hover:text-red-700">
                                          Annuler
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="realisees" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Services réalisés</CardTitle>
                    <CardDescription>Services complétés mais non validés</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {serviceOrdersList.filter(o => o.status === 'REALISE').length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        Aucun service réalisé
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {serviceOrdersList.filter(o => o.status === 'REALISE').map(order => {
                          const service = services.find(s => s.id === order.serviceId)
                          const listing = listings.find(l => l.id === order.listingId)
                          return (
                            <Card key={order.id} className="border-green-200 bg-green-50">
                              <CardContent className="pt-6">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-sm">{service?.name}</h4>
                                    <p className="text-sm text-muted-foreground mt-1">{listing?.title}</p>
                                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                                      <span>Demandé le: {new Date(order.requestedAt).toLocaleDateString('fr-FR')}</span>
                                      {order.scheduledAt && <span>Planifié pour: {new Date(order.scheduledAt).toLocaleDateString('fr-FR')}</span>}
                                      {order.completedAt && <span>Réalisé: {new Date(order.completedAt).toLocaleDateString('fr-FR')}</span>}
                                    </div>
                                  </div>
                                  <div className="text-right flex flex-col items-end gap-2">
                                    <div>
                                      <div className="text-lg font-bold">{order.pointsCost} pts</div>
                                      <Badge className="mt-2" variant="secondary">
                                        {getServiceOrderStatusLabel(order.status)}
                                      </Badge>
                                    </div>
                                    <Button
                                      size="sm"
                                      onClick={() => {
                                        setServiceOrdersList(serviceOrdersList.map(o =>
                                          o.id === order.id
                                            ? { ...o, status: 'VALIDE' as const, validatedAt: new Date().toISOString().split('T')[0] }
                                            : o
                                        ))
                                      }}
                                      className="gap-1"
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                      Valider
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="validees" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Services validés</CardTitle>
                    <CardDescription>Services complétés et validés</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {serviceOrdersList.filter(o => o.status === 'VALIDE').length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        Aucun service validé
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {serviceOrdersList.filter(o => o.status === 'VALIDE').map(order => {
                          const service = services.find(s => s.id === order.serviceId)
                          const listing = listings.find(l => l.id === order.listingId)
                          return (
                            <Card key={order.id} className="border-emerald-200 bg-emerald-50">
                              <CardContent className="pt-6">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="font-semibold text-sm">{service?.name}</h4>
                                    <p className="text-sm text-muted-foreground mt-1">{listing?.title}</p>
                                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                                      <span>Demandé le: {new Date(order.requestedAt).toLocaleDateString('fr-FR')}</span>
                                      {order.scheduledAt && <span>Planifié pour: {new Date(order.scheduledAt).toLocaleDateString('fr-FR')}</span>}
                                      {order.validatedAt && <span>Validé: {new Date(order.validatedAt).toLocaleDateString('fr-FR')}</span>}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-lg font-bold text-emerald-700">{order.pointsCost} pts</div>
                                    <Badge className="mt-2" variant="secondary">
                                      {getServiceOrderStatusLabel(order.status)}
                                    </Badge>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Simulation Tab */}
          <TabsContent value="simulation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Simulateur de revenus</CardTitle>
                <CardDescription>Estimez vos revenus et votre impact selon differents scenarios</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Prix base basse saison (EUR/nuit)</Label>
                    <Input 
                      type="number"
                      value={newListing.baseLowPrice}
                      onChange={(e) => setNewListing({...newListing, baseLowPrice: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Typologie</Label>
                    <Select 
                      value={newListing.type} 
                      onValueChange={(v) => setNewListing({...newListing, type: v as typeof newListing.type})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="T1">T1</SelectItem>
                        <SelectItem value="T2">T2</SelectItem>
                        <SelectItem value="T3">T3</SelectItem>
                        <SelectItem value="T4">T4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Type de bien</Label>
                    <Select 
                      value={newListing.propertyType} 
                      onValueChange={(v) => setNewListing({...newListing, propertyType: v as typeof newListing.propertyType})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="appartement">Appartement</SelectItem>
                        <SelectItem value="maison">Maison</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Results */}
                <div className="grid md:grid-cols-2 gap-6 pt-4">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Prix par saison</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                        <span>Basse saison</span>
                        <span className="font-semibold">{newListing.baseLowPrice}EUR/nuit</span>
                      </div>
                      <div className="flex justify-between p-3 bg-yellow-50 rounded-lg">
                        <span>Moyenne saison</span>
                        <span className="font-semibold">{Math.round(newListing.baseLowPrice * defaultConfig.seasons.moyenne.multiplier)}EUR/nuit</span>
                      </div>
                      <div className="flex justify-between p-3 bg-red-50 rounded-lg">
                        <span>Haute saison</span>
                        <span className="font-semibold">{Math.round(newListing.baseLowPrice * defaultConfig.seasons.haute.multiplier)}EUR/nuit</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Revenus annuels estimes</h4>
                    <div className="p-4 border rounded-lg space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Revenu brut</span>
                        <span className="font-semibold">{revenueSimulation.grossRevenue.toLocaleString()}EUR</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Commission (16%)</span>
                        <span>-{Math.round(revenueSimulation.grossRevenue * 0.16).toLocaleString()}EUR</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between">
                        <span className="font-medium">Revenu net</span>
                        <span className="font-bold text-green-600">{revenueSimulation.netRevenue.toLocaleString()}EUR</span>
                      </div>
                    </div>

                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-2">
                      <h5 className="font-medium text-primary">Impact genere</h5>
                      <div className="flex justify-between text-sm">
                        <span>Points logement (pour conversion annuelle)</span>
                        <span className="font-semibold">{revenueSimulation.housingPoints} pts</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Points services (pour vous)</span>
                        <span className="font-semibold">{revenueSimulation.servicePoints} pts</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <ServiceOrderDialog
        open={showServiceDialog}
        onOpenChange={setShowServiceDialog}
        listings={ownerListings}
        servicePoints={ownerServicePointsBalance}
        defaultConfig={defaultConfig}
        services={services}
        serviceCategories={serviceCategories}
        calculateServiceCost={calculateServiceCost}
        onOrderCreate={handleServiceOrder}
      />

      {/* Candidatures Modal */}
      <Dialog open={showCandidatures !== null} onOpenChange={(open) => !open && setShowCandidatures(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Candidatures reçues</DialogTitle>
            <DialogDescription>
              Sélectionnez un prestataire et acceptez une candidature
            </DialogDescription>
          </DialogHeader>
          {showCandidatures && (() => {
            const order = serviceOrdersList.find(o => o.id === showCandidatures)
            const service = order ? services.find(s => s.id === order.serviceId) : null
            const candidatures = showCandidatures ? getCandidaturesForService(showCandidatures) : []

            return (
              <div className="space-y-4">
                {service && (
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-sm font-medium">Service: {service.name}</p>
                    {order && (
                      <>
                        <p className="text-xs text-muted-foreground mt-1">
                          Date souhaitée: {order.desiredDate ? new Date(order.desiredDate).toLocaleDateString('fr-FR') : '–'}
                        </p>
                        {order.flexibilityDays && order.flexibilityDays > 0 && (
                          <p className="text-xs text-muted-foreground">
                            Flexibilité: ±{order.flexibilityDays} jours
                          </p>
                        )}
                      </>
                    )}
                  </div>
                )}

                <div className="space-y-3">
                  {candidatures.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground py-4">Aucune candidature reçue</p>
                  ) : (
                    candidatures.map(candidature => (
                      <Card key={candidature.id} className="border-orange-200 bg-orange-50">
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm">{candidature.prestataireName}</h4>
                              {candidature.proposedDates.length > 0 && (
                                <p className="text-xs text-muted-foreground mt-2">
                                  Dates proposées: {candidature.proposedDates.map(d => new Date(d).toLocaleDateString('fr-FR')).join(', ')}
                                </p>
                              )}
                              {candidature.comment && (
                                <p className="text-xs text-muted-foreground mt-1 italic">
                                  Commentaire: "{candidature.comment}"
                                </p>
                              )}
                            </div>
                            <Button
                              size="sm"
                              onClick={() => {
                                const proposedDate = candidature.proposedDates[0] || order?.desiredDate || new Date().toISOString().split('T')[0]
                                handleAcceptCandidature(showCandidatures, candidature.id, proposedDate)
                              }}
                              className="gap-1 flex-shrink-0"
                            >
                              <CheckCircle className="h-4 w-4" />
                              Accepter
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            )
          })()}
        </DialogContent>
      </Dialog>
    </div>
  )
}
