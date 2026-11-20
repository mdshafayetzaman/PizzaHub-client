import type { Metadata } from "next"

import SignUpForm from "@/components/auth/sign-up-form"

export const metadata: Metadata = {
  title: "Create an account — PizzaHub",
  description:
    "Create your PizzaHub account for faster checkout, saved favourites and exclusive offers.",
}

export default function SignUpPage() {
  return <SignUpForm />
}
