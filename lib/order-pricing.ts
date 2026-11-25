export const PIZZA_SIZES = ['Small', 'Medium', 'Large'] as const
export type PizzaSize = (typeof PIZZA_SIZES)[number]

export const SIZE_MULTIPLIERS: Record<PizzaSize, number> = {
  Small: 1,
  Medium: 1.25,
  Large: 1.5,
}

export const TOPPING_PRICE = 1.5
export const DELIVERY_CHARGE = 3

export const EXTRA_TOPPINGS = [
  'Extra Cheese',
  'Mushrooms',
  'Olives',
  'Jalapeños',
  'Pepperoni',
  'Onions',
  'Bell Peppers',
] as const

export function roundMoney(n: number) {
  return Math.round((n + Number.EPSILON) * 100) / 100
}

export function calculateOrderTotals(params: {
  basePrice: number
  size: PizzaSize
  quantity: number
  extraToppings: string[]
}) {
  const unitPrice = roundMoney(params.basePrice * SIZE_MULTIPLIERS[params.size])
  const toppingsTotal = roundMoney(params.extraToppings.length * TOPPING_PRICE)
  const subtotal = roundMoney(unitPrice * params.quantity + toppingsTotal)
  const deliveryCharge = roundMoney(DELIVERY_CHARGE)
  const total = roundMoney(subtotal + deliveryCharge)

  return { unitPrice, toppingsTotal, subtotal, deliveryCharge, total }
}
