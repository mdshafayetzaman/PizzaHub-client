import type { Metadata } from "next"

import SignInForm from "../sign-in-form"

export const metadata: Metadata = {
  title: "Sign in — PizzaHub",
  description:
    "Sign in to PizzaHub to reorder your favourites, track deliveries and unlock member-only offers.",
}

type SignInPageProps = {
  searchParams: Promise<{ callbackUrl?: string | string[] }>
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams
  const callbackUrl =
    typeof params.callbackUrl === "string" ? params.callbackUrl : undefined

  return <SignInForm callbackUrl={callbackUrl} />
}
