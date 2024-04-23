"use client"

import { useEffect, useState } from "react"

import {
  type ExcalId,
  LoadingState,
  type SelectCommentWithCreator,
} from "@types"

import { getComments } from "@actions"

export function useComments(excalId: ExcalId) {
  const [comments, setComments] =
    useState<SelectCommentWithCreator[]>()

  const [loading, setLoading] = useState<LoadingState>(
    LoadingState.NotYet,
  )

  useEffect(() => {
    async function getCommentsData() {
      setLoading(LoadingState.Loading)

      const commentsData = await getComments(excalId)

      if (commentsData) setComments(commentsData)

      setLoading(LoadingState.Loaded)
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getCommentsData()
  }, [excalId])

  return { comments, setComments, loading }
}
