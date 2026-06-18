"use client"

export const dynamic = 'force-dynamic'

import { useState } from "react"
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle, User, MapPin, Briefcase, Star, Clock, Home, Settings, CalendarCheck, AlertCircle, PlusCircle, Edit2, Trash2 } from "lucide-react"
import { cities } from "@/lib/data/cities"
import { serviceCategories, services } from "@/lib/data/services"
import { listings } from "@/lib/data/listings"
import { neighboringCities, ServiceProvider } from "@/lib/data/providers"
import type { ServiceOrder } from "@/lib/types"

// Mock data - prestataires enregistrés
const mockRegisteredProviders: ServiceProvider[] = [
  {
    id: 'sp1',
    name: 'Pierre Leblanc',
    email: 'pierre.leblanc@email.com',
    phone: '+33612345678',
    siret: '12345678901234',
    businessName: 'Jardins Bretons SARL',
    city: 'Saint-Malo',
    description: 'Expert en jardinage et entretien d\'espaces verts depuis 10 ans',
    specialties: ['cat1'],
    isActive: true,
    createdAt: '2024-01-15',
    rating: 4.8,
    completedServices: 52,
  },
  {
    id: 'sp2',
    name: 'Marie Dupont',
    email: 'marie.dupont@email.com',
    phone: '+33698765432',
    siret: '98765432109876',
    businessName: 'Nettoyage Pro Bretagne',
    city: 'Dinard',
    description: 'Service de nettoyage résidentiel et locations saisonnières',
    specialties: ['cat3'],
    isActive: true,
    createdAt: '2024-02-01',
    rating: 4.9,
    completedServices: 87,
  },
  {
    id: 'sp3',
    name: 'Jean Martin',
    email: 'jean.martin@email.com',
    phone: '+33756432109',
    siret: '56789012345678',
    businessName: 'Maintenance & Réparations',
    city: 'Cancale',
    description: 'Plomberie, électricité et petites réparations',
    specialties: ['cat2'],
    isActive: true,
    createdAt: '2024-01-20',
    rating: 4.7,
    completedServices: 43,
  },
]

// Mock pending services - demandes d'intervention
const mockPendingServices: (ServiceOrder & { listingTitle: string; listingCity: string })[] = [
  {
    id: 'so4',
    serviceId: 's5',
    ownerId: 'o1',
    listingId: 'l1',
    status: 'DEMANDE',
    pointsCost: 25,
    requestedAt: '2026-07-18',
    scheduledAt: '2026-07-25',
    desiredDate: '2026-07-25',
    flexibilityDays: 3,
    listingTitle: 'Studio cosy face à la mer',
    listingCity: 'Saint-Malo',
  },
  {
    id: 'so5',
    serviceId: 's9',
    ownerId: 'o1',
    listingId: 'l3',
    status: 'DEMANDE',
    pointsCost: 110,
    requestedAt: '2026-07-15',
    scheduledAt: '2026-07-22',
    desiredDate: '2026-07-22',
    flexibilityDays: 2,
    listingTitle: 'Maison de pêcheur rénovée',
    listingCity: 'Cancale',
  },
  {
    id: 'so6',
    serviceId: 's11',
    ownerId: 'o3',
    listingId: 'l8',
    status: 'DEMANDE',
    pointsCost: 40,
    requestedAt: '2026-07-16',
    scheduledAt: '2026-07-28',
    desiredDate: '2026-07-28',
    flexibilityDays: 5,
    listingTitle: 'Maison traditionnelle Quimper',
    listingCity: 'Quimper',
  },
]

// Mock ongoing services (validated/scheduled)
const mockOngoingServices: (ServiceOrder & { listingTitle: string; listingCity: string })[] = [
  {
    id: 'so10',
    serviceId: 's5',
    ownerId: 'o1',
    listingId: 'l1',
    status: 'PLANIFIE',
    pointsCost: 25,
    requestedAt: '2026-08-01',
    scheduledAt: '2026-08-10',
    desiredDate: '2026-08-10',
    flexibilityDays: 2,
    listingTitle: 'Studio cosy face à la mer',
    listingCity: 'Saint-Malo',
  },
  {
    id: 'so11',
    serviceId: 's9',
    ownerId: 'o1',
    listingId: 'l3',
    status: 'PLANIFIE',
    pointsCost: 110,
    requestedAt: '2026-08-05',
    scheduledAt: '2026-08-15',
    desiredDate: '2026-08-15',
    flexibilityDays: 3,
    listingTitle: 'Maison de pêcheur rénovée',
    listingCity: 'Cancale',
  },
]

