import type { DashboardRole } from './roles'

/** Every category a menu item can belong to — also feeds the browse-menu filters. */
export const MENU_CATEGORIES = [
  'Classic',
  'Speciality',
  'Vegan',
  'Sides',
  'Desserts',
] as const

export type MenuCategory = (typeof MENU_CATEGORIES)[number]

export interface MenuItems {
  pizzaName: string
  category: string
  price: number
  preparationTime: string
  availableDate: string
  imageUrl: string
  description: string
}

export const VENDOR_MENU_ITEMS: MenuItems[] = []

export type MenuItem = {
  id: string
  name: string
  description: string
  price: number
  category: MenuCategory
  image: string
  rating: number
  reviews: number
  popular?: boolean
  toppings: string[]
  calories: number
  prepTime: string
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Margherita Classic',
    description:
      'A timeless favourite with San Marzano tomato sauce, fresh mozzarella, fragrant basil, and a drizzle of extra virgin olive oil on our signature hand-stretched crust.',
    price: 12.99,
    category: 'Classic',
    image:
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=900&h=700&fit=crop',
    rating: 4.8,
    reviews: 124,
    popular: true,
    toppings: ['Mozzarella', 'Tomato Sauce', 'Fresh Basil', 'Olive Oil'],
    calories: 850,
    prepTime: '15-20 min',
  },
  {
    id: '2',
    name: 'Pepperoni Feast',
    description:
      'Loaded with crispy pepperoni slices, melted mozzarella, and our rich tomato sauce. A bold, savoury classic that never disappoints.',
    price: 14.99,
    category: 'Classic',
    image:
      'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=900&h=700&fit=crop',
    rating: 4.7,
    reviews: 98,
    popular: true,
    toppings: ['Pepperoni', 'Mozzarella', 'Tomato Sauce', 'Oregano'],
    calories: 980,
    prepTime: '15-20 min',
  },
  {
    id: '3',
    name: 'Garden Veggie',
    description:
      'A vibrant mix of bell peppers, red onions, mushrooms, black olives, and cherry tomatoes over a bed of mozzarella and herb tomato sauce.',
    price: 13.99,
    category: 'Vegan',
    image:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900&h=700&fit=crop',
    rating: 4.5,
    reviews: 76,
    toppings: ['Bell Peppers', 'Red Onion', 'Mushrooms', 'Olives', 'Cherry Tomatoes'],
    calories: 720,
    prepTime: '15-20 min',
  },
  {
    id: '4',
    name: 'Truffle Mushroom',
    description:
      'An indulgent speciality pizza with creamy truffle sauce, roasted mushrooms, mozzarella, parmesan, and fresh thyme on a crispy base.',
    price: 17.99,
    category: 'Speciality',
    image:
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900&h=700&fit=crop',
    rating: 4.9,
    reviews: 52,
    popular: true,
    toppings: ['Truffle Sauce', 'Mushrooms', 'Mozzarella', 'Parmesan', 'Thyme'],
    calories: 920,
    prepTime: '20-25 min',
  },
]

export type OrderStatus =
  | 'pending'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'

export type OrderItem = {
  name: string
  qty: number
  price: number
}

export type Order = {
  id: string
  customer: string
  email: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  placedAt: string
  address: string
}

export const ORDERS: Order[] = []

export type ManagedUser = {
  id: string
  name: string
  email: string
  role: DashboardRole
  status: 'active' | 'suspended'
  joined: string
  orders: number
}

export const USERS: ManagedUser[] = []

export type TransactionStatus = 'paid' | 'refunded' | 'failed'

export type TransactionMethod = 'card' | 'cash' | 'wallet'

export type Transaction = {
  id: string
  orderId: string
  customer: string
  amount: number
  method: TransactionMethod
  status: TransactionStatus
  date: string
}

export const TRANSACTIONS: Transaction[] = []

export function getMenuItem(id: string) {
  return MENU_ITEMS.find((item) => item.id === id)
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(value)
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

/* -------------------------------------------------------------------------- *
 * Browse menu — search & filter options
 * -------------------------------------------------------------------------- */

/** One `<option>` in a browse-menu filter. */
export type FilterOption = {
  value: string
  label: string
}

/** `all` first, then every `MenuCategory`. */
export const MENU_CATEGORY_OPTIONS: FilterOption[] = [
  { value: 'all', label: 'All categories' },
  ...MENU_CATEGORIES.map((category) => ({ value: category, label: category })),
]

/** Bucketed price ranges for `MenuItem.price`. */
export const PRICE_RANGE_OPTIONS: FilterOption[] = [
  { value: 'any', label: 'Any price' },
  { value: 'under-15', label: `Under ${formatPrice(15)}` },
  { value: '15-25', label: `${formatPrice(15)} – ${formatPrice(25)}` },
  { value: 'over-25', label: `${formatPrice(25)}+` },
]

/** Minimum `MenuItem.rating`. */
export const RATING_OPTIONS: FilterOption[] = [
  { value: 'any', label: 'Any rating' },
  { value: '4.5', label: '4.5 & up' },
  { value: '4.0', label: '4.0 & up' },
]

/** Default is the first entry. */
export const SORT_OPTIONS: FilterOption[] = [
  { value: 'popular', label: 'Most popular' },
  { value: 'rating', label: 'Top rated' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
]
