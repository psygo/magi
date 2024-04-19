import "@styles/globals.css"

import { cookies } from "next/headers"

import { ClerkProvider } from "@clerk/nextjs"

import { type WithReactChildren, Theme } from "@types"

import { ThemeProvider } from "@context"

import { App } from "./App"

export const metadata = {
  title: "Magnus Index",
  description: "Magnus Index",
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
        <App>{children}</App>
      </ClerkProvider>
    </ThemeProvider>
  )
}
