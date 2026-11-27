import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import { Toaster } from "sonner";
import "./globals.css";
import SiteChrome from "@/components/shared/site-chrome";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PizzaHub — Hot, fresh & hand-tossed",
  description:
    "Hand-tossed dough, slow-simmered sauce and generous toppings, fired fresh in our stone oven and delivered to your door.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Suspense fallback={null}>
          <SiteChrome>{children}</SiteChrome>
        </Suspense>
        <Toaster
          position="top-right"
          richColors
          theme="dark"
          closeButton
          toastOptions={{
            classNames: {
              toast:
                "border border-white/10 bg-[#1A1917] text-white shadow-lg shadow-black/40",
              title: "text-white font-semibold",
              description: "text-neutral-300",
              actionButton: "bg-orange-500 text-white hover:bg-orange-400",
              cancelButton: "bg-white/10 text-white hover:bg-white/20",
              success:
                "border-orange-500/30 [&_[data-icon]]:text-orange-400",
              error: "border-red-500/40 [&_[data-icon]]:text-red-400",
              warning:
                "border-amber-500/40 [&_[data-icon]]:text-amber-400",
              info: "border-sky-500/40 [&_[data-icon]]:text-sky-400",
            },
          }}
        />
      </body>
    </html>
  );
}
