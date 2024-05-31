"use client"

import { createContext, useContext, useState } from "react"

import {
  type ExcalidrawImperativeAPI,
  type AppState,
} from "@excalidraw/excalidraw/types/types"
import { type ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"

import {
  type SelectNodeWithCreatorAndStats,
  type WithReactChildren,
  type NodesRecords,
} from "@types"

import { PaginationProvider } from "./PaginationProvider"
import { ShapesProvider } from "./ShapeProvider"
import { FilesProvider } from "./FilesProvider"

type CanvasContext = {
  excalidrawAPI: ExcalidrawImperativeAPI | undefined
  setExcalidrawAPI: React.Dispatch<
    React.SetStateAction<
      ExcalidrawImperativeAPI | undefined
    >
  >
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
}

const CanvasContext = createContext<CanvasContext | null>(
  null,
)

export const standardInitialAppState: AppState = {
  scrollX: 0,
  scrollY: 0,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  zoom: { value: 1 },
}

export function nodesArrayToRecords(
  nodes: SelectNodeWithCreatorAndStats[],
) {
  const records: NodesRecords = {}
  nodes.forEach((n) => (records[n.excalId] = n))
  return records
}

type CanvasProviderProps = WithReactChildren & {
  initialNodes?: SelectNodeWithCreatorAndStats[]
  initialAppState?: AppState
}

export function CanvasProvider({
  initialNodes = [],
  initialAppState = standardInitialAppState,
  children,
}: CanvasProviderProps) {
  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI>()

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

  return (
    <CanvasContext.Provider
      value={{
        excalidrawAPI,
        setExcalidrawAPI,
        nodes,
        setNodes,
        excalElements,
        setExcalElements,
        excalAppState,
        setExcalAppState,
      }}
    >
      <PaginationProvider>
        <ShapesProvider>
          <FilesProvider>{children}</FilesProvider>
        </ShapesProvider>
      </PaginationProvider>
    </CanvasContext.Provider>
  )
}

export function useCanvas() {
  const context = useContext(CanvasContext)

  if (!context)
    throw new Error(
      "`useCanvas` must be used within a `CanvasProvider`.",
    )

  return context
}
