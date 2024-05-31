"use client"

import { createContext, useContext, useState } from "react"

import { type WithReactChildren } from "@types"

type PreferencesContext = {
  showMeta: boolean
  setShowMeta: React.Dispatch<React.SetStateAction<boolean>>
  gridModeEnabled: boolean
  setGridModeEnabled: React.Dispatch<
    React.SetStateAction<boolean>
  >
  showCoords: boolean
  setShowCoords: React.Dispatch<
    React.SetStateAction<boolean>
  >
}

const PreferencesContext =
  createContext<PreferencesContext | null>(null)

export function PreferencesProvider({
  children,
}: WithReactChildren) {
  const [showMeta, setShowMeta] = useState(true)
  const [gridModeEnabled, setGridModeEnabled] =
    useState(true)
  const [showCoords, setShowCoords] = useState(true)

  return (
    <PreferencesContext.Provider
      value={{
        showMeta,
        setShowMeta,
        gridModeEnabled,
        setGridModeEnabled,
        showCoords,
        setShowCoords,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  )
}

export function usePreferences() {
  const context = useContext(PreferencesContext)

  if (!context)
    throw new Error(
      "`usePreferences` must be used within a `PreferencesProvider`.",
    )

  return context
}
