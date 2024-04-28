"use client"

import { useEffect, useState } from "react"

import {
  type ExcalId,
  LoadingState,
  type SelectNodeWithCreatorAndStatsAndCreatorStats,
} from "@types"

import { getNode } from "@actions"

export function useNode(excalId: ExcalId) {
  const [node, setNode] =
    useState<SelectNodeWithCreatorAndStatsAndCreatorStats>()

  const [loading, setLoading] = useState<LoadingState>(
    LoadingState.NotYet,
  )

  useEffect(() => {
    async function getNodeData() {
      setLoading(LoadingState.Loading)

      const nodeData = await getNode(excalId)

      if (nodeData) setNode(nodeData)

      setLoading(LoadingState.Loaded)
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getNodeData()
  }, [excalId])

  return { node, setNode, loading }
}