// Mock completed services
const mockCompletedServices: (ServiceOrder & { listingTitle: string; displayStatus: 'validé' | 'en_attente' | 'réalisé' })[] = [
  {
    id: 'so1',
    serviceId: 's1',
    ownerId: 'o1',
    listingId: 'l1',
    status: 'VALIDE',
    pointsCost: 38,
    requestedAt: '2026-06-15',
    scheduledAt: '2026-06-20',
    completedAt: '2026-06-20',
    validatedAt: '2026-06-21',
    listingTitle: 'Studio cosy face à la mer',
    displayStatus: 'validé',
  },
  {
    id: 'so2',
    serviceId: 's9',
    ownerId: 'o1',
    listingId: 'l3',
    status: 'VALIDE',
    pointsCost: 110,
    requestedAt: '2026-06-10',
    scheduledAt: '2026-06-12',
    completedAt: '2026-06-12',
    validatedAt: '2026-06-13',
    listingTitle: 'Maison de pêcheur rénovée',
    displayStatus: 'validé',
  },
  {
    id: 'so3',
    serviceId: 's12',
    ownerId: 'o2',
    listingId: 'l2',
    status: 'VALIDE',
    pointsCost: 85,
    requestedAt: '2026-05-20',
    scheduledAt: '2026-05-25',
    completedAt: '2026-05-25',
    validatedAt: '2026-05-26',
    listingTitle: 'Appartement T2 proche plage',
    displayStatus: 'réalisé',
  },
]

const emptyFormData = {
  name: "",
  email: "",
  phone: "",
  siret: "",
  businessName: "",
  city: "",
  description: "",
  specialties: [] as string[],
}

