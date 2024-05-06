"use client"

import { createContext, useContext, useState } from "react"

import { useRouter } from "next/navigation"

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
} from "@types"

import { getNodes } from "@actions"

import { useLocalStorage } from "@hooks"

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
  updateSearchParams: () => void
  getMoreNodes: () => Promise<void>
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

  const router = useRouter()

  function updateSearchParams() {
    const state = excalidrawAPI!.getAppState()

    const scrollX = Math.round(state.scrollX)
    const scrollY = Math.round(state.scrollY)
    const zoom = toPrecision(state.zoom.value)

    const searchParams = new URLSearchParams()
    searchParams.set("scrollX", scrollX.toString())
    searchParams.set("scrollY", scrollY.toString())
    searchParams.set("zoom", zoom.toString())

    const searchParamsString = `?${searchParams.toString()}`
    router.replace(
      `/canvases/open-public${searchParamsString}`,
    )
  }

  const { get: getIsPaginating, set: setIsPaginating } =
    useLocalStorage("isDragging", false)

  async function getMoreNodes() {
    const isPaginating = getIsPaginating()

    if (isPaginating) return

    setIsPaginating(true)
    const newNodes = await getNodes()
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
        updateSearchParams,
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
