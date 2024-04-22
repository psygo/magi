"use client"

import { createContext, useContext } from "react"

import { type ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"

import {
  type WithReactChildren,
  type SelectEdgeWithCreatorAndStats,
  type SelectNodeWithCreatorAndStats,
  type LoadingState,
} from "@types"

import { putEdge, putNode } from "@actions"

import { useNodeOrEdge } from "@hooks"

type NodeOrEdgeContext = {
  nodeOrEdge:
    | SelectNodeWithCreatorAndStats
    | SelectEdgeWithCreatorAndStats
    | undefined
  loading: LoadingState
  isNode: boolean
  updateNodeOrEdge: (
    title?: string,
    description?: string,
  ) => Promise<void>
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
  const isNode = excalEl.type !== "arrow"
  const { nodeOrEdge, setNodeOrEdge, loading } =
    useNodeOrEdge(excalEl.id, isNode)

  async function updateNodeOrEdge(
    title?: string,
    description?: string,
  ) {
    if (nodeOrEdge) {
      const newNode = isNode
        ? await putNode(
            nodeOrEdge.excalId,
            title ?? nodeOrEdge.title ?? "",
            description ?? nodeOrEdge.description ?? "",
          )
        : await putEdge(
            nodeOrEdge.excalId,
            title ?? nodeOrEdge.title ?? "",
            description ?? nodeOrEdge.description ?? "",
          )

      setNodeOrEdge(newNode)
    }
  }

  return (
    <NodeOrEdgeContext.Provider
      value={{
        nodeOrEdge,
        loading,
        isNode,
        updateNodeOrEdge,
      }}
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
