"use client"

import { createContext, useContext, useState } from "react"

import { type WithReactChildren } from "@types"

import { type SelectNode } from "@server"

type GraphContext = {
  nodes: SelectNode[]
  setNodes: React.Dispatch<
    React.SetStateAction<SelectNode[]>
  >
  isCreatingNode: boolean
  setIsCreatingNode: React.Dispatch<
    React.SetStateAction<boolean>
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

  return (
    <GraphContext.Provider
      value={{
        nodes,
        setNodes,
        isCreatingNode,
        setIsCreatingNode,
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
