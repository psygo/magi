"use client"

import { useEffect, useState } from "react"

import {
  type ExcalId,
  LoadingState,
  type SelectEdgeWithCreatorAndStats,
  type SelectNodeWithCreatorAndStats,
} from "@types"

import { getEdge, getNode } from "@actions"

export function useNodeOrEdge<
  T extends
    | SelectNodeWithCreatorAndStats
    | SelectEdgeWithCreatorAndStats,
>(excalId: ExcalId, isNode = true) {
  const [nodeOrEdge, setNodeOrEdge] = useState<T>()

  const [loading, setLoading] = useState<LoadingState>(
    LoadingState.NotYet,
  )

  useEffect(() => {
    async function getNodeOrEdgeData() {
      setLoading(LoadingState.Loading)

      const nodeOrEdgeData = isNode
        ? await getNode(excalId)
        : await getEdge(excalId)

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (nodeOrEdgeData) setNodeOrEdge(nodeOrEdgeData)

      setLoading(LoadingState.Loaded)
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getNodeOrEdgeData()
  }, [excalId, isNode])

  return { nodeOrEdge, loading }
}
