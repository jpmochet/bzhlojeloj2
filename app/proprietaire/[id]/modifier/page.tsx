'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { getListingById } from '@/lib/data/listings'

export default function EditListingPage() {
  const params = useParams() as { id?: string }
  const router = useRouter()
  const listingId = params?.id ?? ''
  const listing = useMemo(() => getListingById(listingId), [listingId])

  const [title, setTitle] = useState(listing?.title ?? '')
  const [type, setType] = useState<'T1' | 'T2' | 'T3' | 'T4'>((listing?.propertyType ?? 'T2') as 'T1' | 'T2' | 'T3' | 'T4')
  const [propertyType, setPropertyType] = useState<'appartement' | 'maison'>((listing?.propertyKind ?? 'appartement') as 'appartement' | 'maison')
  const [seaProximity, setSeaProximity] = useState<'standard' | 'proche_mer' | 'vue_mer'>(listing?.seaProximity ?? 'standard')
  const [baseLowSeasonPrice, setBaseLowSeasonPrice] = useState(listing?.baseLowSeasonPrice ?? 0)
  const [bedrooms, setBedrooms] = useState(listing?.bedrooms ?? 0)
  const [description, setDescription] = useState(listing?.description ?? '')
  const [location, setLocation] = useState(listing?.location ?? '')
  const [landArea, setLandArea] = useState(listing?.landArea ?? 0)
  const [terraceArea, setTerraceArea] = useState(listing?.terraceArea ?? 0)

  if (!listing) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Logement introuvable</h1>
        <Button asChild>
          <Link href="/proprietaire">Retour au tableau de bord</Link>
        </Button>
      </div>
    )
  }

  const handleSave = () => {
    router.push('/proprietaire')
  }

  return (
    <div className="min-h-screen bg-muted/30 py-10">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Modifier le logement</h1>
            <p className="text-muted-foreground">Mettez à jour les informations de votre annonce.</p>
          </div>
          <Button asChild variant="secondary">
            <Link href="/proprietaire">Retour au tableau de bord</Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informations du logement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Titre</Label>
                <Input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Titre du logement"
                />
              </div>
              <div className="space-y-2">
                <Label>Emplacement</Label>
                <Input
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="Ville, quartier"
                />
              </div>
              <div className="space-y-2">
                <Label>Typologie</Label>
                <Select value={type} onValueChange={(value) => setType(value as 'T1' | 'T2' | 'T3' | 'T4')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="T1">T1 (Studio)</SelectItem>
                    <SelectItem value="T2">T2 (2 pièces)</SelectItem>
                    <SelectItem value="T3">T3 (3 pièces)</SelectItem>
                    <SelectItem value="T4">T4+ (4+ pièces)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Type de bien</Label>
                <Select value={propertyType} onValueChange={(value) => setPropertyType(value as 'appartement' | 'maison')}>
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
                <Label>Nombre de chambres</Label>
                <Input
                  type="number"
                  min={0}
                  value={bedrooms}
                  onChange={(event) => setBedrooms(parseInt(event.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label>Proximité mer</Label>
                <Select value={seaProximity} onValueChange={(value) => setSeaProximity(value as 'standard' | 'proche_mer' | 'vue_mer')}>
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
                  value={baseLowSeasonPrice}
                  onChange={(event) => setBaseLowSeasonPrice(parseInt(event.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label>Surface du terrain (m²) {propertyType === 'appartement' && <span className="text-xs text-muted-foreground">(optionnel)</span>}</Label>
                <Input
                  type="number"
                  min={0}
                  value={landArea || ''}
                  onChange={(event) => setLandArea(parseInt(event.target.value) || 0)}
                  placeholder={propertyType === 'maison' ? "Ex: 600 m²" : "Terrasse, balcon, cour..."}
                />
                {propertyType === 'maison' && (
                  <p className="text-xs text-muted-foreground">Cela affecte le coût des services de jardinage (tonte, haies, etc.)</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Surface de terrasse (m²) {propertyType === 'appartement' && <span className="text-xs text-muted-foreground">(optionnel)</span>}</Label>
                <Input
                  type="number"
                  min={0}
                  value={terraceArea || ''}
                  onChange={(event) => setTerraceArea(parseInt(event.target.value) || 0)}
                  placeholder={propertyType === 'maison' ? "Ex: 50 m²" : "Balcon, petite terrasse..."}
                />
                {propertyType === 'maison' && (
                  <p className="text-xs text-muted-foreground">Affecte le coût du nettoyage terrasse</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <textarea
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                rows={5}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={() => router.push('/proprietaire')}>Annuler</Button>
              <Button onClick={handleSave}>Enregistrer les modifications</Button>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <div className="font-semibold mb-2">Note</div>
              <p>Cette page simule la mise à jour des informations du logement. Les modifications ne sont pas encore persistées dans les données de démonstration.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
