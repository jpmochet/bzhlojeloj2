'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Calendar, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cities } from '@/lib/data/cities'
import { toast } from '@/hooks/use-toast'

interface SearchBarProps {
  variant?: 'hero' | 'compact'
}

export function SearchBar({ variant = 'compact' }: SearchBarProps) {
  const router = useRouter()
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  const [locationQuery, setLocationQuery] = useState('')
  const [guests, setGuests] = useState('2')

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (selectedCities.length) params.set('city', selectedCities.join(','))
    if (guests) params.set('guests', guests)
    router.push(`/logements?${params.toString()}`)
  }

  if (variant === 'hero') {
    return (
      <div className="bg-background rounded-2xl shadow-xl p-2 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl hover:bg-muted transition-colors">
            <MapPin className="w-5 h-5 text-muted-foreground shrink-0" />
            <div className="flex-1">
              <label className="text-xs font-medium text-muted-foreground block">Destination</label>
              <div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedCities.map((city) => (
                    <span
                      key={city}
                      className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm"
                    >
                      <span>{city}</span>
                      <button
                        type="button"
                        onClick={() => setSelectedCities((c) => c.filter((x) => x !== city))}
                        className="ml-2 text-xs leading-none"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <Input
                  type="text"
                  placeholder="Ou souhaitez-vous aller ?"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                />

                {locationQuery && (
                  <div className="mt-1 border rounded bg-background max-h-40 overflow-auto z-10">
                    {cities
                      .filter((c) => c.toLowerCase().includes(locationQuery.toLowerCase()) && !selectedCities.includes(c))
                      .slice(0, 10)
                      .map((city) => (
                        <div
                          key={city}
                          className="px-3 py-2 hover:bg-muted cursor-pointer"
                          onClick={() => {
                            if (selectedCities.length >= 3) {
                              toast({ title: 'Maximum atteint', description: 'Vous pouvez sélectionner jusqu\'à 3 villes.' })
                              return
                            }
                            setSelectedCities((c) => [...c, city])
                            setLocationQuery('')
                          }}
                        >
                          {city}
                        </div>
                      ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">{selectedCities.length}/3 sélectionnées</p>
              </div>
            </div>
          </div>

          <div className="hidden md:block w-px bg-border" />

          <div className="flex items-center gap-2 px-4 py-3 rounded-xl hover:bg-muted transition-colors">
            <Calendar className="w-5 h-5 text-muted-foreground shrink-0" />
            <div>
              <label className="text-xs font-medium text-muted-foreground block">
                Dates
              </label>
              <Input
                type="text"
                placeholder="Quand ?"
                className="border-0 p-0 h-auto text-base font-medium shadow-none focus-visible:ring-0"
              />
            </div>
          </div>

          <div className="hidden md:block w-px bg-border" />

          <div className="flex items-center gap-2 px-4 py-3 rounded-xl hover:bg-muted transition-colors">
            <Users className="w-5 h-5 text-muted-foreground shrink-0" />
            <div>
              <label className="text-xs font-medium text-muted-foreground block">
                Voyageurs
              </label>
              <Select value={guests} onValueChange={setGuests}>
                <SelectTrigger className="border-0 p-0 h-auto text-base font-medium shadow-none focus:ring-0 w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <SelectItem key={n} value={n.toString()}>
                      {n} {n === 1 ? 'voyageur' : 'voyageurs'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            size="lg"
            className="rounded-xl bg-coral hover:bg-coral/90 text-coral-foreground px-6"
            onClick={handleSearch}
          >
            <Search className="w-5 h-5" />
            <span className="ml-2 hidden md:inline">Rechercher</span>
          </Button>
        </div>
      </div>
    )
  }

  return (
      <div className="flex items-center gap-2 bg-background border rounded-full p-1 pl-4 shadow-sm max-w-xl">
      <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
      <div className="flex-1 flex items-center gap-2">
        <div className="flex flex-wrap gap-2 max-w-xs">
          {selectedCities.map((city) => (
            <span key={city} className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm">
              <span>{city}</span>
              <button
                type="button"
                onClick={() => setSelectedCities((c) => c.filter((x) => x !== city))}
                className="ml-2 text-xs leading-none"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <Input
          type="text"
          className="border-0 w-40 shadow-none focus:ring-0"
          placeholder={selectedCities.length ? '' : 'Destination'}
          value={locationQuery}
          onChange={(e) => setLocationQuery(e.target.value)}
        />
        {locationQuery && (
          <div className="absolute mt-10 bg-background border rounded max-h-40 overflow-auto z-10">
            {cities
              .filter((c) => c.toLowerCase().includes(locationQuery.toLowerCase()) && !selectedCities.includes(c))
              .slice(0, 10)
              .map((city) => (
                <div
                  key={city}
                  className="px-3 py-2 hover:bg-muted cursor-pointer"
                  onClick={() => {
                    if (selectedCities.length >= 3) {
                      toast({ title: 'Maximum atteint', description: 'Vous pouvez sélectionner jusqu\'à 3 villes.' })
                      return
                    }
                    setSelectedCities((c) => [...c, city])
                    setLocationQuery('')
                  }}
                >
                  {city}
                </div>
              ))}
          </div>
        )}
      </div>
      <div className="w-px h-6 bg-border" />
      <Users className="w-4 h-4 text-muted-foreground shrink-0" />
      <Select value={guests} onValueChange={setGuests}>
        <SelectTrigger className="border-0 w-24 shadow-none focus:ring-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <SelectItem key={n} value={n.toString()}>
              {n}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        size="sm"
        className="rounded-full bg-coral hover:bg-coral/90 text-coral-foreground"
        onClick={handleSearch}
      >
        <Search className="w-4 h-4" />
      </Button>
    </div>
  )
}
