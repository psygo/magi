"use client"

import { createContext, useContext, useState } from "react"

import {
  Theme,
  stringToTheme,
  type WithReactChildren,
} from "@types"

type ThemeContext = {
  theme: Theme
  setTheme: React.Dispatch<React.SetStateAction<Theme>>
  cycleTheme: () => Theme
}

const ThemeContext = createContext<ThemeContext | null>(
  null,
)

type ThemeProviderProps = WithReactChildren & {
  initialTheme?: string | Theme
}

export function ThemeProvider({
  initialTheme = Theme.light,
  children,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    stringToTheme(initialTheme),
  )

  function cycleTheme() {
    const themes = Object.values(Theme)
    const currentThemeIndex = themes.indexOf(theme)
    const length = themes.length
    const nextIndex = (currentThemeIndex + 1) % length
    const nextTheme = themes[nextIndex]!

    setTheme(nextTheme)

    return nextTheme
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        cycleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context)
    throw new Error(
      "`useTheme` must be used within a `ThemeProvider`.",
    )

  return context
}
