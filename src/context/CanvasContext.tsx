"use client"

import { createContext, useContext, useState } from "react"

import {
  type AppState,
  type ExcalidrawInitialDataState,
} from "@excalidraw/excalidraw/types/types"
import { type ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"

import { type WithReactChildren } from "@types"

import { type SelectNode } from "@server"

type CanvasContext = {
  excalElements: ExcalidrawElement[]
  setExcalElements: React.Dispatch<
    React.SetStateAction<ExcalidrawElement[]>
  >
  excalAppState: AppState
  setExcalAppState: React.Dispatch<
    React.SetStateAction<AppState>
  >
}

const CanvasContext = createContext<CanvasContext | null>(
  null,
)

export type CanvasProviderProps = WithReactChildren & {
  initialData?: ExcalidrawInitialDataState
  initialNodes?: SelectNode[]
}

export const initialAppState: AppState = {
  viewBackgroundColor: "#a5d8ff",
  scrollX: 0,
  scrollY: 0,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  zoom: { value: 1 },
}

export function CanvasProvider({
  initialNodes = [],
  children,
}: CanvasProviderProps) {
  const [excalElements, setExcalElements] = useState<
    ExcalidrawElement[]
  >(
    initialNodes.map(
      (n) => n.excalData as ExcalidrawElement,
    ),
  )
  const [excalAppState, setExcalAppState] =
    useState<AppState>(initialAppState)

  return (
    <CanvasContext.Provider
      value={{
        excalElements,
        setExcalElements,
        excalAppState,
        setExcalAppState,
      }}
    >
      {children}
    </CanvasContext.Provider>
  )
}

export function useCanvas() {
  const context = useContext(CanvasContext)

  if (!context) {
    throw new Error(
      "`useCanvas` must be used within a `CanvasProvider`.",
    )
  }

  return context
}
