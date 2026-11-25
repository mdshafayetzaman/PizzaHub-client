import { createMenuItem, type MenuItemInput } from '@/lib/api/menu'

export const createMenu = async (data: MenuItemInput) => {
  return createMenuItem(data)
}
