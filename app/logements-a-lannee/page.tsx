'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { PropertyType, PropertyKind, SeaProximity } from '@/lib/types'
import { cities } from '@/lib/data/cities'

const propertyTypes: PropertyType[] = ['T1', 'T2', 'T3', 'T4']
const propertyKinds: PropertyKind[] = ['appartement', 'maison']
const seaProximities: { value: SeaProximity; label: string }[] = [
  { value: 'standard', label: 'Standard' },
  { value: 'proche_mer', label: 'Proche mer' },
  { value: 'vue_mer', label: 'Vue mer' },
]
const monthOptions = [
  { value: '01', label: 'Janvier' },
  { value: '02', label: 'Février' },
  { value: '03', label: 'Mars' },
  { value: '04', label: 'Avril' },
  { value: '05', label: 'Mai' },
  { value: '06', label: 'Juin' },
  { value: '07', label: 'Juillet' },
  { value: '08', label: 'Août' },
  { value: '09', label: 'Septembre' },
  { value: '10', label: 'Octobre' },
  { value: '11', label: 'Novembre' },
  { value: '12', label: 'Décembre' },
]
const yearOptions = ['2026', '2027', '2028']
const professions = ['CDI', 'CDD', 'Indépendant', 'Auto-entrepreneur', 'Autre']

interface PrevalidationStep {
  date: string
  status: string
  note?: string
}

interface ApplicationHistoryItem {
  date: string
  status: string
  location: string
  desiredCities: string[]
  prevalidation: PrevalidationStep[]
  summary: string
}

