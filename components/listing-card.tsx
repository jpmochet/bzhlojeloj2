'use client'

import Link from 'next/link'
import { MapPin, Users, Bed, Bath, Home, Building2, Waves } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useConfig } from '@/lib/context/config-context'
import { getAllSeasonPrices } from '@/lib/engines/season-price-calculator'
import { getEligibilityStatusLabel, getEligibilityStatusColor } from '@/lib/engines/housing-pool-engine'
import { formatCurrency } from '@/lib/engines/commission-calculator'
import type { Listing } from '@/lib/types'

interface ListingCardProps {
  listing: Listing
}

export function ListingCard({ listing }: ListingCardProps) {
  const { config } = useConfig()
  const prices = getAllSeasonPrices(listing.baseLowSeasonPrice, config)

  const PropertyIcon = listing.propertyKind === 'maison' ? Home : Building2

  return (
    <Link href={`/logements/${listing.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer h-full">
        <div className="relative aspect-[4/3] bg-muted overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
          <div className="absolute inset-0 flex items-center justify-center bg-ocean-light">
            <PropertyIcon className="w-16 h-16 text-ocean/30" />
          </div>
          
          {/* Badges */}
          <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
            <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
              {listing.propertyType}
            </Badge>
            {listing.seaProximity !== 'standard' && (
              <Badge className="bg-ocean text-ocean-foreground">
                <Waves className="w-3 h-3 mr-1" />
                {listing.seaProximity === 'vue_mer' ? 'Vue mer' : 'Proche mer'}
              </Badge>
            )}
          </div>

          {/* Annual eligibility badge */}
          {listing.annualEligibilityStatus !== 'SEASONAL_ONLY' && (
            <div className="absolute top-3 right-3 z-20">
              <Badge className={getEligibilityStatusColor(listing.annualEligibilityStatus)}>
                {getEligibilityStatusLabel(listing.annualEligibilityStatus)}
              </Badge>
            </div>
          )}

          {/* Price tag */}
          <div className="absolute bottom-3 right-3 z-20 bg-background/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
            <div className="text-xs text-muted-foreground">A partir de</div>
            <div className="font-semibold">{formatCurrency(prices.basse)}<span className="text-xs font-normal">/nuit</span></div>
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {listing.title}
          </h3>
          
          <div className="flex items-center gap-1.5 text-muted-foreground text-sm mt-1">
            <MapPin className="w-4 h-4" />
            <span>{listing.location}</span>
          </div>

          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{listing.maxGuests}</span>
            </div>
            {listing.bedrooms > 0 && (
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4" />
                <span>{listing.bedrooms}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              <span>{listing.bathrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <PropertyIcon className="w-4 h-4" />
              <span className="capitalize">{listing.propertyKind}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {listing.amenities.slice(0, 3).map((amenity) => (
              <Badge key={amenity} variant="outline" className="text-xs">
                {amenity}
              </Badge>
            ))}
            {listing.amenities.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{listing.amenities.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
