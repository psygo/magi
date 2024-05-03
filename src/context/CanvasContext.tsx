"use client"

import { createContext, useContext, useState } from "react"

import { type AppState } from "@excalidraw/excalidraw/types/types"
import { type ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"

import {
  type SelectNodeWithCreatorAndStats,
  type WithReactChildren,
  type NodesRecords,
} from "@types"

type CanvasContext = {
  nodes: NodesRecords
  setNodes: React.Dispatch<
    React.SetStateAction<NodesRecords>
  >
  excalElements: ExcalidrawElement[]
  setExcalElements: React.Dispatch<
    React.SetStateAction<ExcalidrawElement[]>
  >
  excalAppState: AppState
  setExcalAppState: React.Dispatch<
    React.SetStateAction<AppState>
  >
  getCurrentCanvasSearchParams: (
    appState?: AppState,
  ) => URLSearchParams
}

const CanvasContext = createContext<CanvasContext | null>(
  null,
)

export const standardInitialAppState: AppState = {
  scrollX: 0,
  scrollY: 0,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  zoom: { value: 0.8 },
}

export function nodesArrayToRecords(
  nodes: SelectNodeWithCreatorAndStats[],
) {
  const records: NodesRecords = {}
  nodes.forEach((n) => (records[n.excalId] = n))
  return records
}

export type CanvasProviderProps = WithReactChildren & {
  initialNodes?: SelectNodeWithCreatorAndStats[]
  initialAppState?: AppState
}

export function CanvasProvider({
  initialNodes = [],
  initialAppState = standardInitialAppState,
  children,
}: CanvasProviderProps) {
  const [nodes, setNodes] = useState<NodesRecords>(
    nodesArrayToRecords(initialNodes),
  )

  const [excalElements, setExcalElements] = useState<
    ExcalidrawElement[]
  >(
    initialNodes.map(
      (n) => n.excalData as ExcalidrawElement,
    ),
  )

  const [excalAppState, setExcalAppState] =
    useState<AppState>(initialAppState)

  function getCurrentCanvasSearchParams(
    appState?: AppState,
  ) {
    const state = appState ?? excalAppState

    const scrollX = Math.round(state.scrollX)
    const scrollY = Math.round(state.scrollY)
    const zoom = state.zoom.value.toFixed(2)

    const params = new URLSearchParams()
    params.set("scrollX", scrollX.toString())
    params.set("scrollY", scrollY.toString())
    params.set("zoom", zoom.toString())

    return params
  }

  return (
    <CanvasContext.Provider
      value={{
        nodes,
        setNodes,
        excalElements,
        setExcalElements,
        excalAppState,
        setExcalAppState,
        getCurrentCanvasSearchParams,
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
