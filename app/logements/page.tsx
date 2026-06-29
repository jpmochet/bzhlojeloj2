'use client'
import SearchParamsClient from './SearchParamsClient'
import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ListingCard } from '@/components/listing-card'
import { SearchBar } from '@/components/search-bar'
import { ReservationCalendar } from '@/components/reservation-calendar'
import { listings } from '@/lib/data/listings'
import { getBookingsByListingId } from '@/lib/data/bookings'
import type { PropertyType, PropertyKind, SeaProximity, Season } from '@/lib/types'

const propertyTypes: PropertyType[] = ['T1', 'T2', 'T3', 'T4']
const propertyKinds: PropertyKind[] = ['appartement', 'maison']
const seaProximities: { value: SeaProximity; label: string }[] = [
  { value: 'standard', label: 'Standard' },
  { value: 'proche_mer', label: 'Proche mer' },
  { value: 'vue_mer', label: 'Vue mer' },
]

interface Filters {
  dateRange?: { from?: Date | undefined; to?: Date | undefined }
  priceRange: [number, number]
  propertyTypes: PropertyType[]
  propertyKinds: PropertyKind[]
  seaProximities: SeaProximity[]
  sortBy: 'price-asc' | 'price-desc' | 'newest'
}

const defaultFilters: Filters = {
  dateRange: undefined,
  priceRange: [0, 300],
  propertyTypes: [],
  propertyKinds: [],
  seaProximities: [],
  sortBy: 'newest',
}

