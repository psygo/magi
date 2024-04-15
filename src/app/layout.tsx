import "@styles/globals.css"

import { Inter } from "next/font/google"

import { TopNav } from "@components"

import { cn } from "@styles"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata = {
  title: "Magnus Index",
  description: "Magnus Index",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "dark min-h-screen bg-background font-sans antialiased",
          inter.variable,
        )}
      >
        <TopNav />
        {children}
      </body>
    </html>
  )
}
