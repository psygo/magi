"use client"

import { createContext, useContext, useState } from "react"

import { type WithReactChildren } from "@types"

import { type SelectNode } from "@server"

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
