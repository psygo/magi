"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"

import {
  type WithReactChildren,
  LoadingState,
  type SelectCommentWithCreator,
  type NanoId,
} from "@types"

import {
  getComments,
  postComment,
  putComment,
} from "@actions"

import { useNodeData } from "./NodeContext"

type CommentsContext = {
  comments: CommentsRecords
  loading: LoadingState
  updateComment: (
    content: string,
    nanoId: NanoId,
  ) => Promise<void>
  loadingUpdate: LoadingState
  createComment: (content: string) => Promise<void>
  loadingCreate: LoadingState
}

const CommentsContext =
  createContext<CommentsContext | null>(null)

export type CommentsRecords = Record<
  NanoId,
  SelectCommentWithCreator
>

export function commentsArrayToRecords(
  comments: SelectCommentWithCreator[],
) {
  const records: CommentsRecords = {}
  comments.forEach((c) => (records[c.nanoId] = c))
  return records
}

type CommentsProviderProps = WithReactChildren

export function CommentsProvider({
  children,
}: CommentsProviderProps) {
  const { node } = useNodeData()
  const excalId = node!.excalId

  const [commentsRecords, setCommentsRecords] =
    useState<CommentsRecords>({})
  const [loading, setLoading] = useState<LoadingState>(
    LoadingState.NotYet,
  )
  const [loadingCreate, setLoadingCreate] =
    useState<LoadingState>(LoadingState.NotYet)
  const [loadingUpdate, setLoadingUpdate] =
    useState<LoadingState>(LoadingState.NotYet)

  useEffect(() => {
    async function getCommentsData() {
      setLoading(LoadingState.Loading)

      const commentsData = await getComments(excalId)

      if (commentsData)
        setCommentsRecords(
          commentsArrayToRecords(commentsData),
        )

      setLoading(LoadingState.Loaded)
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getCommentsData()
  }, [excalId])

  async function createComment(content: string) {
    setLoadingCreate(LoadingState.Loading)

    const createdComment = await postComment(
      content,
      node!.excalId,
    )
    if (createdComment) {
      const newCommentsRecords = { ...commentsRecords }
      newCommentsRecords[createdComment.nanoId] =
        createdComment
      setCommentsRecords(newCommentsRecords)
    }

    setLoadingCreate(LoadingState.Loaded)
  }

  async function updateComment(
    content: string,
    nanoId: NanoId,
  ) {
    setLoadingUpdate(LoadingState.Loading)

    const updatedComment = await putComment(content, nanoId)
    if (updatedComment) {
      const newCommentsRecords = { ...commentsRecords }
      newCommentsRecords[nanoId] = updatedComment
      setCommentsRecords(newCommentsRecords)
    }

    setLoadingUpdate(LoadingState.Loaded)
  }

  return (
    <CommentsContext.Provider
      value={{
        comments: commentsRecords,
        loading,
        updateComment,
        loadingUpdate,
        createComment,
        loadingCreate,
      }}
    >
      {children}
    </CommentsContext.Provider>
  )
}

export function useComments() {
  const context = useContext(CommentsContext)

  if (!context) {
    throw new Error(
      "`useComments` must be used within a `CommentsProvider`.",
    )
  }

  return context
}
