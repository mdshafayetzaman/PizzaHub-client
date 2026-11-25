import { redirect } from 'next/navigation'

type OrderPageProps = {
  params: Promise<{ id: string }>
}

export default async function LegacyOrderPage({ params }: OrderPageProps) {
  const { id } = await params
  redirect(`/menu/${id}/order`)
}
