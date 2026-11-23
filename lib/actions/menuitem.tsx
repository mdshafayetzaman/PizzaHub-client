import { MenuItems } from '../data'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001'

export const createMenu = async (data: MenuItems) => {
  const res = await fetch(`${BASE_URL}/menuItem`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  return res.json()
}