export default function ProviderPage() {
  const [mode, setMode] = useState<'list' | 'register' | 'profile'>('list')
  const [activeTab, setActiveTab] = useState("profile")
  const [providers, setProviders] = useState<ServiceProvider[]>(mockRegisteredProviders)
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null)
  const [serviceStatuses, setServiceStatuses] = useState<Record<string, 'validé' | 'en_attente' | 'réalisé'>>(
    Object.fromEntries(mockCompletedServices.map(s => [s.id, s.displayStatus]))
  )
  const [appliedServices, setAppliedServices] = useState<string[]>([])
  const [proposedDates, setProposedDates] = useState<Record<string, string[]>>({})
  const [candidacyComments, setCandidacyComments] = useState<Record<string, string>>({})
  const [showDateModal, setShowDateModal] = useState(false)
  const [selectedServiceForDates, setSelectedServiceForDates] = useState<any>(null)
  const [tempProposedDates, setTempProposedDates] = useState<string[]>([])
  const [tempComment, setTempComment] = useState("")
  const [modificationRequests, setModificationRequests] = useState<Record<string, string>>({})
  const [showModificationModal, setShowModificationModal] = useState(false)
  const [selectedServiceForModification, setSelectedServiceForModification] = useState<any>(null)
  const [tempModificationComment, setTempModificationComment] = useState("")
  const [completedServices, setCompletedServices] = useState<Record<string, boolean>>({})

  const [formData, setFormData] = useState(emptyFormData)

  const handleSpecialtyToggle = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(categoryId)
        ? prev.specialties.filter(s => s !== categoryId)
        : [...prev.specialties, categoryId]
    }))
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.siret || !formData.city || formData.specialties.length === 0) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }

    if (!/^\d{14}$/.test(formData.siret)) {
      alert("Le SIRET doit contenir 14 chiffres")
      return
    }

    const newProvider: ServiceProvider = {
      id: `sp${Date.now()}`,
      ...formData,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0],
      rating: 5,
      completedServices: 0,
    }

    setProviders([...providers, newProvider])
    setFormData(emptyFormData)
    setMode('list')
    alert("Prestataire enregistré avec succès!")
  }

  const handleToggleProviderStatus = (id: string, shouldDeactivate: boolean) => {
    const message = shouldDeactivate
      ? "Êtes-vous sûr de vouloir vous désinscrire? Vous pourrez vous réactiver plus tard."
      : "Réactiver ce prestataire?"

    if (confirm(message)) {
      setProviders(providers.map(p =>
        p.id === id ? { ...p, isActive: !shouldDeactivate } : p
      ))
    }
  }

  const handleApplyService = (service: any) => {
    setSelectedServiceForDates(service)
    setTempProposedDates(proposedDates[service.id] || [])
    setTempComment(candidacyComments[service.id] || "")
    setShowDateModal(true)
  }

  const handleConfirmCandidacy = () => {
    if (!selectedServiceForDates) return

    if (!appliedServices.includes(selectedServiceForDates.id)) {
      setAppliedServices([...appliedServices, selectedServiceForDates.id])
    }

    setProposedDates({
      ...proposedDates,
      [selectedServiceForDates.id]: tempProposedDates
    })

    setCandidacyComments({
      ...candidacyComments,
      [selectedServiceForDates.id]: tempComment
    })

    setShowDateModal(false)
    alert("Candidature mise à jour avec succès!")
  }

  const toggleDateSelection = (date: string) => {
    setTempProposedDates(prev =>
      prev.includes(date)
        ? prev.filter(d => d !== date)
        : [...prev, date]
    )
  }

  const handleRequestModification = (service: any) => {
    setSelectedServiceForModification(service)
    setTempModificationComment(modificationRequests[service.id] || "")
    setShowModificationModal(true)
  }

  const handleConfirmModificationRequest = () => {
    if (!selectedServiceForModification || !tempModificationComment.trim()) {
      alert("Veuillez entrer un commentaire de modification")
      return
    }

    setModificationRequests({
      ...modificationRequests,
      [selectedServiceForModification.id]: tempModificationComment
    })

    setShowModificationModal(false)
    alert("Demande de modification envoyée au propriétaire!")
  }

  const handleDeleteCandidacy = (serviceId: string) => {
    if (confirm("Confirmer la suppression de cette candidature?")) {
      setAppliedServices(appliedServices.filter(id => id !== serviceId))
      setProposedDates({
        ...proposedDates,
        [serviceId]: []
      })
      setCandidacyComments({
        ...candidacyComments,
        [serviceId]: ""
      })
      alert("Candidature supprimée!")
    }
  }

  const getDateRangeArray = (service: any): string[] => {
    if (!service.desiredDate || !service.flexibilityDays || service.flexibilityDays === 0) {
      return service.desiredDate ? [service.desiredDate] : []
    }

    const desired = new Date(service.desiredDate)
    const startDate = new Date(desired.getTime() - service.flexibilityDays * 24 * 60 * 60 * 1000)
    const endDate = new Date(desired.getTime() + service.flexibilityDays * 24 * 60 * 60 * 1000)

    const dates = []
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().split('T')[0])
    }
    return dates
  }

  const getAvailableServices = (provider: ServiceProvider) => {
    if (!provider) return []

    const providerCities = [provider.city, ...(neighboringCities[provider.city] || [])]

    return mockPendingServices.filter(service =>
      service.status === 'DEMANDE' && providerCities.includes(service.listingCity)
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Espace Prestataire</h1>
          <p className="text-primary-foreground/80">Gérez les prestataires de services</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* List View */}
        {mode === 'list' && (
          <div className="space-y-6">
            {/* Header with Add Button */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Gestion</p>
                <h2 className="text-xl font-semibold">Prestataires enregistrés</h2>
              </div>
              <Button className="gap-2" onClick={() => setMode('register')}>
                <PlusCircle className="h-4 w-4" />
                Ajouter une inscription
              </Button>
            </div>

            {/* Providers List */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {providers.map(provider => (
                <Card
                  key={provider.id}
                  className={`hover:border-primary/50 transition-colors cursor-pointer ${!provider.isActive ? 'opacity-50 bg-muted' : ''}`}
                  onClick={() => {
                    setSelectedProvider(provider)
                    setMode('profile')
                  }}
                >
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{provider.name}</h3>
                            {!provider.isActive && (
                              <Badge variant="secondary" className="bg-red-100 text-red-800">Désinscrit</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{provider.businessName}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-semibold">{provider.rating}</span>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{provider.city}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Briefcase className="h-4 w-4" />
                          <span>{provider.completedServices} services</span>
                        </div>
                      </div>

                      {/* Specialties */}
                      <div className="flex flex-wrap gap-1">
                        {provider.specialties.map(spec => {
                          const cat = serviceCategories.find(c => c.id === spec)
                          return (
                            <Badge key={spec} variant="secondary" className="text-xs">
                              {cat?.name}
                            </Badge>
                          )
                        })}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2 border-t">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 gap-1"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedProvider(provider)
                            setMode('profile')
                          }}
                        >
                          <Eye className="h-3 w-3" />
                          Voir
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="gap-1"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleToggleProviderStatus(provider.id, true)
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {providers.length === 0 && (
              <Card>
                <CardContent className="pt-12 pb-12 text-center">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground mb-4">Aucun prestataire enregistré</p>
                  <Button onClick={() => setMode('register')}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Ajouter le premier prestataire
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Registration View */}
        {mode === 'register' && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Ajouter une inscription prestataire</CardTitle>
                <CardDescription>Enregistrez un nouveau prestataire de services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleRegister} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Informations personnelles
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom complet *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="Jean Dupont"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="jean@email.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          placeholder="+33612345678"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">Ville de base *</Label>
                        <Select value={formData.city} onValueChange={(value) => setFormData({...formData, city: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une ville" />
                          </SelectTrigger>
                          <SelectContent>
                            {cities.map(city => (
                              <SelectItem key={city} value={city}>
                                {city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Business Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Informations professionnelles
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="businessName">Raison sociale *</Label>
                        <Input
                          id="businessName"
                          value={formData.businessName}
                          onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                          placeholder="Mon entreprise SARL"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="siret">Code SIRET *</Label>
                        <Input
                          id="siret"
                          value={formData.siret}
                          onChange={(e) => setFormData({...formData, siret: e.target.value})}
                          placeholder="12345678901234"
                          maxLength={14}
                        />
                        <p className="text-xs text-muted-foreground">14 chiffres requis</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description du profil</Label>
                      <textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Décrivez votre expérience et vos compétences..."
                        rows={3}
                        className="w-full px-3 py-2 border rounded-md border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm">Spécialités (min. 1) *</h3>
                    <div className="flex flex-wrap gap-2">
                      {serviceCategories.map(category => (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => handleSpecialtyToggle(category.id)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            formData.specialties.includes(category.id)
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground hover:bg-muted/80'
                          }`}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" type="button" onClick={() => setMode('list')}>Annuler</Button>
                    <Button type="submit">Enregistrer le prestataire</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Profile View */}
        {mode === 'profile' && selectedProvider && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={() => setMode('list')} className="gap-2">
                <Clock className="h-4 w-4" />
                Retour à la liste
              </Button>
              <div className="flex gap-2">
                {selectedProvider.isActive ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleToggleProviderStatus(selectedProvider.id, true)
                      setMode('list')
                    }}
                  >
                    Se désinscrire en tant que prestataire
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleToggleProviderStatus(selectedProvider.id, false)
                      setMode('list')
                    }}
                  >
                    Se réactiver en tant que prestataire
                  </Button>
                )}
              </div>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{selectedProvider.name}</CardTitle>
                    <CardDescription>{selectedProvider.businessName}</CardDescription>
                  </div>
                  {selectedProvider.completedServices! > 0 && (
                    <div className="text-right">
                      <div className="flex items-center gap-1 justify-end mb-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{selectedProvider.rating}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{selectedProvider.completedServices} services</p>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Stats */}
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="bg-muted/50">
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground">Services réalisés</p>
                      <p className="text-2xl font-bold">{selectedProvider.completedServices}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50">
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground">Note moyenne</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-2xl font-bold">{selectedProvider.rating}</span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50">
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground">Membre depuis</p>
                      <p className="text-2xl font-bold">{new Date(selectedProvider.createdAt).getFullYear()}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Information Details */}
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedProvider.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Téléphone</p>
                      <p className="font-medium">{selectedProvider.phone || '–'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">SIRET</p>
                      <p className="font-medium font-mono">{selectedProvider.siret}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        Zone d'intervention
                      </p>
                      <p className="font-medium">{selectedProvider.city}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Description</p>
                      <p className="text-sm">{selectedProvider.description}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Spécialités</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedProvider.specialties.map(specialty => {
                          const cat = serviceCategories.find(c => c.id === specialty)
                          return (
                            <Badge key={specialty} variant="secondary">
                              {cat?.name}
                            </Badge>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Services Tabs */}
                <Tabs defaultValue="en-cours">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="en-cours" className="gap-2">
                      <Clock className="h-4 w-4" />
                      Services proposés
                    </TabsTrigger>
                    <TabsTrigger value="candidatures" className="gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Candidatures
                    </TabsTrigger>
                    <TabsTrigger value="en-cours-validees" className="gap-2">
                      <CheckCircle className="h-4 w-4" />
                      En cours
                    </TabsTrigger>
                    <TabsTrigger value="historique" className="gap-2">
                      <CalendarCheck className="h-4 w-4" />
                      Historique
                    </TabsTrigger>
                  </TabsList>

                  {/* Services en cours Tab */}
                  <TabsContent value="en-cours" className="space-y-4 mt-4">
                    {(() => {
                      const availableServices = getAvailableServices(selectedProvider!)
                      return availableServices.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p>Aucune demande de service disponible dans votre zone d'intervention</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {availableServices.map(service => {
                            const serviceInfo = services.find(s => s.id === service.serviceId)
                            const hasApplied = appliedServices.includes(service.id)

                            return (
                              <Card key={service.id} className="border-yellow-200 bg-yellow-50 border hover:border-yellow-300 transition-colors">
                                <CardContent className="pt-6">
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <h4 className="font-semibold">{serviceInfo?.name}</h4>
                                        <Badge className="bg-yellow-100 text-yellow-800">Demande</Badge>
                                      </div>
                                      <p className="text-sm text-muted-foreground mb-3">{service.listingTitle}</p>
                                      <div className="grid md:grid-cols-4 gap-3 text-sm mb-4">
                                        <div>
                                          <p className="text-muted-foreground">Localisation</p>
                                          <p className="font-medium">{service.listingCity}</p>
                                        </div>
                                        <div>
                                          <p className="text-muted-foreground">Date demandée</p>
                                          <p className="font-medium">{new Date(service.requestedAt).toLocaleDateString('fr-FR')}</p>
                                        </div>
                                        <div>
                                          <p className="text-muted-foreground">Fenêtre d'intervention</p>
                                          <p className="font-medium">
                                            {service.desiredDate && service.flexibilityDays && service.flexibilityDays > 0
                                              ? (() => {
                                                  const desired = new Date(service.desiredDate)
                                                  const startDate = new Date(desired.getTime() - service.flexibilityDays * 24 * 60 * 60 * 1000)
                                                  const endDate = new Date(desired.getTime() + service.flexibilityDays * 24 * 60 * 60 * 1000)
                                                  return `${startDate.toLocaleDateString('fr-FR')} à ${endDate.toLocaleDateString('fr-FR')}`
                                                })()
                                              : (service.scheduledAt ? new Date(service.scheduledAt).toLocaleDateString('fr-FR') : '–')
                                            }
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-muted-foreground">Flexibilité</p>
                                          <p className="font-medium">
                                            {service.flexibilityDays && service.flexibilityDays > 0 ? `±${service.flexibilityDays}j` : 'Fixe'}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-3 flex-shrink-0">
                                      <Badge variant="secondary" className="text-base font-semibold whitespace-nowrap">
                                        {service.pointsCost} pts
                                      </Badge>
                                      <Button
                                        size="sm"
                                        onClick={() => handleApplyService(service)}
                                        className={hasApplied ? 'bg-green-600 hover:bg-green-600' : ''}
                                      >
                                        {hasApplied ? (
                                          <>
                                            <CheckCircle className="h-4 w-4 mr-1" />
                                            Candidature envoyée
                                          </>
                                        ) : (
                                          <>
                                            <PlusCircle className="h-4 w-4 mr-1" />
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
                      )
                    })()}
                  </TabsContent>

                  {/* Candidatures Tab */}
                  <TabsContent value="candidatures" className="space-y-4 mt-4">
                    {(() => {
                      const availableServices = getAvailableServices(selectedProvider!)
                      const appliedServicesList = availableServices.filter(s => appliedServices.includes(s.id))

                      return appliedServicesList.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p>Aucune candidature en cours</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {appliedServicesList.map(service => {
                            const serviceInfo = services.find(s => s.id === service.serviceId)
                            const listing = listings.find(l => l.id === service.listingId)

                            const candidateDates = proposedDates[service.id] || []
                            const candidateComment = candidacyComments[service.id] || ""

                            return (
                              <Card key={service.id} className="border-green-200 bg-green-50 border hover:border-green-300 transition-colors">
                                <CardContent className="pt-6">
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <h4 className="font-semibold">{serviceInfo?.name}</h4>
                                        <Badge className="bg-green-100 text-green-800">Candidature envoyée</Badge>
                                      </div>
                                      <p className="text-sm text-muted-foreground mb-3">{service.listingTitle}</p>
                                      <div className="grid md:grid-cols-4 gap-3 text-sm mb-4">
                                        <div>
                                          <p className="text-muted-foreground">Localisation</p>
                                          <p className="font-medium">{service.listingCity}</p>
                                        </div>
                                        <div>
                                          <p className="text-muted-foreground">Date demandée</p>
                                          <p className="font-medium">{new Date(service.requestedAt).toLocaleDateString('fr-FR')}</p>
                                        </div>
                                        <div>
                                          <p className="text-muted-foreground">Fenêtre d'intervention</p>
                                          <p className="font-medium">
                                            {service.desiredDate && service.flexibilityDays && service.flexibilityDays > 0
                                              ? (() => {
                                                  const desired = new Date(service.desiredDate)
                                                  const startDate = new Date(desired.getTime() - service.flexibilityDays * 24 * 60 * 60 * 1000)
                                                  const endDate = new Date(desired.getTime() + service.flexibilityDays * 24 * 60 * 60 * 1000)
                                                  return `${startDate.toLocaleDateString('fr-FR')} à ${endDate.toLocaleDateString('fr-FR')}`
                                                })()
                                              : (service.scheduledAt ? new Date(service.scheduledAt).toLocaleDateString('fr-FR') : '–')
                                            }
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-muted-foreground">Flexibilité</p>
                                          <p className="font-medium">
                                            {service.flexibilityDays && service.flexibilityDays > 0 ? `±${service.flexibilityDays}j` : 'Fixe'}
                                          </p>
                                        </div>
                                      </div>

                                      {candidateDates.length > 0 && (
                                        <div className="mt-4 p-3 bg-white rounded border border-green-200">
                                          <p className="text-xs font-semibold text-muted-foreground mb-2">Dates proposées</p>
                                          <div className="flex flex-wrap gap-2">
                                            {candidateDates.map(date => (
                                              <Badge key={date} variant="outline" className="bg-green-100 border-green-300">
                                                {new Date(date).toLocaleDateString('fr-FR')}
                                              </Badge>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {candidateComment && (
                                        <div className="mt-3 p-3 bg-white rounded border border-green-200">
                                          <p className="text-xs font-semibold text-muted-foreground mb-1">Commentaire</p>
                                          <p className="text-sm text-foreground">{candidateComment}</p>
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex flex-col items-end gap-3 flex-shrink-0">
                                      <Badge variant="secondary" className="text-base font-semibold whitespace-nowrap">
                                        {service.pointsCost} pts
                                      </Badge>
                                      <div className="flex gap-2">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => handleApplyService(service)}
                                          className="gap-1"
                                        >
                                          <Edit2 className="h-3 w-3" />
                                          Modifier
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => handleDeleteCandidacy(service.id)}
                                          className="gap-1"
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            )
                          })}
                        </div>
                      )
                    })()}
                  </TabsContent>

                  {/* Services En Cours Tab (Validés) */}
                  <TabsContent value="en-cours-validees" className="space-y-4 mt-4">
                    {(() => {
                      const ongoingServices = mockOngoingServices

                      return ongoingServices.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p>Aucun service en cours</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {ongoingServices.map(service => {
                            const serviceInfo = services.find(s => s.id === service.serviceId)
                            const modificationRequest = modificationRequests[service.id] || ""

                            return (
                              <Card key={service.id} className="border-blue-200 bg-blue-50 border">
                                <CardContent className="pt-6">
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <h4 className="font-semibold">{serviceInfo?.name}</h4>
                                        <Badge className={completedServices[service.id] ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                                          {completedServices[service.id] ? 'Réalisé' : 'Planifié'}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-muted-foreground mb-3">{service.listingTitle}</p>
                                      <div className="grid md:grid-cols-4 gap-3 text-sm mb-4">
                                        <div>
                                          <p className="text-muted-foreground">Localisation</p>
                                          <p className="font-medium">{service.listingCity}</p>
                                        </div>
                                        <div>
                                          <p className="text-muted-foreground">Date prévue</p>
                                          <p className="font-medium">{service.scheduledAt ? new Date(service.scheduledAt).toLocaleDateString('fr-FR') : '–'}</p>
                                        </div>
                                        <div>
                                          <p className="text-muted-foreground">Fenêtre</p>
                                          <p className="font-medium">
                                            {service.desiredDate && service.flexibilityDays && service.flexibilityDays > 0
                                              ? (() => {
                                                  const desired = new Date(service.desiredDate)
                                                  const startDate = new Date(desired.getTime() - service.flexibilityDays * 24 * 60 * 60 * 1000)
                                                  const endDate = new Date(desired.getTime() + service.flexibilityDays * 24 * 60 * 60 * 1000)
                                                  return `${startDate.toLocaleDateString('fr-FR')} à ${endDate.toLocaleDateString('fr-FR')}`
                                                })()
                                              : '–'
                                            }
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-muted-foreground">Points</p>
                                          <p className="font-medium">{service.pointsCost} pts</p>
                                        </div>
                                      </div>

                                      {modificationRequest && (
                                        <div className="mt-3 p-3 bg-white rounded border border-blue-200">
                                          <p className="text-xs font-semibold text-muted-foreground mb-1">Demande de modification</p>
                                          <p className="text-sm text-foreground">{modificationRequest}</p>
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                      <div className="flex gap-2 flex-col items-end">
                                        {!completedServices[service.id] && (
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleRequestModification(service)}
                                            className="gap-1"
                                          >
                                            <Edit2 className="h-3 w-3" />
                                            Demander modification
                                          </Button>
                                        )}
                                        {!completedServices[service.id] && (
                                          <Button
                                            size="sm"
                                            onClick={() => {
                                              setCompletedServices({
                                                ...completedServices,
                                                [service.id]: true
                                              })
                                              alert('Service marqué comme réalisé. Le propriétaire doit le valider.')
                                            }}
                                            className="gap-1 bg-green-600 hover:bg-green-700"
                                          >
                                            <CheckCircle className="h-4 w-4" />
                                            Service réalisé
                                          </Button>
                                        )}
                                      </div>
                                      {completedServices[service.id] && (
                                        <Badge className="bg-green-200 text-green-800 text-xs">
                                          Marqué réalisé
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            )
                          })}
                        </div>
                      )
                    })()}
                  </TabsContent>

                  {/* Historique Tab */}
                  <TabsContent value="historique" className="space-y-4 mt-4">
                    {mockCompletedServices.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>Aucun service dans l'historique</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Service</TableHead>
                              <TableHead>Logement</TableHead>
                              <TableHead>Date de réalisation</TableHead>
                              <TableHead>Points</TableHead>
                              <TableHead>Statut</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {mockCompletedServices.map(service => {
                              const serviceInfo = services.find(s => s.id === service.serviceId)
                              const currentStatus = serviceStatuses[service.id] || 'en_attente'
                              const statusColors = {
                                'validé': 'bg-green-100 text-green-800',
                                'en_attente': 'bg-yellow-100 text-yellow-800',
                                'réalisé': 'bg-blue-100 text-blue-800'
                              }
                              const statusLabels = {
                                'validé': 'Validé',
                                'en_attente': 'En attente',
                                'réalisé': 'Réalisé'
                              }

                              return (
                                <TableRow key={service.id}>
                                  <TableCell className="font-medium">{serviceInfo?.name}</TableCell>
                                  <TableCell>{service.listingTitle}</TableCell>
                                  <TableCell>{service.completedAt ? new Date(service.completedAt).toLocaleDateString('fr-FR') : '–'}</TableCell>
                                  <TableCell><Badge variant="secondary">{service.pointsCost} pts</Badge></TableCell>
                                  <TableCell>
                                    <Select
                                      value={currentStatus}
                                      onValueChange={(value: any) => setServiceStatuses({...serviceStatuses, [service.id]: value})}
                                    >
                                      <SelectTrigger className="w-40">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="validé">Validé</SelectItem>
                                        <SelectItem value="en_attente">En attente</SelectItem>
                                        <SelectItem value="réalisé">Réalisé</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </TableCell>
                                </TableRow>
                              )
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

                {/* Date Selection Modal */}
                <Dialog open={showDateModal} onOpenChange={setShowDateModal}>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Proposer des dates pour votre candidature</DialogTitle>
                      <DialogDescription>
                        Sélectionnez une ou plusieurs dates dans la fenêtre d'intervention proposée
                      </DialogDescription>
                    </DialogHeader>

                    {selectedServiceForDates && (
                      <div className="space-y-6">
                        {/* Service Info */}
                        <div className="p-4 bg-muted rounded-lg">
                          <p className="text-sm font-semibold mb-2">{services.find(s => s.id === selectedServiceForDates.serviceId)?.name}</p>
                          <p className="text-sm text-muted-foreground">{selectedServiceForDates.listingTitle}</p>
                        </div>

                        {/* Date Selection */}
                        <div className="space-y-3">
                          <Label>Dates disponibles</Label>
                          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                            {getDateRangeArray(selectedServiceForDates).map(date => {
                              const isSelected = tempProposedDates.includes(date)
                              const displayDate = new Date(date)
                              return (
                                <button
                                  key={date}
                                  onClick={() => toggleDateSelection(date)}
                                  className={`p-2 text-sm rounded border-2 transition-colors text-center ${
                                    isSelected
                                      ? 'border-primary bg-primary text-primary-foreground'
                                      : 'border-input bg-background hover:border-primary'
                                  }`}
                                >
                                  <div className="text-xs font-semibold">
                                    {displayDate.toLocaleDateString('fr-FR', { weekday: 'short' })}
                                  </div>
                                  <div className="text-xs">
                                    {displayDate.getDate()}
                                  </div>
                                </button>
                              )
                            })}
                          </div>
                        </div>

                        {/* Comment */}
                        <div className="space-y-3">
                          <Label htmlFor="candidacy-comment">Commentaire (optionnel)</Label>
                          <textarea
                            id="candidacy-comment"
                            placeholder="Ajoutez un commentaire pour le propriétaire..."
                            value={tempComment}
                            onChange={(e) => setTempComment(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border rounded-md border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>

                        {/* Selected Dates Summary */}
                        {tempProposedDates.length > 0 && (
                          <div className="p-3 bg-primary/10 border border-primary/20 rounded">
                            <p className="text-sm font-semibold mb-2">{tempProposedDates.length} date{tempProposedDates.length > 1 ? 's' : ''} sélectionnée{tempProposedDates.length > 1 ? 's' : ''}</p>
                            <div className="flex flex-wrap gap-2">
                              {tempProposedDates.sort().map(date => (
                                <Badge key={date} variant="secondary">
                                  {new Date(date).toLocaleDateString('fr-FR')}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Buttons */}
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" onClick={() => setShowDateModal(false)}>Annuler</Button>
                          <Button onClick={handleConfirmCandidacy} disabled={tempProposedDates.length === 0}>
                            Confirmer la candidature
                          </Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>

                {/* Modification Request Modal */}
                <Dialog open={showModificationModal} onOpenChange={setShowModificationModal}>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Demander une modification</DialogTitle>
                      <DialogDescription>
                        Décrivez les modifications que vous souhaitez apporter à ce service
                      </DialogDescription>
                    </DialogHeader>

                    {selectedServiceForModification && (
                      <div className="space-y-6">
                        {/* Service Info */}
                        <div className="p-4 bg-muted rounded-lg">
                          <p className="text-sm font-semibold mb-2">{services.find(s => s.id === selectedServiceForModification.serviceId)?.name}</p>
                          <p className="text-sm text-muted-foreground">{selectedServiceForModification.listingTitle}</p>
                          <p className="text-sm text-muted-foreground mt-2">Date prévue: {selectedServiceForModification.scheduledAt ? new Date(selectedServiceForModification.scheduledAt).toLocaleDateString('fr-FR') : '–'}</p>
                        </div>

                        {/* Modification Comment */}
                        <div className="space-y-3">
                          <Label htmlFor="modification-comment">Détails de la demande de modification *</Label>
                          <textarea
                            id="modification-comment"
                            placeholder="Ex: Décaler de 2 jours, préférer le matin, autre équipement requis..."
                            value={tempModificationComment}
                            onChange={(e) => setTempModificationComment(e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border rounded-md border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" onClick={() => setShowModificationModal(false)}>Annuler</Button>
                          <Button onClick={handleConfirmModificationRequest} disabled={!tempModificationComment.trim()}>
                            Envoyer la demande
                          </Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

// Helper - Eye icon
function Eye({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  )
}
