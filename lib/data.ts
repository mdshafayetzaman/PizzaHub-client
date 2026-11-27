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
  isAvailable: boolean
  /** True for local/demo catalog items that have no real MongoDB _id. */
  isDemo?: boolean
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
    isAvailable: true,
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
    isAvailable: true,
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
    isAvailable: true,
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
    isAvailable: true,
  },
  {
    id: '5',
    name: 'BBQ Chicken Supreme',
    description:
      'Smoky BBQ sauce, tender grilled chicken, red onions, and mozzarella finished with a sweet and tangy drizzle.',
    price: 15.99,
    category: 'Speciality',
    image:
      'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=900&h=700&fit=crop',
    rating: 4.6,
    reviews: 89,
    popular: true,
    toppings: ['BBQ Chicken', 'Red Onion', 'Mozzarella', 'BBQ Sauce'],
    calories: 940,
    prepTime: '20-25 min',
    isAvailable: true,
  },
  {
    id: '6',
    name: 'Spicy Diablo',
    description:
      'A fiery combination of spicy salami, jalapeños, chilli flakes, and mozzarella on a rich tomato base for heat lovers.',
    price: 15.49,
    category: 'Speciality',
    image:
      'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=900&h=700&fit=crop',
    rating: 4.4,
    reviews: 67,
    toppings: ['Spicy Salami', 'Jalapeños', 'Chilli Flakes', 'Mozzarella'],
    calories: 960,
    prepTime: '15-20 min',
    isAvailable: true,
  },
  {
    id: '7',
    name: 'Hawaiian Paradise',
    description:
      'Sweet pineapple chunks, smoky ham, and melted mozzarella on a golden crust for the perfect sweet-savoury balance.',
    price: 14.49,
    category: 'Classic',
    image:
      'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=900&h=700&fit=crop',
    rating: 4.2,
    reviews: 73,
    toppings: ['Ham', 'Pineapple', 'Mozzarella', 'Tomato Sauce'],
    calories: 890,
    prepTime: '15-20 min',
    isAvailable: true,
  },
  {
    id: '8',
    name: 'Vegan Pesto Delight',
    description:
      'Dairy-free mozzarella, roasted zucchini, sun-dried tomatoes, and basil pesto on a crisp plant-based crust.',
    price: 16.49,
    category: 'Vegan',
    image:
      'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=900&h=700&fit=crop',
    rating: 4.6,
    reviews: 41,
    toppings: ['Vegan Mozzarella', 'Zucchini', 'Sun-Dried Tomatoes', 'Basil Pesto'],
    calories: 690,
    prepTime: '15-20 min',
    isAvailable: true,
  },
  {
    id: '9',
    name: 'Four Cheese Melt',
    description:
      'A rich blend of mozzarella, cheddar, parmesan, and gorgonzola melted to perfection over creamy white sauce.',
    price: 15.99,
    category: 'Classic',
    image:
      'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=900&h=700&fit=crop',
    rating: 4.7,
    reviews: 110,
    popular: true,
    toppings: ['Mozzarella', 'Cheddar', 'Parmesan', 'Gorgonzola'],
    calories: 1020,
    prepTime: '15-20 min',
    isAvailable: true,
  },
  {
    id: '10',
    name: 'Garlic Bread Bites',
    description:
      'Warm, oven-baked bread bites brushed with garlic butter, herbs, and served with a side of marinara dip.',
    price: 6.99,
    category: 'Sides',
    image:
      'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=900&h=700&fit=crop',
    rating: 4.5,
    reviews: 64,
    toppings: ['Garlic Butter', 'Herbs', 'Marinara Dip'],
    calories: 420,
    prepTime: '10-12 min',
    isAvailable: true,
  },
  {
    id: '11',
    name: 'Chocolate Lava Dessert',
    description:
      'A warm chocolate dessert pizza with molten centre, dusted with cocoa and finished with a vanilla cream drizzle.',
    price: 8.99,
    category: 'Desserts',
    image:
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=900&h=700&fit=crop',
    rating: 4.8,
    reviews: 58,
    popular: true,
    toppings: ['Chocolate', 'Cocoa', 'Vanilla Cream'],
    calories: 560,
    prepTime: '12-15 min',
    isAvailable: true,
  },
  {
    id: '12',
    name: 'Mediterranean Olive',
    description:
      'A Mediterranean-inspired pizza topped with Kalamata olives, feta, roasted peppers, and oregano on a tomato base.',
    price: 14.99,
    category: 'Vegan',
    image:
      'https://images.unsplash.com/photo-1458642849426-cfb724f15ef7?w=900&h=700&fit=crop',
    rating: 4.3,
    reviews: 39,
    toppings: ['Kalamata Olives', 'Feta', 'Roasted Peppers', 'Oregano'],
    calories: 760,
    prepTime: '15-20 min',
    isAvailable: false,
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
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Top rated' },
]
