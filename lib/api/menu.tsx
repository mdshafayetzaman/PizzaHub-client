import type { MenuItems } from '../data'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

export const getMenuItems = async (query=''): Promise<MenuItems[]> => {
  const res = await fetch(`${BASE_URL}/menuItem?${query}`, {
    cache: 'no-store',
  })

  const contentType = res.headers.get('content-type')

  if (!contentType?.includes('application/json')) {
    throw new Error('Backend API did not return JSON. Check API URL.')
  }

  const result: unknown = await res.json()

  if (!res.ok) {
    throw new Error('Failed to fetch menu items')
  }

  if (!Array.isArray(result)) {
    throw new Error('Invalid menu data received')
  }

  return result as MenuItems[]
}

export const updateMenuItem = async (id: string, data: MenuItems) => {
  const res = await fetch(`${BASE_URL}/menuItem/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const result = await res.json()

  if (!res.ok) {
    throw new Error(result.message || 'Failed to update menu item')
  }

  return result
}

export const deleteMenuItem = async (id: string) => {
  const res = await fetch(`${BASE_URL}/menuItem/${id}`, {
    method: 'DELETE',
  })

  const result = await res.json()

  if (!res.ok) {
    throw new Error(result.message || 'Failed to delete menu item')
  }

  return result
}