export default function LogementsALAnneePage() {
  const [startMonth, setStartMonth] = useState('09')
  const [startYear, setStartYear] = useState('2026')
  const [monthFlexibility, setMonthFlexibility] = useState('0')
  const [desiredCities, setDesiredCities] = useState<string[]>([])
  const [desiredCityQuery, setDesiredCityQuery] = useState('')
  const [propertyTypesSelected, setPropertyTypesSelected] = useState<PropertyType[]>([])
  const [propertyKindsSelected, setPropertyKindsSelected] = useState<PropertyKind[]>([])
  const [seaProximitiesSelected, setSeaProximitiesSelected] = useState<SeaProximity[]>([])
  const [professionalStatus, setProfessionalStatus] = useState('CDI')
  const [monthlyIncome, setMonthlyIncome] = useState('')
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [message, setMessage] = useState('')

  const [history, setHistory] = useState<ApplicationHistoryItem[]>([
    {
      date: '12/05/2026',
      status: 'Envoyée',
      location: 'Maison • T2 • Proche mer',
      desiredCities: ['Rennes', 'Vannes'],
      prevalidation: [
        { date: '13/05/2026', status: 'Prévalidation initiée' },
        { date: '14/05/2026', status: 'En attente de justificatifs' },
      ],
      summary: 'Candidature envoyée et en attente de retour',
    },
  ])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const locationDetails = [
      propertyKindsSelected.length ? propertyKindsSelected.join(', ') : 'Type non défini',
      seaProximitiesSelected.length
        ? seaProximitiesSelected
            .map((item) => seaProximities.find((sea) => sea.value === item)?.label)
            .join(', ')
        : 'Localisation non définie',
    ].join(' • ')

    const newHistoryItem: ApplicationHistoryItem = {
      date: new Date().toLocaleDateString('fr-FR'),
      status: 'Envoyée',
      location: locationDetails,
      desiredCities: desiredCities.length > 0 ? desiredCities : ['Non renseignée'],
      prevalidation: [
        { date: new Date().toLocaleDateString('fr-FR'), status: 'Prévalidation initiée' },
        { date: new Date().toLocaleDateString('fr-FR'), status: 'Vérification des documents prévue' },
      ],
      summary: `${adults} adultes, ${children} enfants à charge — démarrage souhaité ${monthOptions.find((item) => item.value === startMonth)?.label} ${startYear}${monthFlexibility !== '0' ? ` (±${monthFlexibility} mois)` : ''}`,
    }

    setHistory((current) => [newHistoryItem, ...current])
    alert('Votre candidature a bien été prise en compte. Nous revenons vers vous rapidement.')
  }

  const togglePropertyType = (type: PropertyType) => {
    setPropertyTypesSelected((current) =>
      current.includes(type)
        ? current.filter((item) => item !== type)
        : [...current, type]
    )
  }

  const togglePropertyKind = (kind: PropertyKind) => {
    setPropertyKindsSelected((current) =>
      current.includes(kind)
        ? current.filter((item) => item !== kind)
        : [...current, kind]
    )
  }

  const toggleSeaProximity = (value: SeaProximity) => {
    setSeaProximitiesSelected((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    )
  }
  const toggleDesiredCity = (city: string) => {
    setDesiredCities((current) =>
      current.includes(city) ? current.filter((item) => item !== city) : [...current, city]
    )
  }

  const filteredCities = cities
    .filter(
      (c) => c.toLowerCase().includes(desiredCityQuery.toLowerCase()) && !desiredCities.includes(c)
    )
    .slice(0, 10)

  const addCity = (city: string) => {
    if (desiredCities.includes(city) || desiredCities.length >= 3) return
    setDesiredCities((current) => [...current, city])
    setDesiredCityQuery('')
  }

  return (
    <div className="container py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-3">Candidature logement à l'année</h1>
        <p className="text-muted-foreground max-w-2xl">
          Cette page vous permet de candidater pour un logement annuel.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="professionalStatus">Statut professionnel</Label>
                  <Select
                    value={professionalStatus}
                    onValueChange={(value) => setProfessionalStatus(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {professions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="monthlyIncome">Revenu mensuel net</Label>
                  <Input
                    id="monthlyIncome"
                    type="number"
                    value={monthlyIncome}
                    onChange={(event) => setMonthlyIncome(event.target.value)}
                    placeholder="EUR"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="adults">Adultes</Label>
                  <Input
                    id="adults"
                    type="number"
                    min={1}
                    value={adults}
                    onChange={(event) => setAdults(Number(event.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="children">Enfants à charge</Label>
                  <Input
                    id="children"
                    type="number"
                    min={0}
                    value={children}
                    onChange={(event) => setChildren(Number(event.target.value))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Input
                  id="message"
                  type="text"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Profil, besoin ou contraintes spécifiques"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Caractéristiques du logement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium mb-3 block">Mois de démarrage souhaité</Label>
                  <Select value={startMonth} onValueChange={(value) => setStartMonth(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {monthOptions.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-3 block">Année de démarrage</Label>
                  <Select value={startYear} onValueChange={(value) => setStartYear(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {yearOptions.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-3 block">Flexibilité du mois de démarrage</Label>
                  <Select value={monthFlexibility} onValueChange={(value) => setMonthFlexibility(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Fixe</SelectItem>
                      <SelectItem value="1">±1 mois</SelectItem>
                      <SelectItem value="2">±2 mois</SelectItem>
                      <SelectItem value="3">±3 mois</SelectItem>
                      <SelectItem value="6">±6 mois</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-2">
                    {monthFlexibility === '0' ? 'Date de démarrage stricte' : `Disponible entre ${monthFlexibility} mois avant et après le mois souhaité`}
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="desiredCityInput">Ville(s) souhaitée(s)</Label>
                <div className="mt-2">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {desiredCities.map((city) => (
                      <span
                        key={city}
                        className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm"
                      >
                        <span>{city}</span>
                        <button
                          type="button"
                          onClick={() => toggleDesiredCity(city)}
                          className="ml-2 text-xs leading-none"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  <Input
                    id="desiredCityInput"
                    type="text"
                    value={desiredCityQuery}
                    onChange={(event) => setDesiredCityQuery(event.target.value)}
                    placeholder="Tapez pour chercher une ville (jusqu'à 3)"
                    autoComplete="off"
                  />

                  {filteredCities.length > 0 && desiredCityQuery && (
                    <div className="mt-1 border rounded bg-background max-h-40 overflow-auto z-10">
                      {filteredCities.map((city) => (
                        <div
                          key={city}
                          className="px-3 py-2 hover:bg-muted cursor-pointer"
                          onClick={() => addCity(city)}
                        >
                          {city}
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground mt-1">{desiredCities.length}/3 sélectionnées</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-3 block">Typologie</Label>
                <div className="flex flex-wrap gap-2">
                  {propertyTypes.map((type) => (
                    <Badge
                      key={type}
                      variant={propertyTypesSelected.includes(type) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => togglePropertyType(type)}
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-3 block">Type de bien</Label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {propertyKinds.map((kind) => (
                    <label
                      key={kind}
                      className="flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer"
                    >
                      <Checkbox
                        id={kind}
                        checked={propertyKindsSelected.includes(kind)}
                        onCheckedChange={() => togglePropertyKind(kind)}
                      />
                      <span className="capitalize">{kind}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-3 block">Proximité mer</Label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {seaProximities.map((sea) => (
                    <label
                      key={sea.value}
                      className="flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer"
                    >
                      <Checkbox
                        id={sea.value}
                        checked={seaProximitiesSelected.includes(sea.value)}
                        onCheckedChange={() => toggleSeaProximity(sea.value)}
                      />
                      <span>{sea.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full">
            Envoyer ma candidature
          </Button>
        </div>

        <aside className="space-y-6">
          <Card className="border p-6">
            <CardHeader>
              <CardTitle>Résumé</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div>
                <p className="font-medium text-foreground">Statut</p>
                <p>{professionalStatus}</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Revenu</p>
                <p>{monthlyIncome ? `${monthlyIncome} € / mois` : 'Non renseigné'}</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Composition familiale</p>
                <p>{adults} adultes, {children} enfants à charge</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Démarrage souhaité</p>
                <p>
                  {monthOptions.find((item) => item.value === startMonth)?.label} {startYear}
                  {monthFlexibility !== '0' && <span className="text-xs"> (±{monthFlexibility} mois)</span>}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border p-6">
            <CardHeader>
              <CardTitle>Historique des candidatures</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              {history.map((item) => (
                <div key={`${item.date}-${item.status}`} className="rounded-lg border p-4">
                  <p className="text-sm font-medium">{item.date}</p>
                  <p className="text-sm">{item.status}</p>
                  <div className="mt-3">
                    <p className="text-sm font-medium">Caractéristiques du logement</p>
                    <p className="text-sm text-foreground">{item.location}</p>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm font-medium">Ville(s) souhaitée(s)</p>
                    <p className="text-sm text-foreground">
                      {Array.isArray(item.desiredCities)
                        ? item.desiredCities.join(', ')
                        : item.desiredCities}
                    </p>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm font-medium">Historique de prévalidation</p>
                    <ul className="list-disc ml-5 mt-2 space-y-1 text-sm text-muted-foreground">
                      {item.prevalidation.map((step) => (
                        <li key={`${step.date}-${step.status}`}>
                          {step.date} — {step.status}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">{item.summary}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </aside>
      </form>
    </div>
  )
}
