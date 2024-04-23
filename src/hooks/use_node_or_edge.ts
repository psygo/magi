"use client"

import { useEffect, useState } from "react"

import {
  type ExcalId,
  LoadingState,
  type SelectNodeWithCreatorAndStats,
} from "@types"

import { getNode } from "@actions"

export function useNodeOrEdge(
  excalId: ExcalId,
  isNode = true,
) {
  const [nodeOrEdge, setNodeOrEdge] =
    useState<SelectNodeWithCreatorAndStats>()

  const [loading, setLoading] = useState<LoadingState>(
    LoadingState.NotYet,
  )

  useEffect(() => {
    async function getNodeOrEdgeData() {
      setLoading(LoadingState.Loading)

      const nodeOrEdgeData = await getNode(excalId)

      if (nodeOrEdgeData) setNodeOrEdge(nodeOrEdgeData)

      setLoading(LoadingState.Loaded)
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getNodeOrEdgeData()
  }, [excalId, isNode])

  return { nodeOrEdge, setNodeOrEdge, loading }
}
