"use client"

import { useState } from "react"
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Briefcase, MapPin, Calendar, Clock, CheckCircle, AlertCircle, Home } from "lucide-react"
import { listings } from "@/lib/data/listings"
import { services, serviceCategories } from "@/lib/data/services"
import { neighboringCities } from "@/lib/data/providers"
import type { ServiceOrder } from "@/lib/types"

// Mock service requests for demo
const mockServiceRequests: (ServiceOrder & { listingCity: string; providerCity: string })[] = [
  {
    id: 'sr1',
    serviceId: 's1',
    ownerId: 'o1',
    listingId: 'l1',
    status: 'DEMANDE',
    pointsCost: 38,
    requestedAt: '2026-07-15',
    scheduledAt: '2026-07-20',
    listingCity: 'Saint-Malo',
    providerCity: 'Dinard',
  },
  {
    id: 'sr2',
    serviceId: 's9',
    ownerId: 'o1',
    listingId: 'l3',
    status: 'DEMANDE',
    pointsCost: 110,
    requestedAt: '2026-07-16',
    scheduledAt: '2026-07-25',
    listingCity: 'Cancale',
    providerCity: 'Saint-Malo',
  },
  {
    id: 'sr3',
    serviceId: 's12',
    ownerId: 'o2',
    listingId: 'l2',
    status: 'DEMANDE',
    pointsCost: 85,
    requestedAt: '2026-07-17',
    scheduledAt: '2026-07-22',
    listingCity: 'Dinard',
    providerCity: 'Saint-Malo',
  },
  {
    id: 'sr4',
    serviceId: 's5',
    ownerId: 'o1',
    listingId: 'l1',
    status: 'DEMANDE',
    pointsCost: 25,
    requestedAt: '2026-07-18',
    scheduledAt: '2026-07-28',
    listingCity: 'Saint-Malo',
    providerCity: 'Dinard',
  },
  {
    id: 'sr5',
    serviceId: 's3',
    ownerId: 'o3',
    listingId: 'l8',
    status: 'DEMANDE',
    pointsCost: 35,
    requestedAt: '2026-07-19',
    scheduledAt: '2026-07-29',
    listingCity: 'Quimper',
    providerCity: 'Concarneau',
  },
]

export default function AvailableServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedCity, setSelectedCity] = useState("")
  const [appliedServices, setAppliedServices] = useState<string[]>([])

  // Get unique cities from mock data
  const availableCities = Array.from(new Set(mockServiceRequests.map(r => r.listingCity)))

  // Filter services based on category and city
  const filteredRequests = mockServiceRequests.filter(request => {
    const categoryMatch = selectedCategory === "all" || 
      services.find(s => s.id === request.serviceId)?.categoryId === selectedCategory
    
    const cityMatch = !selectedCity || request.listingCity === selectedCity
    
    return categoryMatch && cityMatch && request.status === 'DEMANDE'
  })

  const handleApply = (requestId: string) => {
    if (!appliedServices.includes(requestId)) {
      setAppliedServices([...appliedServices, requestId])
      alert("Candidature envoyée avec succès!")
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Services Disponibles</h1>
          <p className="text-primary-foreground/80">Consultez les services en attente de candidatures</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Catégorie de service</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les catégories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    {serviceCategories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Ville</label>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les villes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Toutes les villes</SelectItem>
                    {availableCities.map(city => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services List */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground mb-2">Aucun service disponible</p>
                <p className="text-sm text-muted-foreground">Essayez de modifier vos filtres ou consultez ultérieurement</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Stats */}
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-5 border-blue-200">
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">Services en attente</p>
                    <p className="text-3xl font-bold text-blue-600">{filteredRequests.length}</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-50 to-green-5 border-green-200">
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">Mes candidatures</p>
                    <p className="text-3xl font-bold text-green-600">{appliedServices.length}</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-50 to-purple-5 border-purple-200">
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">Taux réussite</p>
                    <p className="text-3xl font-bold text-purple-600">
                      {filteredRequests.length > 0 ? Math.round((appliedServices.length / filteredRequests.length) * 100) : 0}%
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Service Cards */}
              {filteredRequests.map(request => {
                const service = services.find(s => s.id === request.serviceId)
                const category = serviceCategories.find(c => c.id === service?.categoryId)
                const listing = listings.find(l => l.id === request.listingId)
                const hasApplied = appliedServices.includes(request.id)

                return (
                  <Card key={request.id} className={`hover:border-primary/50 transition-colors ${hasApplied ? 'border-green-200 bg-green-50' : ''}`}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          {/* Service Info */}
                          <div className="mb-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-lg font-semibold">{service?.name}</h3>
                                <p className="text-sm text-muted-foreground">{service?.description}</p>
                              </div>
                              <div className="text-right">
                                <Badge variant="secondary" className="text-base font-semibold">
                                  {request.pointsCost} pts
                                </Badge>
                              </div>
                            </div>
                            {category && (
                              <Badge variant="outline" className="mb-3">
                                {category.name}
                              </Badge>
                            )}
                          </div>

                          {/* Location & Details */}
                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Localisation</span>
                              </div>
                              <p className="font-medium">{request.listingCity}</p>
                              {listing && (
                                <p className="text-sm text-muted-foreground">{listing.location}</p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Date souhaitée</span>
                              </div>
                              <p className="font-medium">
                                {request.scheduledAt ? new Date(request.scheduledAt).toLocaleDateString('fr-FR') : '–'}
                              </p>
                            </div>
                          </div>

                          {/* Property Type */}
                          {listing && (
                            <div className="flex items-center gap-2 text-sm">
                              <Home className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">{listing.propertyType} • {listing.propertyKind}</span>
                            </div>
                          )}
                        </div>

                        {/* Action Button */}
                        <div className="flex-shrink-0">
                          <Button
                            onClick={() => handleApply(request.id)}
                            disabled={hasApplied}
                            className={hasApplied ? 'bg-green-600 hover:bg-green-600' : ''}
                          >
                            {hasApplied ? (
                              <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Candidature envoyée
                              </>
                            ) : (
                              <>
                                <Clock className="h-4 w-4 mr-2" />
                                Candidater
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Info Box */}
        <Card className="mt-8 bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <p className="text-sm text-foreground">
              💡 <strong>Conseil:</strong> Les services sont disponibles dans votre ville de base et les villes voisines. Plus vous candidatez rapidement, plus vous avez de chances d'être sélectionné. Les propriétaires sélectionnent les prestataires en fonction de leur profil et notation.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
