"use client"

import { createContext, useContext, useState } from "react"

import { type WithReactChildren } from "@types"

import { type SelectNode } from "@server"

type GraphContext = {
  nodes: SelectNode[]
  setNodes: React.Dispatch<
    React.SetStateAction<SelectNode[]>
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

  return (
    <GraphContext.Provider
      value={{
        nodes,
        setNodes,
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
