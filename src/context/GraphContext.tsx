"use client"

import { createContext, useContext, useState } from "react"

import { type WithReactChildren } from "@types"

import { type SelectNode } from "@server"

import { rectHeight, rectWidth } from "@styles"

type Coords = Pick<SelectNode, "x" | "y">

type GraphContext = {
  nodes: SelectNode[]
  setNodes: React.Dispatch<
    React.SetStateAction<SelectNode[]>
  >
  isCreatingNode: boolean
  setIsCreatingNode: React.Dispatch<
    React.SetStateAction<boolean>
  >
  selectedNode: SelectNode | null
  setSelectedNode: React.Dispatch<
    React.SetStateAction<SelectNode | null>
  >
  coords: Coords | null
  setCoords: React.Dispatch<
    React.SetStateAction<Coords | null>
  >
  isPointOnNode: (
    x: number,
    y: number,
    nX: number,
    nY: number,
  ) => boolean
  isPointOnAnyNode: (x: number, y: number) => boolean
}

const GraphContext = createContext<GraphContext | null>(
  null,
)

type GraphProviderProps = WithReactChildren & {
  initialNodes?: SelectNode[]
}

export function GraphProvider({
  initialNodes,
  children,
}: GraphProviderProps) {
  const [nodes, setNodes] = useState<SelectNode[]>(
    initialNodes ?? [],
  )
  const [isCreatingNode, setIsCreatingNode] =
    useState(false)
  const [selectedNode, setSelectedNode] =
    useState<SelectNode | null>(null)
  const [coords, setCoords] = useState<Coords | null>({
    x: 0,
    y: 0,
  })

  function isPointOnNode(
    x: number,
    y: number,
    nX: number,
    nY: number,
  ) {
    const pointIsWithinX = x >= nX && x <= nX + rectWidth
    const pointIsWithinY = y >= nY && y <= nY + rectHeight
    return pointIsWithinX && pointIsWithinY
  }

  function isPointOnAnyNode(x: number, y: number) {
    return nodes
      .map((n) => isPointOnNode(x, y, n.x, n.y))
      .reduce((p, v) => p || v)
  }

  return (
    <GraphContext.Provider
      value={{
        nodes,
        setNodes,
        isCreatingNode,
        setIsCreatingNode,
        selectedNode,
        setSelectedNode,
        coords,
        setCoords,
        isPointOnNode,
        isPointOnAnyNode,
      }}
    >
      {children}
    </GraphContext.Provider>
  )
}

export function useGraph() {
  const context = useContext(GraphContext)

  if (!context) {
    throw new Error(
      "`useGraph` must be used within a `GraphProvider`.",
    )
  }

  return context
}
