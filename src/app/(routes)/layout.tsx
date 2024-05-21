import "@styles/globals.css"

import { cookies } from "next/headers"

import { CookiesProvider } from "next-client-cookies/server"

import { ClerkProvider } from "@clerk/nextjs"

import { type WithReactChildren, Theme } from "@types"

import { ThemeProvider } from "@providers"

import { App } from "./App"

export const metadata = {
  title: "Magi",
  description: "Magi",
}

export default function RootLayout({
  children,
}: WithReactChildren) {
  const cookieStore = cookies()
  const theme = cookieStore.get("theme")
    ? cookieStore.get("theme")!.value
    : Theme.light

  return (
    <ThemeProvider initialTheme={theme}>
      <ClerkProvider>
        <CookiesProvider>
          <App>{children}</App>
        </CookiesProvider>
      </ClerkProvider>
    </ThemeProvider>
  )
}
