import type { Metadata } from "next"

import SignInForm from "../sign-in-form"

export const metadata: Metadata = {
  title: "Sign in — PizzaHub",
  description:
    "Sign in to PizzaHub to reorder your favourites, track deliveries and unlock member-only offers.",
}

export default function SignInPage() {
  return <SignInForm />
}
