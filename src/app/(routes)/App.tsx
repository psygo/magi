"use client"

import { Inter } from "next/font/google"

import { useTheme } from "@context"

import { type WithReactChildren } from "@types"

import { TopNav } from "@components"

import { cn } from "@styles"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export function App({ children }: WithReactChildren) {
  const { theme } = useTheme()

  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
          theme,
        )}
      >
        <TopNav />
        <main className="fixed">{children}</main>
      </body>
    </html>
  )
}
