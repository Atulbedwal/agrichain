// Define the pricing rules
interface PricingRule {
  unitPrice: number
  specialQuantity?: number
  specialPrice?: number
}

export const pricingRules: Record<string, PricingRule> = {
  A: { unitPrice: 50, specialQuantity: 3, specialPrice: 130 },
  B: { unitPrice: 30, specialQuantity: 2, specialPrice: 45 },
  C: { unitPrice: 20 },
  D: { unitPrice: 15 },
}

/**
 * Calculates the total price of items based on the pricing rules
 * @param items A string of items (e.g., "AABCD")
 * @returns The total price
 */
export function calculateTotal(items: string): number {
  if (!items) return 0


  const itemCounts: Record<string, number> = {}

  for (const item of items) {
    if (pricingRules[item]) {
      itemCounts[item] = (itemCounts[item] || 0) + 1
    }
  }


  let total = 0

  for (const [item, count] of Object.entries(itemCounts)) {
    const rule = pricingRules[item]

    if (rule.specialQuantity && rule.specialPrice) {
      const specialDeals = Math.floor(count / rule.specialQuantity)
      const remainingItems = count % rule.specialQuantity

      total += specialDeals * rule.specialPrice
      total += remainingItems * rule.unitPrice
    } else {
      total += count * rule.unitPrice
    }
  }

  return total
}
