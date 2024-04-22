"use client"

import { createContext, useContext } from "react"

import { type ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"

import { useNodeOrEdge } from "@hooks"

import {
  type WithReactChildren,
  type SelectEdgeWithCreatorAndStats,
  type SelectNodeWithCreatorAndStats,
  type LoadingState,
} from "@types"

type NodeOrEdgeContext = {
  nodeOrEdge:
    | SelectNodeWithCreatorAndStats
    | SelectEdgeWithCreatorAndStats
    | undefined
  loading: LoadingState
}

const NodeOrEdgeContext =
  createContext<NodeOrEdgeContext | null>(null)

type NodeOrEdgeProviderProps = WithReactChildren & {
  excalEl: ExcalidrawElement
}

export function NodeOrEdgeProvider({
  excalEl,
  children,
}: NodeOrEdgeProviderProps) {
  const { nodeOrEdge, loading } = useNodeOrEdge(
    excalEl.id,
    excalEl.type !== "arrow",
  )

  return (
    <NodeOrEdgeContext.Provider
      value={{ nodeOrEdge, loading }}
    >
      {children}
    </NodeOrEdgeContext.Provider>
  )
}

export function useNodeOrEdgeData() {
  const context = useContext(NodeOrEdgeContext)

  if (!context) {
    throw new Error(
      "`useNodeOrEdgeData` must be used within a `NodeOrEdgeProvider`.",
    )
  }

  return context
}
