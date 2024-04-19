"use client"

import { createContext, useContext, useState } from "react"

import { type ExcalidrawInitialDataState } from "@excalidraw/excalidraw/types/types"
import { type ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"

import {
  type WithReactChildren,
  type ExcalAppState,
} from "@types"

type CanvasContext = {
  excalElements: ExcalidrawElement[]
  setExcalElements: React.Dispatch<
    React.SetStateAction<ExcalidrawElement[]>
  >
  excalAppState: ExcalAppState
  setExcalAppState: React.Dispatch<
    React.SetStateAction<ExcalAppState>
  >
}

const CanvasContext = createContext<CanvasContext | null>(
  null,
)

type CanvasProviderProps = WithReactChildren & {
  initialData?: ExcalidrawInitialDataState
}

const defaultInitialData: ExcalidrawInitialDataState = {
  elements: [],
  appState: {
    viewBackgroundColor: "#a5d8ff",
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    zoom: { value: 1 },
  },
  scrollToContent: true,
}

export function CanvasProvider({
  initialData = defaultInitialData,
  children,
}: CanvasProviderProps) {
  const [excalElements, setExcalElements] = useState<
    ExcalidrawElement[]
  >([...initialData.elements!])
  const [excalAppState, setExcalAppState] =
    useState<ExcalAppState>(initialData.appState)

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
