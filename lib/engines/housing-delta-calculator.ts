import type { AdminConfig, DeltaCalculation, Listing, PropertyType } from '@/lib/types'

/**
 * Calculates the annual value of a property if rented year-round
 */
export function calculateAnnualValue(
  propertyType: PropertyType,
  config: AdminConfig
): number {
  const nightEquivalent = config.annualNightEquivalent[propertyType]
  return nightEquivalent * 365
}

/**
 * Calculates expected seasonal revenue based on occupation hypotheses
 */
export function calculateExpectedSeasonalValue(
  baseLowSeasonPrice: number,
  propertyType: PropertyType,
  config: AdminConfig
): number {
  const occupation = config.expectedOccupation[propertyType]
  const seasons = config.seasons

  const priceLow = baseLowSeasonPrice * seasons.basse.multiplier
  const priceMid = baseLowSeasonPrice * seasons.moyenne.multiplier
  const priceHigh = baseLowSeasonPrice * seasons.haute.multiplier

  return (
    occupation.low * priceLow +
    occupation.mid * priceMid +
    occupation.high * priceHigh
  )
}

/**
 * Gets the net owner factor based on commission mode
 */
export function getNetOwnerFactor(config: AdminConfig): number {
  if (config.netOwnerFactorMode === 'owner_pays_commission') {
    return 1 - config.commission.totalPct
  }
  return 1.0 // traveler_pays_commission
}

/**
 * Calculates the full delta and required points for annual conversion
 */
export function calculateHousingDelta(
  listing: Listing,
  config: AdminConfig
): DeltaCalculation {
  const annualValue = calculateAnnualValue(listing.propertyType, config)
  const expectedSeasonalValue = calculateExpectedSeasonalValue(
    listing.baseLowSeasonPrice,
    listing.propertyType,
    config
  )
  const netOwnerFactor = getNetOwnerFactor(config)
  const expectedSeasonalValueNet = expectedSeasonalValue * netOwnerFactor

  // Delta is the gap to compensate (if annual value > seasonal value)
  const delta = Math.max(0, annualValue - expectedSeasonalValueNet)

  // Points required to fund the conversion
  const requiredHousingPoints = Math.ceil(delta / config.eurPerHousingPoint)

  return {
    annualValue,
    expectedSeasonalValue,
    expectedSeasonalValueNet,
    delta,
    requiredHousingPoints,
  }
}

/**
 * Calculates remaining points needed for a listing to be fully funded
 */
export function calculateRemainingPoints(listing: Listing): number {
  return Math.max(0, listing.requiredHousingPoints - listing.allocatedHousingPoints)
}

/**
 * Calculates funding progress percentage
 */
export function calculateFundingProgress(listing: Listing): number {
  if (listing.requiredHousingPoints === 0) return 100
  return Math.min(
    100,
    (listing.allocatedHousingPoints / listing.requiredHousingPoints) * 100
  )
}

/**
 * Gets listings sorted by eligibility order and within-type sorting
 */
export function getSortedEligibleListings(
  listings: Listing[],
  config: AdminConfig
): Listing[] {
  return [...listings].sort((a, b) => {
    // First sort by eligibility order (property type)
    const orderA = config.eligibilityOrder.indexOf(a.propertyType)
    const orderB = config.eligibilityOrder.indexOf(b.propertyType)
    if (orderA !== orderB) return orderA - orderB

    // Within same type, sort by required points
    if (config.withinTypeSorting === 'lowestRequiredPointsFirst') {
      return a.requiredHousingPoints - b.requiredHousingPoints
    }
    return b.requiredHousingPoints - a.requiredHousingPoints
  })
}
