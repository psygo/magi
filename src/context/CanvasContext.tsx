"use client"

import { createContext, useContext, useState } from "react"

import { type ExcalidrawInitialDataState } from "@excalidraw/excalidraw/types/types"
import { type ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"

import {
  type WithReactChildren,
  type ExcalAppState,
} from "@types"

import { type SelectNode } from "@server"

type CanvasContext = {
  excalElements: ExcalidrawElement[]
  setExcalElements: React.Dispatch<
    React.SetStateAction<ExcalidrawElement[]>
  >
  excalAppState: ExcalAppState
  setExcalAppState: React.Dispatch<
    React.SetStateAction<ExcalAppState>
  >
  nodes: SelectNode[]
  setNodes: React.Dispatch<
    React.SetStateAction<SelectNode[]>
  >
}

const CanvasContext = createContext<CanvasContext | null>(
  null,
)

export type CanvasProviderProps = WithReactChildren & {
  initialData?: ExcalidrawInitialDataState
  initialNodes?: SelectNode[]
}

export const defaultInitialData: ExcalidrawInitialDataState =
  {
    elements: [],
    appState: {
      viewBackgroundColor: "#a5d8ff",
      scrollX: 0,
      scrollY: 0,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      zoom: { value: 1 },
    },
    scrollToContent: true,
  }

export function CanvasProvider({
  initialData = defaultInitialData,
  initialNodes = [],
  children,
}: CanvasProviderProps) {
  const [excalElements, setExcalElements] = useState<
    ExcalidrawElement[]
  >([...initialData.elements!])
  const [excalAppState, setExcalAppState] =
    useState<ExcalAppState>(initialData.appState)

  const [nodes, setNodes] =
    useState<SelectNode[]>(initialNodes)

  return (
    <CanvasContext.Provider
      value={{
        excalElements,
        setExcalElements,
        excalAppState,
        setExcalAppState,
        nodes,
        setNodes,
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
