'use client'

export const dynamic = 'force-dynamic'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Settings, Percent, Home, Wrench, Calendar, DollarSign, TrendingUp } from 'lucide-react'
import { defaultConfig } from '@/lib/data/config'
import { services } from '@/lib/data/services'

const defaultAveragePrices = {
  T1: { standard: { appartement: 50, maison: 55 }, proche_mer: { appartement: 65, maison: 72 }, vue_mer: { appartement: 85, maison: 95 } },
  T2: { standard: { appartement: 65, maison: 72 }, proche_mer: { appartement: 85, maison: 95 }, vue_mer: { appartement: 110, maison: 125 } },
  T3: { standard: { appartement: 80, maison: 90 }, proche_mer: { appartement: 105, maison: 120 }, vue_mer: { appartement: 135, maison: 155 } },
  T4: { standard: { appartement: 95, maison: 110 }, proche_mer: { appartement: 125, maison: 145 }, vue_mer: { appartement: 160, maison: 185 } },
}

export default function AdminPage() {
  const [editMode, setEditMode] = useState(false)
  const [config, setConfig] = useState(defaultConfig)
  const [averagePrices, setAveragePrices] = useState(defaultAveragePrices)
  const [serviceConfig, setServiceConfig] = useState<Record<string, { basePoints: number; landAreaReference?: number; availableFor: { appartement?: boolean; maison?: boolean } }>>(
    Object.fromEntries(services.map(s => [s.id, {
      basePoints: s.basePoints,
      landAreaReference: ['s1', 's2', 's3', 's4'].includes(s.id) ? 1000 : undefined,
      availableFor: {
        appartement: !s.availableFor?.propertyKinds || s.availableFor.propertyKinds.includes('appartement'),
        maison: !s.availableFor?.propertyKinds || s.availableFor.propertyKinds.includes('maison'),
      }
    }]))
  )

  const handleConfigChange = (path: string, value: any) => {
    setConfig((prev) => {
      const newConfig = { ...prev }
      const keys = path.split('.')
      let current = newConfig
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]]
      }
      current[keys[keys.length - 1]] = value
      return newConfig
    })
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Settings className="h-8 w-8" />
            Administration
          </h1>
          <p className="text-primary-foreground/80">Gérez les paramètres de la plateforme</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Paramètres de configuration</h2>
          <Button 
            onClick={() => setEditMode(!editMode)}
            variant={editMode ? 'default' : 'outline'}
          >
            {editMode ? 'Enregistrer' : 'Modifier'}
          </Button>
        </div>

        <Tabs defaultValue="commission">
          <TabsList className="mb-6 flex-wrap">
            <TabsTrigger value="commission" className="gap-2">
              <Percent className="h-4 w-4" />
              Commission
            </TabsTrigger>
            <TabsTrigger value="seasons-calendar" className="gap-2">
              <Calendar className="h-4 w-4" />
              Calendrier
            </TabsTrigger>
            <TabsTrigger value="seasons" className="gap-2">
              <Calendar className="h-4 w-4" />
              Saisons
            </TabsTrigger>
            <TabsTrigger value="housing" className="gap-2">
              <Home className="h-4 w-4" />
              Logements
            </TabsTrigger>
            <TabsTrigger value="services" className="gap-2">
              <Wrench className="h-4 w-4" />
              Services
            </TabsTrigger>
            <TabsTrigger value="other" className="gap-2">
              <Settings className="h-4 w-4" />
              Autre
            </TabsTrigger>
          </TabsList>

          {/* Seasons Calendar Tab */}
          <TabsContent value="seasons-calendar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Calendrier des saisons</CardTitle>
                <CardDescription>Configurez la saison pour chacun des 12 mois</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { month: 'Janvier', num: 1, color: 'bg-blue-100 border-blue-300' },
                    { month: 'Février', num: 2, color: 'bg-blue-100 border-blue-300' },
                    { month: 'Mars', num: 3, color: 'bg-blue-100 border-blue-300' },
                    { month: 'Avril', num: 4, color: 'bg-blue-100 border-blue-300' },
                    { month: 'Mai', num: 5, color: 'bg-yellow-100 border-yellow-300' },
                    { month: 'Juin', num: 6, color: 'bg-yellow-100 border-yellow-300' },
                    { month: 'Juillet', num: 7, color: 'bg-red-100 border-red-300' },
                    { month: 'Août', num: 8, color: 'bg-red-100 border-red-300' },
                    { month: 'Septembre', num: 9, color: 'bg-yellow-100 border-yellow-300' },
                    { month: 'Octobre', num: 10, color: 'bg-blue-100 border-blue-300' },
                    { month: 'Novembre', num: 11, color: 'bg-blue-100 border-blue-300' },
                    { month: 'Décembre', num: 12, color: 'bg-blue-100 border-blue-300' },
                  ].map(({ month, num, color }) => {
                    const multiplier = (num >= 5 && num <= 6) || num === 9
                      ? config.seasons.moyenne.multiplier
                      : num >= 7 && num <= 8
                      ? config.seasons.haute.multiplier
                      : config.seasons.basse.multiplier

                    const season = (num >= 5 && num <= 6) || num === 9
                      ? 'Moyenne'
                      : num >= 7 && num <= 8
                      ? 'Haute'
                      : 'Basse'

                    const seasonKey = season.toLowerCase() as keyof typeof config.seasons

                    return (
                      <div key={num} className={`p-4 border-2 rounded-lg ${color}`}>
                        <div className="text-center">
                          <h4 className="font-semibold mb-2">{month}</h4>
                          <div className="mb-3">
                            <p className="text-sm text-muted-foreground mb-1">Saison</p>
                            {editMode ? (
                              <select
                                value={seasonKey}
                                onChange={(e) => {
                                  const newSeason = e.target.value as keyof typeof config.seasons
                                  if (newSeason === 'basse') {
                                    handleConfigChange('seasons.basse.startMonth', Math.min(config.seasons.basse.startMonth, num))
                                    handleConfigChange('seasons.basse.endMonth', Math.max(config.seasons.basse.endMonth, num))
                                  } else if (newSeason === 'moyenne') {
                                    handleConfigChange('seasons.moyenne.startMonth', Math.min(config.seasons.moyenne.startMonth, num))
                                    handleConfigChange('seasons.moyenne.endMonth', Math.max(config.seasons.moyenne.endMonth, num))
                                  } else if (newSeason === 'haute') {
                                    handleConfigChange('seasons.haute.startMonth', Math.min(config.seasons.haute.startMonth, num))
                                    handleConfigChange('seasons.haute.endMonth', Math.max(config.seasons.haute.endMonth, num))
                                  }
                                }}
                                className="w-full p-2 border rounded text-sm"
                              >
                                <option value="basse">Basse saison</option>
                                <option value="moyenne">Moyenne saison</option>
                                <option value="haute">Haute saison</option>
                              </select>
                            ) : (
                              <Badge className={season === 'Basse' ? 'bg-blue-600' : season === 'Moyenne' ? 'bg-yellow-600' : 'bg-red-600'}>
                                {season}
                              </Badge>
                            )}
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Multiplicateur</p>
                            <p className="text-lg font-bold">{multiplier}x</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Legend */}
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-3">Légende</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-100 border-2 border-blue-300 rounded"></div>
                      <span className="text-sm">Basse saison (×{config.seasons.basse.multiplier})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-300 rounded"></div>
                      <span className="text-sm">Moyenne saison (×{config.seasons.moyenne.multiplier})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded"></div>
                      <span className="text-sm">Haute saison (×{config.seasons.haute.multiplier})</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Commission Tab */}
          <TabsContent value="commission" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Commission totale</CardTitle>
                <CardDescription>Répartition des commissions de la plateforme</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Total Commission */}
                  <div className="space-y-2">
                    <Label>Commission totale (%)</Label>
                    <Input 
                      type="number" 
                      step="0.01"
                      min="0"
                      max="100"
                      value={config.commission.totalPct * 100}
                      onChange={(e) => handleConfigChange('commission.totalPct', parseFloat(e.target.value) / 100)}
                      disabled={!editMode}
                    />
                    <p className="text-xs text-muted-foreground">Actuellement: {config.commission.totalPct * 100}%</p>
                  </div>

                  {/* Commission Breakdown */}
                  <div className="space-y-4">
                    <div>
                      <Label>Plateforme (%)</Label>
                      <Input 
                        type="number" 
                        step="0.01"
                        value={config.commission.platformPct * 100}
                        onChange={(e) => handleConfigChange('commission.platformPct', parseFloat(e.target.value) / 100)}
                        disabled={!editMode}
                      />
                    </div>
                    <div>
                      <Label>Logement à l'année (%)</Label>
                      <Input 
                        type="number" 
                        step="0.01"
                        value={config.commission.housingPct * 100}
                        onChange={(e) => handleConfigChange('commission.housingPct', parseFloat(e.target.value) / 100)}
                        disabled={!editMode}
                      />
                    </div>
                    <div>
                      <Label>Services (%)</Label>
                      <Input 
                        type="number" 
                        step="0.01"
                        value={config.commission.servicesPct * 100}
                        onChange={(e) => handleConfigChange('commission.servicesPct', parseFloat(e.target.value) / 100)}
                        disabled={!editMode}
                      />
                    </div>
                  </div>
                </div>

                {/* Verification */}
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm">
                    Total: {((config.commission.platformPct + config.commission.housingPct + config.commission.servicesPct) * 100).toFixed(2)}%
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Seasons Tab */}
          <TabsContent value="seasons" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Multiplicateurs saisonniers</CardTitle>
                <CardDescription>Définissez les prix par saison (les périodes se configurent dans le Calendrier)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Basse saison */}
                  <div className="space-y-3">
                    <h4 className="font-semibold">Basse saison</h4>
                    <div>
                      <Label>Multiplicateur</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={config.seasons.basse.multiplier}
                        onChange={(e) => handleConfigChange('seasons.basse.multiplier', parseFloat(e.target.value))}
                        disabled={!editMode}
                      />
                    </div>
                  </div>

                  {/* Moyenne saison */}
                  <div className="space-y-3">
                    <h4 className="font-semibold">Moyenne saison</h4>
                    <div>
                      <Label>Multiplicateur</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={config.seasons.moyenne.multiplier}
                        onChange={(e) => handleConfigChange('seasons.moyenne.multiplier', parseFloat(e.target.value))}
                        disabled={!editMode}
                      />
                    </div>
                  </div>

                  {/* Haute saison */}
                  <div className="space-y-3">
                    <h4 className="font-semibold">Haute saison</h4>
                    <div>
                      <Label>Multiplicateur</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={config.seasons.haute.multiplier}
                        onChange={(e) => handleConfigChange('seasons.haute.multiplier', parseFloat(e.target.value))}
                        disabled={!editMode}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">
                    💡 Les périodes (mois début/fin) se configurent dans l'onglet <strong>Calendrier</strong> pour une meilleure visibilité.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Housing Tab */}
          <TabsContent value="housing" className="space-y-6">
            {/* Average Prices Table */}
            <Card>
              <CardHeader>
                <CardTitle>Prix moyen par nuit (EUR)</CardTitle>
                <CardDescription>Configurez les prix moyens utilisés pour l'équivalence annuelle</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="text-left py-2 px-3">Type</th>
                        <th className="text-center py-2 px-3" colSpan={2}>Standard</th>
                        <th className="text-center py-2 px-3" colSpan={2}>Proche mer</th>
                        <th className="text-center py-2 px-3" colSpan={2}>Vue mer</th>
                      </tr>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3"></th>
                        <th className="text-center py-2 px-3 text-xs">Apart.</th>
                        <th className="text-center py-2 px-3 text-xs">Maison</th>
                        <th className="text-center py-2 px-3 text-xs">Apart.</th>
                        <th className="text-center py-2 px-3 text-xs">Maison</th>
                        <th className="text-center py-2 px-3 text-xs">Apart.</th>
                        <th className="text-center py-2 px-3 text-xs">Maison</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(['T1', 'T2', 'T3', 'T4'] as const).map((type) => (
                        <tr key={type} className="border-b hover:bg-muted/30">
                          <td className="py-2 px-3 font-medium">{type}</td>
                          {(['standard', 'proche_mer', 'vue_mer'] as const).map((proximity) => (
                            <React.Fragment key={proximity}>
                              <td className="text-center py-2 px-3">
                                <Input
                                  type="number"
                                  step="1"
                                  value={averagePrices[type][proximity].appartement}
                                  onChange={(e) => setAveragePrices({
                                    ...averagePrices,
                                    [type]: {
                                      ...averagePrices[type],
                                      [proximity]: {
                                        ...averagePrices[type][proximity],
                                        appartement: parseInt(e.target.value) || 0
                                      }
                                    }
                                  })}
                                  disabled={!editMode}
                                  className="text-center w-16"
                                />
                              </td>
                              <td className="text-center py-2 px-3">
                                <Input
                                  type="number"
                                  step="1"
                                  value={averagePrices[type][proximity].maison}
                                  onChange={(e) => setAveragePrices({
                                    ...averagePrices,
                                    [type]: {
                                      ...averagePrices[type],
                                      [proximity]: {
                                        ...averagePrices[type][proximity],
                                        maison: parseInt(e.target.value) || 0
                                      }
                                    }
                                  })}
                                  disabled={!editMode}
                                  className="text-center w-16"
                                />
                              </td>
                            </React.Fragment>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-900">
                    💡 Ces prix moyens par nuit sont utilisés pour calculer l'équivalence annuelle. Ajustez-les selon vos tarifs réels.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configuration des logements</CardTitle>
                <CardDescription>Points et équivalences annuelles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>EUR par point logement</Label>
                    <Input 
                      type="number" 
                      step="1"
                      value={config.eurPerHousingPoint}
                      onChange={(e) => handleConfigChange('eurPerHousingPoint', parseInt(e.target.value))}
                      disabled={!editMode}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Jours N+1 (options fermes à J-X)</Label>
                    <Input 
                      type="number" 
                      step="1"
                      value={config.optionBecomesFirmDays}
                      onChange={(e) => handleConfigChange('optionBecomesFirmDays', parseInt(e.target.value))}
                      disabled={!editMode}
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-4">Équivalence nuits annuelles par type</h4>
                  <div className="grid md:grid-cols-4 gap-4">
                    {Object.entries(config.annualNightEquivalent).map(([type, value]) => (
                      <div key={type} className="space-y-2">
                        <Label>{type}</Label>
                        <Input 
                          type="number" 
                          step="1"
                          value={value}
                          onChange={(e) => handleConfigChange(`annualNightEquivalent.${type}`, parseInt(e.target.value))}
                          disabled={!editMode}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-4">Occupation attendue (nuits réservées)</h4>
                  <div className="space-y-4">
                    {Object.entries(config.expectedOccupation).map(([type, periods]) => (
                      <div key={type} className="p-4 border rounded-lg">
                        <h5 className="font-medium mb-3">{type}</h5>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label className="text-xs">Basse</Label>
                            <Input 
                              type="number" 
                              step="1"
                              value={periods.low}
                              onChange={(e) => handleConfigChange(`expectedOccupation.${type}.low`, parseInt(e.target.value))}
                              disabled={!editMode}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Moyenne</Label>
                            <Input 
                              type="number" 
                              step="1"
                              value={periods.mid}
                              onChange={(e) => handleConfigChange(`expectedOccupation.${type}.mid`, parseInt(e.target.value))}
                              disabled={!editMode}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Haute</Label>
                            <Input 
                              type="number" 
                              step="1"
                              value={periods.high}
                              onChange={(e) => handleConfigChange(`expectedOccupation.${type}.high`, parseInt(e.target.value))}
                              disabled={!editMode}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuration des services</CardTitle>
                <CardDescription>Points et coefficients de coût</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>EUR par point service</Label>
                    <Input 
                      type="number" 
                      step="1"
                      value={config.eurPerServicePoint}
                      onChange={(e) => handleConfigChange('eurPerServicePoint', parseInt(e.target.value))}
                      disabled={!editMode}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Part propriétaire (%)</Label>
                    <Input 
                      type="number" 
                      step="1"
                      min="0"
                      max="100"
                      value={config.ownerSharePct * 100}
                      onChange={(e) => handleConfigChange('ownerSharePct', parseInt(e.target.value) / 100)}
                      disabled={!editMode}
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-4">Coefficients de coût</h4>
                  <div className="space-y-4">
                    {/* Property Type */}
                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-3">Par type de propriété</h5>
                      <div className="grid md:grid-cols-4 gap-4">
                        {Object.entries(config.coefficients.propertyType).map(([type, value]) => (
                          <div key={type} className="space-y-2">
                            <Label>{type}</Label>
                            <Input 
                              type="number" 
                              step="0.1"
                              value={value}
                              onChange={(e) => handleConfigChange(`coefficients.propertyType.${type}`, parseFloat(e.target.value))}
                              disabled={!editMode}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Property Kind */}
                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-3">Par type de bien</h5>
                      <div className="grid md:grid-cols-2 gap-4">
                        {Object.entries(config.coefficients.propertyKind).map(([kind, value]) => (
                          <div key={kind} className="space-y-2">
                            <Label className="capitalize">{kind}</Label>
                            <Input 
                              type="number" 
                              step="0.1"
                              value={value}
                              onChange={(e) => handleConfigChange(`coefficients.propertyKind.${kind}`, parseFloat(e.target.value))}
                              disabled={!editMode}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-4">Services - Points de base et disponibilité</h4>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {services.map(service => (
                      <div key={service.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h5 className="font-medium">{service.name}</h5>
                            <p className="text-sm text-muted-foreground">{service.description}</p>
                          </div>
                          <div className="flex gap-4 flex-shrink-0">
                            <div className="space-y-2">
                              <Label className="text-xs">Points de base</Label>
                              <Input
                                type="number"
                                step="5"
                                value={serviceConfig[service.id]?.basePoints || service.basePoints}
                                onChange={(e) => setServiceConfig({
                                  ...serviceConfig,
                                  [service.id]: {
                                    ...serviceConfig[service.id],
                                    basePoints: parseInt(e.target.value)
                                  }
                                })}
                                disabled={!editMode}
                                className="w-24"
                              />
                            </div>
                            {['s1', 's2', 's3', 's4'].includes(service.id) && (
                              <div className="space-y-2">
                                <Label className="text-xs">Surface ref. (m²)</Label>
                                <Input
                                  type="number"
                                  step="100"
                                  value={serviceConfig[service.id]?.landAreaReference || 1000}
                                  onChange={(e) => setServiceConfig({
                                    ...serviceConfig,
                                    [service.id]: {
                                      ...serviceConfig[service.id],
                                      landAreaReference: parseInt(e.target.value)
                                    }
                                  })}
                                  disabled={!editMode}
                                  className="w-24"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-6 mt-3 ml-0">
                          <div className="flex flex-col gap-3 flex-1">
                            <div className="flex gap-4">
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  id={`${service.id}-appt`}
                                  checked={serviceConfig[service.id]?.availableFor?.appartement ?? true}
                                  onCheckedChange={(checked) => setServiceConfig({
                                    ...serviceConfig,
                                    [service.id]: {
                                      ...serviceConfig[service.id],
                                      availableFor: {
                                        ...serviceConfig[service.id]?.availableFor,
                                        appartement: checked as boolean
                                      }
                                    }
                                  })}
                                  disabled={!editMode}
                                />
                                <Label htmlFor={`${service.id}-appt`} className="text-sm cursor-pointer">Appartement</Label>
                              </div>
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  id={`${service.id}-maison`}
                                  checked={serviceConfig[service.id]?.availableFor?.maison ?? true}
                                  onCheckedChange={(checked) => setServiceConfig({
                                    ...serviceConfig,
                                    [service.id]: {
                                      ...serviceConfig[service.id],
                                      availableFor: {
                                        ...serviceConfig[service.id]?.availableFor,
                                        maison: checked as boolean
                                      }
                                    }
                                  })}
                                  disabled={!editMode}
                                />
                                <Label htmlFor={`${service.id}-maison`} className="text-sm cursor-pointer">Maison</Label>
                              </div>
                            </div>
                            {['s1', 's2', 's3', 's4'].includes(service.id) && (
                              <p className="text-xs text-muted-foreground">
                                {serviceConfig[service.id]?.basePoints} pts pour {serviceConfig[service.id]?.landAreaReference} m² - le coût augmente proportionnellement à la surface du terrain
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other Tab */}
          <TabsContent value="other" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Autres paramètres</CardTitle>
                <CardDescription>Configuration générale</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Mode propriétaire net</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {config.netOwnerFactorMode === 'traveler_pays_commission' 
                        ? 'Voyageur paie la commission' 
                        : 'Propriétaire paie la commission'}
                    </p>
                    {editMode && (
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => handleConfigChange('netOwnerFactorMode', 
                          config.netOwnerFactorMode === 'traveler_pays_commission' 
                            ? 'owner_pays_commission' 
                            : 'traveler_pays_commission'
                        )}
                      >
                        Changer
                      </Button>
                    )}
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Ordre d'éligibilité annuelle</h4>
                    <div className="flex flex-wrap gap-2">
                      {config.eligibilityOrder.map((type) => (
                        <Badge key={type} variant="secondary">{type}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Tri au sein du type</h4>
                    <p className="text-sm text-muted-foreground">
                      {config.withinTypeSorting === 'lowestRequiredPointsFirst' 
                        ? 'Points requis les plus bas en premier' 
                        : 'Score le plus élevé en premier'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {editMode && (
          <div className="flex gap-2 justify-end mt-8">
            <Button variant="outline" onClick={() => setEditMode(false)}>Annuler</Button>
            <Button onClick={() => setEditMode(false)}>Enregistrer les modifications</Button>
          </div>
        )}
      </div>
    </div>
  )
}
