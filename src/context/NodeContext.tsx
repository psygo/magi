"use client"

import { createContext, useContext, useState } from "react"

import { type ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"

import {
  type WithReactChildren,
  LoadingState,
  type SelectNodeWithCreatorAndStatsAndCreatorStats,
} from "@types"

import { postVote, putNode } from "@actions"

import { useNode } from "@hooks"

import { useCanvas } from "./CanvasContext"

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
  vote: (up: boolean) => Promise<void>
  loadingVote: LoadingState
}

const NodeContext = createContext<NodeContext | null>(null)

type NodeProviderProps = WithReactChildren & {
  excalEl: ExcalidrawElement
}

export function NodeProvider({
  excalEl,
  children,
}: NodeProviderProps) {
  const { nodes, setNodes } = useCanvas()
  const excalId = excalEl.id

  const { node, setNode, loading } = useNode(excalId)

  const [loadingUpdate, setLoadingUpdate] =
    useState<LoadingState>(LoadingState.NotYet)
  const [loadingVote, setLoadingVote] =
    useState<LoadingState>(LoadingState.NotYet)

  async function updateNode(
    title?: string,
    description?: string,
  ) {
    if (node) {
      setLoadingUpdate(LoadingState.Loading)

      const newNode = await putNode(
        excalId,
        title ?? node.title ?? "",
        description ?? node.description ?? "",
      )

      setNode(newNode)

      setLoadingUpdate(LoadingState.Loaded)
    }
  }

  async function vote(up: boolean) {
    setLoadingVote(LoadingState.Loading)

    const newNode = await postVote(excalId, up)

    if (newNode) {
      setNode(newNode)
      setNodes({
        ...nodes,
        excalId: newNode,
      })
    }

    setLoadingVote(LoadingState.Loaded)
  }

  return (
    <NodeContext.Provider
      value={{
        excalEl,
        node,
        loading,
        updateNode,
        loadingUpdate,
        vote,
        loadingVote,
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
