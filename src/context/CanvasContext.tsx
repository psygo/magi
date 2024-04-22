"use client"

import { createContext, useContext, useState } from "react"

import { type AppState } from "@excalidraw/excalidraw/types/types"
import { type ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"

import {
  type SelectNodeWithCreatorAndStats,
  type WithReactChildren,
  type SelectEdgeWithCreatorAndStats,
  type EdgesRecords,
  type NodesRecords,
} from "@types"

type CanvasContext = {
  nodes: NodesRecords
  setNodes: React.Dispatch<
    React.SetStateAction<NodesRecords>
  >
  edges: EdgesRecords
  setEdges: React.Dispatch<
    React.SetStateAction<EdgesRecords>
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

export const initialAppState: AppState = {
  viewBackgroundColor: "#a5d8ff",
  scrollX: 0,
  scrollY: 0,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  zoom: { value: 1 },
}

export function nodesOrEdgesArrayToRecords<
  T extends
    | SelectNodeWithCreatorAndStats
    | SelectEdgeWithCreatorAndStats,
  K extends NodesRecords | EdgesRecords,
>(nodesOrEdges: T[]) {
  const records: K = {} as K
  nodesOrEdges.forEach((n) => {
    records[n.excalId] = n
  })
  return records
}

export type CanvasProviderProps = WithReactChildren & {
  initialNodes?: SelectNodeWithCreatorAndStats[]
  initialEdges?: SelectEdgeWithCreatorAndStats[]
}

export function CanvasProvider({
  initialNodes = [],
  initialEdges = [],
  children,
}: CanvasProviderProps) {
  const [nodes, setNodes] = useState<NodesRecords>(
    nodesOrEdgesArrayToRecords(initialNodes),
  )
  const [edges, setEdges] = useState<EdgesRecords>(
    nodesOrEdgesArrayToRecords<
      SelectEdgeWithCreatorAndStats,
      EdgesRecords
    >(initialEdges),
  )

  const [excalElements, setExcalElements] = useState<
    ExcalidrawElement[]
  >([
    ...initialNodes.map(
      (n) => n.excalData as ExcalidrawElement,
    ),
    ...initialEdges.map(
      (n) => n.excalData as ExcalidrawElement,
    ),
  ])

  const [excalAppState, setExcalAppState] =
    useState<AppState>(initialAppState)

  return (
    <CanvasContext.Provider
      value={{
        nodes,
        setNodes,
        edges,
        setEdges,
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
