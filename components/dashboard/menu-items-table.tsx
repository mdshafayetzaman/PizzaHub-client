import Image from 'next/image'
import { Star } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import {
  DataTable,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@/components/dashboard/data-table'
import { MenuRowActions } from '@/components/dashboard/row-actions'
import { formatPrice, type MenuItem } from '@/lib/data'

type MenuItemsTableProps = {
  items?: MenuItem[]
  editable?: boolean
  editHref?: string
}

export default function MenuItemsTable({
  items,
  editable = false,
  editHref = '#',
}: MenuItemsTableProps) {
  const rows = items ?? []
  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-14 text-center text-sm text-neutral-500">
        No menu items yet. Add your first slice to get started.
      </div>
    )
  }

  return (
    <DataTable>
      <Thead>
        <Tr>
          <Th>Item</Th>
          <Th>Category</Th>
          <Th>Price</Th>
          <Th>Rating</Th>
          <Th>Popular</Th>
          {editable && <Th className="text-right">Actions</Th>}
        </Tr>
      </Thead>

      <Tbody>
        {rows.map((item) => (
          <Tr key={item.id}>
            <Td>
              <div className="flex items-center gap-3">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={44}
                  height={44}
                  className="size-11 shrink-0 rounded-xl object-cover ring-1 ring-white/10"
                />
                <div className="min-w-0">
                  <p className="truncate font-bold text-white">{item.name}</p>
                  <p className="max-w-72 truncate text-xs text-neutral-500">
                    {item.description}
                  </p>
                </div>
              </div>
            </Td>
            <Td>
              <Badge
                variant={
                  item.category === 'Vegan'
                    ? 'emerald'
                    : item.category === 'Speciality'
                      ? 'violet'
                      : item.category === 'Sides'
                        ? 'sky'
                        : item.category === 'Desserts'
                          ? 'amber'
                          : 'orange'
                }
              >
                {item.category}
              </Badge>
            </Td>
            <Td className="font-bold text-white">
              {formatPrice(item.price)}
            </Td>
            <Td>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-300">
                <Star className="size-3 fill-amber-300" aria-hidden />
                {item.rating.toFixed(1)}
              </span>
            </Td>
            <Td>
              {item.popular ? (
                <Badge variant="orange">Popular</Badge>
              ) : (
                <span className="text-xs text-neutral-600">—</span>
              )}
            </Td>
            {editable && (
              <Td className="text-right">
                <MenuRowActions editHref={editHref} />
              </Td>
            )}
          </Tr>
        ))}
      </Tbody>
    </DataTable>
  )
}
