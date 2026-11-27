import type { Metadata } from "next"
import { Suspense } from "react"

import SignInForm from "../sign-in-form"

export const metadata: Metadata = {
  title: "Sign in — PizzaHub",
  description:
    "Sign in to PizzaHub to reorder your favourites, track deliveries and unlock member-only offers.",
}

type SignInPageProps = {
  searchParams: Promise<{ callbackUrl?: string | string[] }>
}

async function SignInFormWithCallback({
  searchParams,
}: {
  searchParams: SignInPageProps["searchParams"]
}) {
  const params = await searchParams
  const callbackUrl =
    typeof params.callbackUrl === "string" ? params.callbackUrl : undefined

  return <SignInForm callbackUrl={callbackUrl} />
}

export default function SignInPage({ searchParams }: SignInPageProps) {
  return (
    <Suspense fallback={<SignInForm />}>
      <SignInFormWithCallback searchParams={searchParams} />
    </Suspense>
  )
}
