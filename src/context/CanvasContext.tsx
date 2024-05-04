"use client"

import { createContext, useContext, useState } from "react"

import {
  type ExcalidrawImperativeAPI,
  type AppState,
} from "@excalidraw/excalidraw/types/types"
import { type ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"

import { toPrecision } from "@utils"

import {
  type SelectNodeWithCreatorAndStats,
  type WithReactChildren,
  type NodesRecords,
  type FieldOfView,
} from "@types"

import { getNodes } from "@actions"

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
  getCurrentCanvasSearchParams: () => URLSearchParams
  getMoreNodes: (f: FieldOfView) => Promise<void>
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

export type CanvasProviderProps = WithReactChildren & {
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

  function getCurrentCanvasSearchParams() {
    const state = excalidrawAPI!.getAppState()

    const scrollX = Math.round(state.scrollX)
    const scrollY = Math.round(state.scrollY)
    const zoom = toPrecision(state.zoom.value)

    const params = new URLSearchParams()
    params.set("scrollX", scrollX.toString())
    params.set("scrollY", scrollY.toString())
    params.set("zoom", zoom.toString())

    return params
  }

  const [isPaginating, setIsPaginating] = useState(false)

  async function getMoreNodes(
    currentScreen: FieldOfView = {
      xLeft: 0,
      xRight: window.innerWidth,
      yTop: 0,
      yBottom: window.innerHeight,
    },
  ) {
    if (isPaginating) return

    setIsPaginating(true)
    const newNodes = await getNodes(currentScreen)
    setIsPaginating(false)

    if (!newNodes) return
    excalidrawAPI!.updateScene({
      elements: [
        ...excalidrawAPI!.getSceneElements(),
        ...newNodes.map(
          (n) => n.excalData as ExcalidrawElement,
        ),
      ],
      appState: excalidrawAPI!.getAppState(),
    })
    setNodes({
      ...nodes,
      ...nodesArrayToRecords(newNodes),
    })
  }

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
        getCurrentCanvasSearchParams,
        getMoreNodes,
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