export default function LogementsPage() {
  const [filters, setFilters] = useState<Filters>(defaultFilters)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const queryCities = SearchParamsClient

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.propertyTypes.length > 0) count++
    if (filters.propertyKinds.length > 0) count++
    if (filters.seaProximities.length > 0) count++
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 300) count++
    if (filters.dateRange && filters.dateRange.from) count++
    return count
  }, [filters])

  const filteredListings = useMemo(() => {
    let result = listings.filter((listing) => {
      // Property type filter
      if (
        filters.propertyTypes.length > 0 &&
        !filters.propertyTypes.includes(listing.propertyType)
      ) {
        return false
      }

      // Property kind filter
      if (
        filters.propertyKinds.length > 0 &&
        !filters.propertyKinds.includes(listing.propertyKind)
      ) {
        return false
      }

      // Sea proximity filter
      if (
        filters.seaProximities.length > 0 &&
        !filters.seaProximities.includes(listing.seaProximity)
      ) {
        return false
      }

      // Price range filter (using base price for simplicity)
      if (
        listing.baseLowSeasonPrice < filters.priceRange[0] ||
        listing.baseLowSeasonPrice > filters.priceRange[1]
      ) {
        return false
      }

      // City query filter (supports multiple cities via comma-separated param)
      if (queryCities.length > 0) {
        const listingCity = listing.city ? listing.city.toLowerCase() : ''
        if (!queryCities.includes(listingCity)) return false
      }

      // Date range availability filter
      if (filters.dateRange && filters.dateRange.from) {
        const from = filters.dateRange.from
        const to = filters.dateRange.to || filters.dateRange.from
        const bookings = getBookingsByListingId(listing.id)
        const overlaps = bookings.some((b) => {
          const bi = new Date(b.checkIn)
          const bo = new Date(b.checkOut)
          return bi < to && bo > from
        })
        if (overlaps) return false
      }

      return true
    })

    // Sort
    result = [...result].sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc':
          return a.baseLowSeasonPrice - b.baseLowSeasonPrice
        case 'price-desc':
          return b.baseLowSeasonPrice - a.baseLowSeasonPrice
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

    return result
  }, [filters])

  const resetFilters = () => setFilters(defaultFilters)

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Dates */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Dates</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              {filters.dateRange && filters.dateRange.from ? (
                <span>
                  {filters.dateRange.from.toLocaleDateString()} {' - '}
                  {filters.dateRange.to ? filters.dateRange.to.toLocaleDateString() : ''}
                </span>
              ) : (
                <span>Sélectionnez les dates</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4">
            <ReservationCalendar
              checkIn={filters.dateRange?.from || null}
              checkOut={filters.dateRange?.to || null}
              onCheckInChange={(date) =>
                setFilters((f) => ({
                  ...f,
                  dateRange: { from: date, to: f.dateRange?.to }
                }))
              }
              onCheckOutChange={(date) =>
                setFilters((f) => ({
                  ...f,
                  dateRange: { from: f.dateRange?.from, to: date }
                }))
              }
              existingBookings={[]}
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters((f) => ({ ...f, dateRange: undefined }))}
              >
                Effacer
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Price Range */}
      <div>
        <Label className="text-sm font-medium mb-3 block">
          Prix / nuit: {filters.priceRange[0]}EUR - {filters.priceRange[1]}EUR
        </Label>
        <Slider
          value={filters.priceRange}
          onValueChange={(value) =>
            setFilters((f) => ({ ...f, priceRange: value as [number, number] }))
          }
          min={0}
          max={300}
          step={10}
          className="mt-2"
        />
      </div>

      {/* Property Type */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Typologie</Label>
        <div className="flex flex-wrap gap-2">
          {propertyTypes.map((type) => (
            <Badge
              key={type}
              variant={filters.propertyTypes.includes(type) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() =>
                setFilters((f) => ({
                  ...f,
                  propertyTypes: f.propertyTypes.includes(type)
                    ? f.propertyTypes.filter((t) => t !== type)
                    : [...f.propertyTypes, type],
                }))
              }
            >
              {type}
            </Badge>
          ))}
        </div>
      </div>

      {/* Property Kind */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Type de bien</Label>
        <div className="space-y-2">
          {propertyKinds.map((kind) => (
            <div key={kind} className="flex items-center gap-2">
              <Checkbox
                id={kind}
                checked={filters.propertyKinds.includes(kind)}
                onCheckedChange={(checked) =>
                  setFilters((f) => ({
                    ...f,
                    propertyKinds: checked
                      ? [...f.propertyKinds, kind]
                      : f.propertyKinds.filter((k) => k !== kind),
                  }))
                }
              />
              <Label htmlFor={kind} className="capitalize cursor-pointer">
                {kind}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Sea Proximity */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Proximité mer</Label>
        <div className="space-y-2">
          {seaProximities.map((sea) => (
            <div key={sea.value} className="flex items-center gap-2">
              <Checkbox
                id={sea.value}
                checked={filters.seaProximities.includes(sea.value)}
                onCheckedChange={(checked) =>
                  setFilters((f) => ({
                    ...f,
                    seaProximities: checked
                      ? [...f.seaProximities, sea.value]
                      : f.seaProximities.filter((s) => s !== sea.value),
                  }))
                }
              />
              <Label htmlFor={sea.value} className="cursor-pointer">
                {sea.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <Button variant="outline" onClick={resetFilters} className="w-full">
          Reinitialiser les filtres
        </Button>
      )}
    </div>
  )

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Logements en Bretagne</h1>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <SearchBar />
          <div className="flex items-center gap-2">
            {/* Mobile Filters */}
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filtres
                  {activeFilterCount > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Filtres</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FiltersContent />
                </div>
              </SheetContent>
            </Sheet>

            {/* Sort */}
            <Select
              value={filters.sortBy}
              onValueChange={(value: Filters['sortBy']) =>
                setFilters((f) => ({ ...f, sortBy: value }))
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Plus récent</SelectItem>
                <SelectItem value="price-asc">Prix croissant</SelectItem>
                <SelectItem value="price-desc">Prix décroissant</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 shrink-0">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Filtres</CardTitle>
                {activeFilterCount > 0 && (
                  <Badge variant="secondary">{activeFilterCount}</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <FiltersContent />
            </CardContent>
          </Card>
        </aside>

        {/* Results */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-muted-foreground">
              {filteredListings.length} logement{filteredListings.length !== 1 ? 's' : ''} trouve{filteredListings.length !== 1 ? 's' : ''}
            </p>
          </div>

          {filteredListings.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground mb-4">
                Aucun logement ne correspond à vos critères.
              </p>
              <Button variant="outline" onClick={resetFilters}>
                Réinitialiser les filtres
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
