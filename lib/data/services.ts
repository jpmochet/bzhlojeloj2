import type { Service, ServiceCategory, ServiceOrder } from '@/lib/types'

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'cat1',
    name: 'Jardinage',
    description: 'Entretien des espaces verts et jardins',
  },
  {
    id: 'cat2',
    name: 'Entretien',
    description: 'Maintenance et petites reparations',
  },
  {
    id: 'cat3',
    name: 'Menage',
    description: 'Nettoyage et gestion du linge',
  },
  {
    id: 'cat4',
    name: 'Conciergerie',
    description: 'Accueil et gestion des arrivees/departs',
  },
  {
    id: 'cat5',
    name: 'Surveillance',
    description: 'Visite et hivernage des proprietes',
  },
]

export const services: Service[] = [
  // Jardinage
  {
    id: 's1',
    categoryId: 'cat1',
    name: 'Tonte pelouse',
    description: 'Tonte complete de la pelouse avec evacuation des dechets',
    basePoints: 25,
    isActive: true,
    availableFor: { propertyKinds: ['maison'] },
  },
  {
    id: 's2',
    categoryId: 'cat1',
    name: 'Taille des haies',
    description: 'Taille et mise en forme des haies',
    basePoints: 50,
    isActive: true,
    availableFor: { propertyKinds: ['maison'] },
  },
  {
    id: 's3',
    categoryId: 'cat1',
    name: 'Nettoyage terrasse',
    description: 'Nettoyage haute pression de la terrasse',
    basePoints: 25,
    isActive: true,
  },
  {
    id: 's4',
    categoryId: 'cat1',
    name: 'Debroussaillage',
    description: 'Debroussaillage complet du terrain',
    basePoints: 80,
    isActive: true,
    availableFor: { propertyKinds: ['maison'] },
  },
  // Entretien
  {
    id: 's5',
    categoryId: 'cat2',
    name: 'Controle pre-saison',
    description: 'Verification complete du logement avant la saison',
    basePoints: 25,
    isActive: true,
  },
  {
    id: 's6',
    categoryId: 'cat2',
    name: 'Petite plomberie',
    description: 'Reparations mineures de plomberie (joints, robinets)',
    basePoints: 50,
    isActive: true,
  },
  {
    id: 's7',
    categoryId: 'cat2',
    name: 'Petite electricite',
    description: 'Reparations mineures electriques (prises, interrupteurs)',
    basePoints: 50,
    isActive: true,
  },
  {
    id: 's8',
    categoryId: 'cat2',
    name: 'Serrurerie / Volets',
    description: 'Ajustement serrures, volets et fermetures',
    basePoints: 25,
    isActive: true,
  },
  // Menage
  {
    id: 's9',
    categoryId: 'cat3',
    name: 'Menage standard',
    description: 'Nettoyage complet entre deux locations',
    basePoints: 50,
    isActive: true,
  },
  {
    id: 's10',
    categoryId: 'cat3',
    name: 'Menage urgent',
    description: 'Menage en urgence (moins de 24h)',
    basePoints: 80,
    isActive: true,
  },
  {
    id: 's11',
    categoryId: 'cat3',
    name: 'Gestion linge',
    description: 'Lavage, sechage et pliage du linge de maison',
    basePoints: 25,
    isActive: true,
  },
  // Conciergerie
  {
    id: 's12',
    categoryId: 'cat4',
    name: 'Check-in / Check-out',
    description: 'Accueil des voyageurs et remise des cles',
    basePoints: 50,
    isActive: true,
  },
  {
    id: 's13',
    categoryId: 'cat4',
    name: 'Accueil autonome',
    description: 'Mise en place boite a cles et instructions',
    basePoints: 25,
    isActive: true,
  },
  // Surveillance
  {
    id: 's14',
    categoryId: 'cat5',
    name: 'Visite hivernage + photos',
    description: 'Visite mensuelle avec rapport photo',
    basePoints: 25,
    isActive: true,
  },
  {
    id: 's15',
    categoryId: 'cat5',
    name: 'Mise en hivernage',
    description: 'Preparation complete du logement pour l\'hiver',
    basePoints: 50,
    isActive: true,
  },
]

export const serviceOrders: ServiceOrder[] = [
  {
    id: 'so1',
    serviceId: 's1',
    ownerId: 'owner_1',
    listingId: 'l1',
    status: 'DEMANDE',
    pointsCost: 38,
    requestedAt: '2026-07-18',
    desiredDate: '2026-07-25',
    flexibilityDays: 2,
  },
  {
    id: 'so1b',
    serviceId: 's3',
    ownerId: 'owner_1',
    listingId: 'l2',
    status: 'PLANIFIE',
    pointsCost: 50,
    requestedAt: '2026-07-15',
    scheduledAt: '2026-08-01',
    desiredDate: '2026-08-01',
    flexibilityDays: 1,
  },
  {
    id: 'so1c',
    serviceId: 's12',
    ownerId: 'o1',
    listingId: 'l1',
    status: 'VALIDE',
    pointsCost: 38,
    requestedAt: '2026-07-01',
    scheduledAt: '2026-07-05',
    completedAt: '2026-07-05',
    validatedAt: '2026-07-06',
    desiredDate: '2026-07-05',
    flexibilityDays: 0,
  },
  {
    id: 'so2',
    serviceId: 's9',
    ownerId: 'o1',
    listingId: 'l3',
    status: 'REALISE',
    pointsCost: 110,
    requestedAt: '2026-07-10',
    scheduledAt: '2026-07-12',
    completedAt: '2026-07-12',
    desiredDate: '2026-07-12',
    flexibilityDays: 2,
  },
  {
    id: 'so3',
    serviceId: 's12',
    ownerId: 'o2',
    listingId: 'l2',
    status: 'PLANIFIE',
    pointsCost: 85,
    requestedAt: '2026-07-15',
    scheduledAt: '2026-07-20',
    desiredDate: '2026-07-20',
    flexibilityDays: 3,
  },
  {
    id: 'so4',
    serviceId: 's4',
    ownerId: 'o3',
    listingId: 'l4',
    status: 'DEMANDE',
    pointsCost: 330,
    requestedAt: '2027-07-18',
    desiredDate: '2027-08-15',
    flexibilityDays: 5,
  },
  {
    id: 'so5',
    serviceId: 's14',
    ownerId: 'o5',
    listingId: 'l6',
    status: 'VALIDE',
    pointsCost: 53,
    requestedAt: '2026-06-01',
    scheduledAt: '2026-06-05',
    completedAt: '2026-06-05',
    validatedAt: '2026-06-06',
    desiredDate: '2026-06-05',
    flexibilityDays: 1,
  },
]

export function getServicesByCategory(categoryId: string): Service[] {
  return services.filter((s) => s.categoryId === categoryId)
}

export function getServiceById(id: string): Service | undefined {
  return services.find((s) => s.id === id)
}

export function getServiceOrdersByOwner(ownerId: string): ServiceOrder[] {
  return serviceOrders.filter((so) => so.ownerId === ownerId)
}
