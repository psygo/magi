"use client"

import { createContext, useContext, useState } from "react"

import { type WithReactChildren } from "@types"

type GraphContext = {
  nodes: Node[]
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>
}

const GraphContext = createContext<GraphContext | null>(
  null,
)

export function GraphProvider({
  children,
}: WithReactChildren) {
  const [nodes, setNodes] = useState<Node[]>([])

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
