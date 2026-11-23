import type { DashboardRole } from './roles'

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=1200&auto=format&fit=crop`

export type MenuCategory =
  | 'Classic'
  | 'Speciality'
  | 'Vegan'
  | 'Sides'
  | 'Desserts'

export interface MenuItems {
  pizzaName: string
  category: string
  price: number
  preparationTime: string
  availableDate: string
  imageUrl: string
  description: string
}

export const VENDOR_MENU_ITEMS: MenuItems[] = [
  {
    pizzaName: 'Italian Margherita Pizza',
    category: 'classic',
    price: 12.99,
    preparationTime: '15-20 minutes',
    availableDate: '2026-11-20',
    imageUrl: img('1574071318508-1cdbab80d002'),
    description:
      'San Marzano tomato, fior di latte mozzarella and fresh basil on a hand-stretched base.',
  },
  {
    pizzaName: 'Double Cheese Burst Pizza',
    category: 'cheese',
    price: 14.49,
    preparationTime: '20-25 minutes',
    availableDate: '2026-11-21',
    imageUrl: img('1513104890138-7c749659a591'),
    description:
      'Mozzarella, cheddar and parmesan melted into a golden, bubbly cheese crust.',
  },
  {
    pizzaName: 'Chicken Tikka Pizza',
    category: 'chicken',
    price: 16.99,
    preparationTime: '25-30 minutes',
    availableDate: '2026-11-22',
    imageUrl: img('1593560708920-61dd98c46a4e'),
    description:
      'Tandoori spiced chicken, red onion, capsicum and mozzarella with a mint drizzle.',
  },
  {
    pizzaName: 'Garden Vegetarian Pizza',
    category: 'vegetarian',
    price: 13.49,
    preparationTime: '15-20 minutes',
    availableDate: '2026-11-19',
    imageUrl: img('1585238342024-78d387f4a707'),
    description:
      'Roasted peppers, courgette, sweetcorn, olives and onion on a crisp thin crust.',
  },
  {
    pizzaName: 'Smoky BBQ Special Pizza',
    category: 'special',
    price: 18.99,
    preparationTime: '25-30 minutes',
    availableDate: '2026-11-23',
    imageUrl: img('1565299624946-b28f40a0ae38'),
    description:
      'Char-grilled chicken, smoky BBQ sauce, red onion and mozzarella finished with coriander.',
  },
  {
    pizzaName: 'Pepperoni Classica Pizza',
    category: 'classic',
    price: 15.99,
    preparationTime: '20-25 minutes',
    availableDate: '2026-11-20',
    imageUrl: img('1595295333158-4742f28fbd85'),
    description:
      'Double pepperoni, mozzarella and a drizzle of hot honey over slow-simmered tomato sauce.',
  },
  {
    pizzaName: 'Four Cheese Lover Pizza',
    category: 'cheese',
    price: 17.49,
    preparationTime: '20-25 minutes',
    availableDate: '2026-11-24',
    imageUrl: img('1571407970349-bc81e7e96d47'),
    description:
      'Mozzarella, gorgonzola, fontina and parmesan with a touch of cream and cracked pepper.',
  },
  {
    pizzaName: 'Peri Peri Chicken Pizza',
    category: 'chicken',
    price: 17.99,
    preparationTime: '25-30 minutes',
    availableDate: '2026-11-25',
    imageUrl: img('1569058242253-92a9c755a0ec'),
    description:
      'Peri peri chicken, jalapeño, red onion and mozzarella with a fiery chilli oil finish.',
  },
  {
    pizzaName: 'Vegan Margherita Pizza',
    category: 'vegetarian',
    price: 13.99,
    preparationTime: '15-20 minutes',
    availableDate: '2026-11-21',
    imageUrl: img('1604382354936-07c5d9983bd3'),
    description:
      'Tomato, plant-based mozzarella, basil and garlic oil. Dairy-free and full of flavour.',
  },
  {
    pizzaName: 'Truffle Mushroom Special Pizza',
    category: 'special',
    price: 19.99,
    preparationTime: '25-30 minutes',
    availableDate: '2026-11-26',
    imageUrl: img('1571877227200-a0d98ea607e9'),
    description:
      'Wild mushrooms, truffle cream, mozzarella and thyme on a blistered stone-baked base.',
  },
]


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
    id: 'margherita',
    name: 'Margherita Classica',
    description:
      'San Marzano tomato, fior di latte mozzarella and fresh basil on a hand-stretched base.',
    price: 12.99,
    category: 'Classic',
    image: img('1574071318508-1cdbab80d002'),
    rating: 4.8,
    reviews: 412,
    popular: true,
    toppings: ['Tomato', 'Mozzarella', 'Basil', 'Olive oil'],
    calories: 820,
    prepTime: '12 min',
  },
  {
    id: 'pepperoni',
    name: 'Pepperoni Diavolo',
    description:
      'Double pepperoni, mozzarella and a drizzle of hot honey over slow-simmered tomato sauce.',
    price: 14.99,
    category: 'Classic',
    image: img('1565299624946-b28f40a0ae38'),
    rating: 4.9,
    reviews: 588,
    popular: true,
    toppings: ['Pepperoni', 'Mozzarella', 'Hot honey', 'Oregano'],
    calories: 980,
    prepTime: '14 min',
  },
  {
    id: 'quattro-formaggi',
    name: 'Quattro Formaggi',
    description:
      'Mozzarella, gorgonzola, fontina and parmesan with a touch of cream and cracked pepper.',
    price: 15.49,
    category: 'Classic',
    image: img('1513104890138-7c749659a591'),
    rating: 4.7,
    reviews: 356,
    toppings: ['Mozzarella', 'Gorgonzola', 'Fontina', 'Parmesan'],
    calories: 1040,
    prepTime: '13 min',
  },
  {
    id: 'bbq-chicken',
    name: 'Smoky BBQ Chicken',
    description:
      'Char-grilled chicken, red onion, smoky BBQ sauce and mozzarella, finished with coriander.',
    price: 16.99,
    category: 'Speciality',
    image: img('1593560708920-61dd98c46a4e'),
    rating: 4.6,
    reviews: 274,
    popular: true,
    toppings: ['Chicken', 'BBQ sauce', 'Red onion', 'Coriander'],
    calories: 910,
    prepTime: '16 min',
  },
  {
    id: 'truffle-mushroom',
    name: 'Truffle Mushroom',
    description:
      'Wild mushrooms, truffle cream, mozzarella and thyme on a blistered stone-baked base.',
    price: 18.49,
    category: 'Speciality',
    image: img('1571407970349-bc81e7e96d47'),
    rating: 4.9,
    reviews: 198,
    toppings: ['Mushroom', 'Truffle cream', 'Mozzarella', 'Thyme'],
    calories: 870,
    prepTime: '15 min',
  },
  {
    id: 'spicy-diavola',
    name: 'Spicy Diavola',
    description:
      'Pepperoni, calabrian chilli, mozzarella and tomato with a fiery chilli oil finish.',
    price: 16.49,
    category: 'Speciality',
    image: img('1595295333158-4742f28fbd85'),
    rating: 4.7,
    reviews: 241,
    toppings: ['Pepperoni', 'Calabrian chilli', 'Mozzarella', 'Chilli oil'],
    calories: 950,
    prepTime: '14 min',
  },
  {
    id: 'veggie-supreme',
    name: 'Veggie Supreme',
    description:
      'Roasted peppers, courgette, red onion, sweetcorn, olives and mozzarella.',
    price: 13.99,
    category: 'Vegan',
    image: img('1585238342024-78d387f4a707'),
    rating: 4.5,
    reviews: 167,
    toppings: ['Peppers', 'Courgette', 'Red onion', 'Olives'],
    calories: 760,
    prepTime: '13 min',
  },
  {
    id: 'vegan-margherita',
    name: 'Vegan Margherita',
    description:
      'Tomato, plant-based mozzarella, basil and garlic oil. Dairy-free and full of flavour.',
    price: 13.49,
    category: 'Vegan',
    image: img('1604382354936-07c5d9983bd3'),
    rating: 4.4,
    reviews: 132,
    toppings: ['Tomato', 'Vegan mozzarella', 'Basil', 'Garlic oil'],
    calories: 690,
    prepTime: '12 min',
  },
  {
    id: 'garlic-bread',
    name: 'Truffle Garlic Bread',
    description:
      'Stone-baked flatbread, roasted garlic butter, mozzarella and a truffle oil drizzle.',
    price: 6.49,
    category: 'Sides',
    image: img('1573140247632-f8fd74997d5c'),
    rating: 4.6,
    reviews: 221,
    toppings: ['Garlic butter', 'Mozzarella', 'Parsley', 'Truffle oil'],
    calories: 420,
    prepTime: '8 min',
  },
  {
    id: 'chicken-wings',
    name: 'Honey Glazed Wings',
    description:
      'Crispy chicken wings tossed in honey glaze with sesame and spring onion.',
    price: 8.99,
    category: 'Sides',
    image: img('1569058242253-92a9c755a0ec'),
    rating: 4.5,
    reviews: 188,
    toppings: ['Chicken wings', 'Honey glaze', 'Sesame', 'Spring onion'],
    calories: 540,
    prepTime: '10 min',
  },
  {
    id: 'tiramisu',
    name: 'Classic Tiramisu',
    description:
      'Espresso-soaked savoiardi layered with mascarpone cream and a cocoa dusting.',
    price: 7.49,
    category: 'Desserts',
    image: img('1571877227200-a0d98ea607e9'),
    rating: 4.8,
    reviews: 154,
    toppings: ['Mascarpone', 'Espresso', 'Cocoa', 'Savoiardi'],
    calories: 380,
    prepTime: '5 min',
  },
  {
    id: 'panna-cotta',
    name: 'Vanilla Panna Cotta',
    description:
      'Silky vanilla panna cotta with a berry coulis and toasted pistachio.',
    price: 6.99,
    category: 'Desserts',
    image: img('1488477181946-6428a0291777'),
    rating: 4.7,
    reviews: 121,
    toppings: ['Vanilla', 'Berry coulis', 'Pistachio'],
    calories: 310,
    prepTime: '4 min',
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

export const ORDERS: Order[] = [
  {
    id: 'PH-1001',
    customer: 'Amelia Rahman',
    email: 'amelia@example.com',
    items: [
      { name: 'Pepperoni Diavolo', qty: 1, price: 14.99 },
      { name: 'Truffle Garlic Bread', qty: 1, price: 6.49 },
    ],
    total: 21.48,
    status: 'out_for_delivery',
    placedAt: '2026-11-21T18:05:00Z',
    address: '22 Baker Street, London',
  },
  {
    id: 'PH-1002',
    customer: 'Daniel Okafor',
    email: 'daniel@example.com',
    items: [{ name: 'Margherita Classica', qty: 2, price: 12.99 }],
    total: 25.98,
    status: 'preparing',
    placedAt: '2026-11-21T18:12:00Z',
    address: '8 Camden High Street, London',
  },
  {
    id: 'PH-1003',
    customer: 'Sofia Marino',
    email: 'sofia@example.com',
    items: [
      { name: 'Truffle Mushroom', qty: 1, price: 18.49 },
      { name: 'Classic Tiramisu', qty: 1, price: 7.49 },
    ],
    total: 25.98,
    status: 'delivered',
    placedAt: '2026-11-21T17:40:00Z',
    address: '14 Notting Hill Gate, London',
  },
  {
    id: 'PH-1004',
    customer: 'Liam Chen',
    email: 'liam@example.com',
    items: [
      { name: 'Spicy Diavola', qty: 1, price: 16.49 },
      { name: 'Honey Glazed Wings', qty: 1, price: 8.99 },
    ],
    total: 25.48,
    status: 'pending',
    placedAt: '2026-11-21T18:22:00Z',
    address: '3 Shoreditch High Street, London',
  },
  {
    id: 'PH-1005',
    customer: 'Priya Nair',
    email: 'priya@example.com',
    items: [
      { name: 'Vegan Margherita', qty: 1, price: 13.49 },
      { name: 'Vanilla Panna Cotta', qty: 1, price: 6.99 },
    ],
    total: 20.48,
    status: 'delivered',
    placedAt: '2026-11-21T17:15:00Z',
    address: '56 Brixton Hill, London',
  },
  {
    id: 'PH-1006',
    customer: 'Noah Williams',
    email: 'noah@example.com',
    items: [{ name: 'Smoky BBQ Chicken', qty: 1, price: 16.99 }],
    total: 16.99,
    status: 'cancelled',
    placedAt: '2026-11-21T16:50:00Z',
    address: '91 Greenwich High Road, London',
  },
  {
    id: 'PH-1007',
    customer: 'Emma Rossi',
    email: 'emma@example.com',
    items: [
      { name: 'Quattro Formaggi', qty: 1, price: 15.49 },
      { name: 'Truffle Garlic Bread', qty: 2, price: 6.49 },
    ],
    total: 28.47,
    status: 'out_for_delivery',
    placedAt: '2026-11-21T18:18:00Z',
    address: '4 Clapham Common, London',
  },
  {
    id: 'PH-1008',
    customer: 'Lucas Silva',
    email: 'lucas@example.com',
    items: [{ name: 'Veggie Supreme', qty: 1, price: 13.99 }],
    total: 13.99,
    status: 'preparing',
    placedAt: '2026-11-21T18:25:00Z',
    address: '77 Islington Park Street, London',
  },
]

export type ManagedUser = {
  id: string
  name: string
  email: string
  role: DashboardRole
  status: 'active' | 'suspended'
  joined: string
  orders: number
}

export const USERS: ManagedUser[] = [
  {
    id: 'u1',
    name: 'Amelia Rahman',
    email: 'amelia@example.com',
    role: 'customer',
    status: 'active',
    joined: '2026-02-11',
    orders: 24,
  },
  {
    id: 'u2',
    name: 'Daniel Okafor',
    email: 'daniel@example.com',
    role: 'customer',
    status: 'active',
    joined: '2026-03-04',
    orders: 12,
  },
  {
    id: 'u3',
    name: 'Sofia Marino',
    email: 'sofia@example.com',
    role: 'vendor',
    status: 'active',
    joined: '2025-11-19',
    orders: 1480,
  },
  {
    id: 'u4',
    name: 'Liam Chen',
    email: 'liam@example.com',
    role: 'customer',
    status: 'suspended',
    joined: '2026-05-27',
    orders: 3,
  },
  {
    id: 'u5',
    name: 'Priya Nair',
    email: 'priya@example.com',
    role: 'admin',
    status: 'active',
    joined: '2025-09-02',
    orders: 0,
  },
  {
    id: 'u6',
    name: 'Noah Williams',
    email: 'noah@example.com',
    role: 'vendor',
    status: 'active',
    joined: '2026-01-15',
    orders: 964,
  },
  {
    id: 'u7',
    name: 'Emma Rossi',
    email: 'emma@example.com',
    role: 'customer',
    status: 'active',
    joined: '2026-04-08',
    orders: 31,
  },
  {
    id: 'u8',
    name: 'Lucas Silva',
    email: 'lucas@example.com',
    role: 'vendor',
    status: 'suspended',
    joined: '2026-06-21',
    orders: 210,
  },
]

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

export const TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN-9001',
    orderId: 'PH-1001',
    customer: 'Amelia Rahman',
    amount: 21.48,
    method: 'card',
    status: 'paid',
    date: '2026-11-21T18:05:00Z',
  },
  {
    id: 'TXN-9002',
    orderId: 'PH-1002',
    customer: 'Daniel Okafor',
    amount: 25.98,
    method: 'wallet',
    status: 'paid',
    date: '2026-11-21T18:12:00Z',
  },
  {
    id: 'TXN-9003',
    orderId: 'PH-1003',
    customer: 'Sofia Marino',
    amount: 25.98,
    method: 'card',
    status: 'paid',
    date: '2026-11-21T17:40:00Z',
  },
  {
    id: 'TXN-9004',
    orderId: 'PH-1004',
    customer: 'Liam Chen',
    amount: 25.48,
    method: 'card',
    status: 'failed',
    date: '2026-11-21T18:22:00Z',
  },
  {
    id: 'TXN-9005',
    orderId: 'PH-1005',
    customer: 'Priya Nair',
    amount: 20.48,
    method: 'wallet',
    status: 'paid',
    date: '2026-11-21T17:15:00Z',
  },
  {
    id: 'TXN-9006',
    orderId: 'PH-1006',
    customer: 'Noah Williams',
    amount: 16.99,
    method: 'cash',
    status: 'refunded',
    date: '2026-11-21T16:50:00Z',
  },
  {
    id: 'TXN-9007',
    orderId: 'PH-1007',
    customer: 'Emma Rossi',
    amount: 28.47,
    method: 'card',
    status: 'paid',
    date: '2026-11-21T18:18:00Z',
  },
  {
    id: 'TXN-9008',
    orderId: 'PH-1008',
    customer: 'Lucas Silva',
    amount: 13.99,
    method: 'wallet',
    status: 'paid',
    date: '2026-11-21T18:25:00Z',
  },
]

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
