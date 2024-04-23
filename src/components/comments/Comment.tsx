"use client"

import { useState } from "react"

import { stringIsEmpty } from "@utils"

import {
  LoadingState,
  type SelectCommentWithCreator,
  type ExcalId,
} from "@types"

import { postComment, putComment } from "@actions"

import { useComments } from "@hooks"

import { Textarea } from "@shad"

import {
  EditableContentContainerEdit,
  EditableContentContainerView,
  Progress,
  autoFocus,
} from "../common/exports"

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
      <Comment excalId={excalId} />
      {comments.map((c, i) => {
        return (
          <Comment
            key={i}
            commentInitialData={c}
            excalId={excalId}
          />
        )
      })}
    </>
  )
}

type CommentProps = {
  commentInitialData?: SelectCommentWithCreator
  excalId: ExcalId
}

export function Comment({
  commentInitialData,
  excalId,
}: CommentProps) {
  const [comment, setComment] = useState<
    SelectCommentWithCreator | undefined
  >(commentInitialData)
  const [commentContent, setCommentContent] =
    useState<string>(commentInitialData?.content ?? "")

  const [isEditing, setIsEditing] = useState(
    stringIsEmpty(commentInitialData?.content),
  )

  if (isEditing) {
    return (
      <EditableContentContainerEdit
        onCancel={() => setIsEditing(false)}
        onSave={async () => {
          const newComment = comment
            ? await putComment(
                commentContent,
                comment.nanoId,
              )
            : await postComment(commentContent, excalId)

          console.log(newComment)

          if (newComment) {
            setComment(newComment)
            setIsEditing(false)
          }
        }}
      >
        <Textarea
          id="comment"
          placeholder="Leave a comment"
          {...autoFocus}
          value={commentContent}
          onChange={(e) =>
            setCommentContent(e.target.value)
          }
        />
      </EditableContentContainerEdit>
    )
  } else {
    return (
      <EditableContentContainerView
        onEdit={() => setIsEditing(true)}
        iconSize={13}
      >
        <p className="">{commentContent}</p>
      </EditableContentContainerView>
    )
  }
}
