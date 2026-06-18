"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Calendar, MapPin } from "lucide-react"
import type { Service, Listing, ServiceCategory } from "@/lib/types"
import { isServiceAvailableForListing } from "@/lib/engines/services-engine"

interface ServiceOrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  listings: Listing[]
  servicePoints: number
  defaultConfig: any
  services: Service[]
  serviceCategories: ServiceCategory[]
  calculateServiceCost: (service: Service, listing: Listing, config: any) => number
  onOrderCreate?: (listingId: string, serviceId: string, scheduledDate: string, notes: string, cost: number, flexibilityDays?: number) => void
}

export function ServiceOrderDialog({
  open,
  onOpenChange,
  listings,
  servicePoints,
  defaultConfig,
  services,
  serviceCategories,
  calculateServiceCost,
  onOrderCreate
}: ServiceOrderDialogProps) {
  const [step, setStep] = useState<'select-listing' | 'select-service' | 'details'>('select-listing')
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [scheduledDate, setScheduledDate] = useState("")
  const [notes, setNotes] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [flexibilityDays, setFlexibilityDays] = useState("0")

  const handleClose = () => {
    onOpenChange(false)
    setStep('select-listing')
    setSelectedListing(null)
    setSelectedService(null)
    setScheduledDate("")
    setNotes("")
    setSelectedCategory("all")
    setFlexibilityDays("0")
  }

  const handleSelectListing = (listing: Listing) => {
    setSelectedListing(listing)
    setStep('select-service')
  }

  const handleSelectService = (service: Service) => {
    setSelectedService(service)
    setStep('details')
  }

  const handleBack = () => {
    if (step === 'select-service') {
      setSelectedListing(null)
      setStep('select-listing')
    } else if (step === 'details') {
      setSelectedService(null)
      setStep('select-service')
      setSelectedCategory("all")
    }
  }

  const handleSubmit = () => {
    if (!selectedListing || !selectedService || !scheduledDate) return

    const cost = calculateServiceCost(selectedService, selectedListing, defaultConfig)

    if (cost > servicePoints) {
      alert('Solde insuffisant')
      return
    }

    if (onOrderCreate) {
      const flexDays = parseInt(flexibilityDays) || 0
      onOrderCreate(selectedListing.id, selectedService.id, scheduledDate, notes, cost, flexDays)
    }

    handleClose()
  }

  const filteredServices = selectedCategory !== 'all'
    ? services.filter(s => s.categoryId === selectedCategory && s.isActive && (!selectedListing || isServiceAvailableForListing(s, selectedListing)))
    : services.filter(s => s.isActive && (!selectedListing || isServiceAvailableForListing(s, selectedListing)))

  const serviceCost = selectedService && selectedListing
    ? calculateServiceCost(selectedService, selectedListing, defaultConfig)
    : 0

  const canAfford = serviceCost <= servicePoints

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Commander un service</DialogTitle>
          <DialogDescription>
            {step === 'select-listing' && 'Sélectionnez le logement concerné'}
            {step === 'select-service' && `Services pour ${selectedListing?.title}`}
            {step === 'details' && `Finalisez votre commande`}
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Select Listing */}
        {step === 'select-listing' && (
          <div className="space-y-4">
            <div className="space-y-3">
              {listings.map(listing => (
                <button
                  key={listing.id}
                  onClick={() => handleSelectListing(listing)}
                  className="w-full text-left p-4 border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{listing.title}</h4>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {listing.location}
                        </span>
                        <Badge variant="secondary" className="mt-1">{listing.propertyType}</Badge>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => handleClose()}>Annuler</Button>
            </div>
          </div>
        )}

        {/* Step 2: Select Service */}
        {step === 'select-service' && (
          <div className="space-y-4">
            <div className="space-y-3">
              {/* Category Filter */}
              <div>
                <Label>Catégorie</Label>
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

              {/* Services Grid */}
              <div className="space-y-3">
                {filteredServices.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucun service disponible dans cette catégorie
                  </div>
                ) : (
                  filteredServices.map(service => {
                    const cost = calculateServiceCost(service, selectedListing!, defaultConfig)
                    const category = serviceCategories.find(c => c.id === service.categoryId)
                    
                    return (
                      <button
                        key={service.id}
                        onClick={() => handleSelectService(service)}
                        className="w-full text-left p-4 border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium">{service.name}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                            {category && (
                              <span className="text-xs text-muted-foreground mt-2 inline-block">
                                {category.name}
                              </span>
                            )}
                          </div>
                          <div className="text-right ml-4">
                            <Badge variant="secondary">{cost} pts</Badge>
                          </div>
                        </div>
                      </button>
                    )
                  })
                )}
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleBack}>Retour</Button>
              <Button variant="outline" onClick={() => handleClose()}>Annuler</Button>
            </div>
          </div>
        )}

        {/* Step 3: Details & Confirmation */}
        {step === 'details' && selectedListing && selectedService && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground">Logement</p>
                  <p className="font-medium text-sm mt-1">{selectedListing.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{selectedListing.location}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground">Service</p>
                  <p className="font-medium text-sm mt-1">{selectedService.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{serviceCost} points</p>
                </CardContent>
              </Card>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="scheduled-date">Date souhaitée</Label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="scheduled-date"
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="flexibility-days">Flexibilité (±x jours)</Label>
                <Input
                  id="flexibility-days"
                  type="number"
                  min="0"
                  max="14"
                  value={flexibilityDays}
                  onChange={(e) => setFlexibilityDays(e.target.value)}
                  placeholder="0"
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  {flexibilityDays === "0"
                    ? "Date fixe"
                    : `Entre ${new Date(new Date(scheduledDate).getTime() - parseInt(flexibilityDays) * 24 * 60 * 60 * 1000).toLocaleDateString()} et ${new Date(new Date(scheduledDate).getTime() + parseInt(flexibilityDays) * 24 * 60 * 60 * 1000).toLocaleDateString()}`}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes supplémentaires (optionnel)</Label>
                <textarea
                  id="notes"
                  placeholder="Ajoutez des informations importantes pour le prestataire..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-md border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Cost Summary */}
            <Card className={!canAfford ? "border-red-200 bg-red-50" : "bg-primary/5 border-primary/20"}>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  {!canAfford && <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />}
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Coût du service</span>
                      <span className="font-semibold">{serviceCost} pts</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Solde actuel</span>
                      <span className="font-semibold">{servicePoints} pts</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between items-center">
                      <span className="text-sm font-medium">Solde après</span>
                      <span className={`font-bold ${canAfford ? 'text-green-600' : 'text-red-600'}`}>
                        {servicePoints - serviceCost} pts
                      </span>
                    </div>
                  </div>
                </div>
                {!canAfford && (
                  <p className="text-xs text-red-600 mt-3">
                    Solde insuffisant. Vous avez besoin de {serviceCost - servicePoints} points supplémentaires.
                  </p>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleBack}>Retour</Button>
              <Button variant="outline" onClick={() => handleClose()}>Annuler</Button>
              <Button onClick={handleSubmit} disabled={!scheduledDate || !canAfford}>
                Commander maintenant
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
