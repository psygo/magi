"use client"

import { createContext, useContext } from "react"

import { type ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"

import {
  type WithReactChildren,
  type LoadingState,
  type SelectNodeWithCreatorAndStatsAndCreatorStats,
} from "@types"

import { putNode } from "@actions"

import { useNode } from "@hooks"

type NodeContext = {
  node:
    | SelectNodeWithCreatorAndStatsAndCreatorStats
    | undefined
  loading: LoadingState
  updateNode: (
    title?: string,
    description?: string,
  ) => Promise<void>
}

const NodeContext = createContext<NodeContext | null>(null)

type NodeProviderProps = WithReactChildren & {
  excalEl: ExcalidrawElement
}

export function NodeProvider({
  excalEl,
  children,
}: NodeProviderProps) {
  const { node, setNode, loading } = useNode(excalEl.id)

  async function updateNode(
    title?: string,
    description?: string,
  ) {
    if (node) {
      const newNode = await putNode(
        node.excalId,
        title ?? node.title ?? "",
        description ?? node.description ?? "",
      )

      setNode(newNode)
    }
  }

  return (
    <NodeContext.Provider
      value={{
        node,
        loading,
        updateNode,
      }}
    >
      {children}
    </NodeContext.Provider>
  )
}

export function useNodeData() {
  const context = useContext(NodeContext)

  if (!context) {
    throw new Error(
      "`useNodeData` must be used within a `NodeProvider`.",
    )
  }

  return context
}
