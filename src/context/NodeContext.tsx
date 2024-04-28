"use client"

import { createContext, useContext, useState } from "react"

import { type ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"

import {
  type WithReactChildren,
  LoadingState,
  type SelectNodeWithCreatorAndStatsAndCreatorStats,
} from "@types"

import { putNode } from "@actions"

import { useNode } from "@hooks"

type NodeContext = {
  excalEl: ExcalidrawElement
  node:
    | SelectNodeWithCreatorAndStatsAndCreatorStats
    | undefined
  loading: LoadingState
  updateNode: (
    title?: string,
    description?: string,
  ) => Promise<void>
  loadingUpdate: LoadingState
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
  const [loadingUpdate, setLoadingUpdate] =
    useState<LoadingState>(LoadingState.NotYet)

  async function updateNode(
    title?: string,
    description?: string,
  ) {
    if (node) {
      setLoadingUpdate(LoadingState.Loading)

      const newNode = await putNode(
        node.excalId,
        title ?? node.title ?? "",
        description ?? node.description ?? "",
      )

      setNode(newNode)

      setLoadingUpdate(LoadingState.Loaded)
    }
  }

  return (
    <NodeContext.Provider
      value={{
        excalEl,
        node,
        loading,
        updateNode,
        loadingUpdate,
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
