"use client"

import {
  LoadingState,
  type SelectCommentWithCreator,
  type ExcalId,
} from "@types"

import { useComments } from "@hooks"

import { Progress } from "../common/exports"

type CommentSectionProps = {
  excalId: ExcalId
}

export function CommentSection({
  excalId,
}: CommentSectionProps) {
  const { comments, loading } = useComments(excalId)

  if (!comments || loading !== LoadingState.Loaded)
    return <Progress />

  return (
    <>
      <h2 className="text-xl font-bold">Comments</h2>
      {comments.map((c, i) => {
        return <Comment key={i} comment={c} />
      })}
    </>
  )
}

type CommentProps = {
  comment: SelectCommentWithCreator
}

export function Comment({ comment }: CommentProps) {
  return (
    <>
      <p>{comment.id}</p>
      <p>{comment.content}</p>
    </>
  )
}
