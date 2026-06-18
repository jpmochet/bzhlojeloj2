// ==========================================
// BZHlojeloj - Types & Interfaces
// ==========================================

// Property Types
export type PropertyType = 'T1' | 'T2' | 'T3' | 'T4'
export type PropertyKind = 'appartement' | 'maison'
export type SeaProximity = 'standard' | 'proche_mer' | 'vue_mer'
export type Season = 'basse' | 'moyenne' | 'haute'

// Annual Eligibility Status
export type AnnualEligibilityStatus = 
  | 'SEASONAL_ONLY' 
  | 'ELIGIBLE_ANNUAL' 
  | 'ANNUAL_PREBOOKED' 
  | 'ANNUAL_ACTIVE'

// Booking Status
export type BookingStatus = 'OPTION' | 'FERME' | 'COMPLETED' | 'CANCELLED'

// Service Order Status
export type ServiceOrderStatus = 'DEMANDE' | 'PLANIFIE' | 'REALISE' | 'VALIDE'

// ==========================================
// Listing / Property
// ==========================================
export interface Listing {
  id: string
  title: string
  description: string
  location: string
  city: string
  propertyType: PropertyType
  propertyKind: PropertyKind
  seaProximity: SeaProximity
  baseLowSeasonPrice: number // €/night base price
  images: string[]
  amenities: string[]
  bedrooms: number
  bathrooms: number
  maxGuests: number
  ownerId: string
  landArea?: number // m² - for house garden services
  terraceArea?: number // m² - for terrace/patio services

  // Annual conversion fields
  annualEligibilityStatus: AnnualEligibilityStatus
  requiredHousingPoints: number
  allocatedHousingPoints: number
  reservedFrom?: string

  // Flags
  isActive: boolean
  createdAt: string
}

// ==========================================
// Booking
// ==========================================
export interface Booking {
  id: string
  listingId: string
  guestId: string
  checkIn: string
  checkOut: string
  nights: number
  season: Season
  pricePerNight: number
  totalPrice: number
  status: BookingStatus
  isNPlus1: boolean // N+1 pre-booking
  
  // Commission breakdown
  commissionTotal: number
  commissionPlatform: number
  commissionHousing: number
  commissionServices: number
  
  // Points generated
  housingPointsGenerated: number
  servicePointsGenerated: number
  
  createdAt: string
  optionExpiresAt?: string // For J-90 rule
}

// ==========================================
// Services
// ==========================================
export interface ServiceCategory {
  id: string
  name: string
  description: string
}

export interface Service {
  id: string
  categoryId: string
  name: string
  description: string
  basePoints: number
  isActive: boolean
  // Size and type modifiers
  propertyTypeModifiers?: Record<PropertyType, number> // T1: 0.8, T2: 1.0, T3: 1.2, T4: 1.4
  propertyKindModifiers?: Record<PropertyKind, number> // appartement: 1.0, maison: 1.2
  // Availability restrictions
  availableFor?: {
    propertyTypes?: PropertyType[]
    propertyKinds?: PropertyKind[]
  }
}

export interface ServiceOrder {
  id: string
  serviceId: string
  ownerId: string
  listingId: string
  status: ServiceOrderStatus
  pointsCost: number
  requestedAt: string
  scheduledAt?: string
  completedAt?: string
  validatedAt?: string
  notes?: string
  desiredDate?: string
  flexibilityDays?: number
  proposedDates?: string[]
}

// ==========================================
// Owner
// ==========================================
export interface Owner {
  id: string
  name: string
  email: string
  servicePointsBalance: number
  listings: string[] // listing IDs
}

// ==========================================
// Pools
// ==========================================
export interface HousingPool {
  totalPoints: number
  totalEuros: number
  pointsEarned: number
  pointsSpent: number
  listingsConverted: number
}

export interface ServicesPool {
  totalPoints: number
  totalEuros: number
  servicesCompleted: number
}

// ==========================================
// Admin Configuration
// ==========================================
export interface SeasonConfig {
  basse: { multiplier: number; startMonth: number; endMonth: number }
  moyenne: { multiplier: number; startMonth: number; endMonth: number }
  haute: { multiplier: number; startMonth: number; endMonth: number }
}

export interface CommissionConfig {
  totalPct: number // e.g., 0.16 for 16%
  platformPct: number // e.g., 0.08
  housingPct: number // e.g., 0.05
  servicesPct: number // e.g., 0.03
}

export interface OccupationHypothesis {
  T1: { low: number; mid: number; high: number }
  T2: { low: number; mid: number; high: number }
  T3: { low: number; mid: number; high: number }
  T4: { low: number; mid: number; high: number }
}

export interface AnnualNightEquivalent {
  T1: number
  T2: number
  T3: number
  T4: number
}

export interface Coefficients {
  propertyType: { T1: number; T2: number; T3: number; T4: number }
  propertyKind: { appartement: number; maison: number }
  seaProximity: { standard: number; proche_mer: number; vue_mer: number }
}

export type NetOwnerFactorMode = 'traveler_pays_commission' | 'owner_pays_commission'

export interface ExpectedBookedNights {
  T1: number
  T2: number
  T3: number
  T4: number
}

export interface AdminConfig {
  seasonMultipliers: any
  expectedBookedNightsHigh: ExpectedBookedNights
  expectedBookedNightsMid: ExpectedBookedNights
  expectedBookedNightsLow: ExpectedBookedNights
  // Commission
  commission: CommissionConfig
  
  // Seasons
  seasons: SeasonConfig
  
  // Anticipation N+1
  optionBecomesFirmDays: number // J-90
  
  // Housing Pool
  eurPerHousingPoint: number
  annualNightEquivalent: AnnualNightEquivalent
  expectedOccupation: OccupationHypothesis
  netOwnerFactorMode: NetOwnerFactorMode
  eligibilityOrder: PropertyType[]
  withinTypeSorting: 'lowestRequiredPointsFirst' | 'highestScoreFirst'
  
  // Services
  eurPerServicePoint: number
  ownerSharePct: number // e.g., 1.0 for 100%
  poolSharePct: number // e.g., 0.0 for 0%
  coefficients: Coefficients
}

// ==========================================
// Impact Stats
// ==========================================
export interface ImpactStats {
  totalCollected: number
  totalHousingContribution: number
  totalServicesContribution: number
  housingPoolPoints: number
  servicesPoolPoints: number
  listingsEligibleAnnual: number
  listingsConvertedAnnual: number
  servicesCompleted: number
  totalBookings: number
  totalNights: number
}

// ==========================================
// Calculation Results
// ==========================================
export interface PriceCalculation {
  basePrice: number
  seasonMultiplier: number
  pricePerNight: number
  nights: number
  subtotal: number
  commissionTotal: number
  commissionPlatform: number
  commissionHousing: number
  commissionServices: number
  totalPrice: number
  housingPointsGenerated: number
  servicePointsGenerated: number
  seasonBreakdown?: Array<{
    season: Season
    nights: number
    pricePerNight: number
    subtotal: number
  }>
}

export interface DeltaCalculation {
  annualValue: number
  expectedSeasonalValue: number
  expectedSeasonalValueNet: number
  delta: number
  requiredHousingPoints: number
}
