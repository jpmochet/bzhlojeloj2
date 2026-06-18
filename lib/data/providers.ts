export interface ServiceProvider {
  id: string
  name: string
  email: string
  phone: string
  siret: string
  businessName: string
  city: string
  description: string
  specialties: string[] // service categories they can do
  isActive: boolean
  createdAt: string
  rating?: number
  completedServices?: number
}

export interface NeighboringCity {
  [key: string]: string[]
}

// Map of cities and their neighboring cities
export const neighboringCities: NeighboringCity = {
  'Saint-Malo': ['Dinard', 'Cancale', 'Dinan'],
  'Dinard': ['Saint-Malo', 'Cancale'],
  'Cancale': ['Saint-Malo', 'Dinard'],
  'Dinan': ['Saint-Malo', 'Paimpont'],
  'Paimpont': ['Dinan', 'Vannes'],
  'Brest': ['Concarneau', 'Trebeurden'],
  'Quimper': ['Concarneau', 'Vannes'],
  'Concarneau': ['Brest', 'Quimper', 'Trebeurden'],
  'Trebeurden': ['Brest', 'Concarneau', 'Belle-Ile-en-Mer'],
  'Vannes': ['Quimper', 'Paimpont', 'Belle-Ile-en-Mer'],
  'Belle-Ile-en-Mer': ['Vannes', 'Trebeurden'],
}

export const serviceProviders: ServiceProvider[] = [
  {
    id: 'sp1',
    name: 'Pierre Leblanc',
    email: 'pierre.leblanc@email.com',
    phone: '+33612345678',
    siret: '12345678901234',
    businessName: 'Jardins Bretons SARL',
    city: 'Saint-Malo',
    description: 'Expert en jardinage et entretien d\'espaces verts depuis 10 ans',
    specialties: ['cat1'], // Jardinage
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
    specialties: ['cat3'], // Menage
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
    specialties: ['cat2'], // Entretien
    isActive: true,
    createdAt: '2024-01-20',
    rating: 4.7,
    completedServices: 43,
  },
  {
    id: 'sp4',
    name: 'Sophie Bernard',
    email: 'sophie.bernard@email.com',
    phone: '+33634567890',
    siret: '34567890123456',
    businessName: 'Conciergerie Prestige',
    city: 'Saint-Malo',
    description: 'Accueil, check-in/check-out et gestion concierge',
    specialties: ['cat4'], // Conciergerie
    isActive: true,
    createdAt: '2024-02-10',
    rating: 4.9,
    completedServices: 120,
  },
  {
    id: 'sp5',
    name: 'Thomas Girard',
    email: 'thomas.girard@email.com',
    phone: '+33712345678',
    siret: '90123456789012',
    businessName: 'Surveillance Immobilière Bretagne',
    city: 'Dinan',
    description: 'Visite, hivernage et surveillance de propriétés',
    specialties: ['cat5'], // Surveillance
    isActive: true,
    createdAt: '2024-01-05',
    rating: 4.6,
    completedServices: 31,
  },
]

export function getProvidersByCity(city: string): ServiceProvider[] {
  const citiesInZone = [city, ...(neighboringCities[city] || [])]
  return serviceProviders.filter(p => citiesInZone.includes(p.city) && p.isActive)
}

export function getProvidersBySpecialty(categoryId: string): ServiceProvider[] {
  return serviceProviders.filter(p => p.specialties.includes(categoryId) && p.isActive)
}

export function getProviderById(id: string): ServiceProvider | undefined {
  return serviceProviders.find(p => p.id === id)
}
