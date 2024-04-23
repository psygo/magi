"use client"

import { useState } from "react"

import { stringIsEmpty } from "@utils"

import {
  LoadingState,
  type SelectCommentWithCreator,
  type ExcalId,
  type SelectUser,
} from "@types"

import { postComment, putComment } from "@actions"

import { useComments } from "@hooks"

import { Separator, Textarea } from "@shad"

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
      <div className="flex flex-col gap-2 mt-2">
        {comments.map((c, i) => {
          return (
            <div key={i} className="flex flex-col gap-2">
              <Separator />
              <Comment
                commentInitialData={c}
                excalId={excalId}
              />
            </div>
          )
        })}
      </div>
      <Separator className="mt-[-6px]" />
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
        <div className="flex flex-wrap gap-4 items-center">
          <p className="">{commentContent}</p>
          <div className="flex flex-wrap gap-2 items-center">
            <CommentUser user={comment!.creator!} />
            <p className="text-xs text-gray-500">
              {comment?.updatedAt.toLocaleDateString()}{" "}
              {comment?.updatedAt.toLocaleTimeString()}
            </p>
          </div>
        </div>
      </EditableContentContainerView>
    )
  }
}

type CommentUserProps = {
  user: SelectUser
}

function CommentUser({ user }: CommentUserProps) {
  return (
    <div className="flex">
      <h4 className="text-sm font-bold text-orange-500">
        @{user.username}
      </h4>
    </div>
  )
}
