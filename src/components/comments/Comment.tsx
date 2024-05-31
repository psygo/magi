"use client"

import { useState } from "react"

import { Loader2 } from "lucide-react"

import { useUser as useClerkUser } from "@clerk/nextjs"

import {
  LoadingState,
  type SelectCommentWithCreator,
  type NanoId,
} from "@types"

import { useComments, useNodeData } from "@providers"

import { Button, Card, CardContent, Textarea } from "@shad"

import { EditableField, FieldType, Progress } from "@common"

import { NodeDate } from "../nodes/NodeAuthor"

export function CommentSection() {
  const { isSignedIn } = useClerkUser()

  const { comments, loading } = useComments()
  const commentsAsArray = Object.values(comments)

  if (!comments || loading !== LoadingState.Loaded)
    return <Progress />

  return (
    <>
      <h2 className="text-xl font-bold">Comments</h2>
      {isSignedIn && <PermanentComment />}
      <div className="flex flex-col gap-3 mt-2">
        {commentsAsArray.length > 0 &&
          commentsAsArray.map((c, i) => {
            return <Comment key={i} nanoId={c.nanoId} />
          })}
      </div>
    </>
  )
}

function PermanentComment() {
  const { createComment, loadingCreate } = useComments()
  const [value, setValue] = useState("")

  return (
    <div className="flex flex-col gap-2">
      <Textarea
        id="field"
        placeholder="Your comment here"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="flex gap-2 justify-end">
        <Button
          className="w-max"
          disabled={loadingCreate === LoadingState.Loading}
          onClick={async () => {
            await createComment(value)
          }}
        >
          {loadingCreate === LoadingState.Loading && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Create Comment
        </Button>
      </div>
    </div>
  )
}

type CommentProps = {
  nanoId: NanoId
}

function Comment({ nanoId }: CommentProps) {
  const { node } = useNodeData()
  const { comments, updateComment, loadingUpdate } =
    useComments()
  const comment = comments[nanoId]

  const { user } = useClerkUser()
  const userIsAuthor = !!(
    user && user.id === node!.creator!.clerkId
  )

  if (!comment) return

  return (
    <Card>
      <CardContent className="flex flex-col gap-2 py-2 px-3">
        <EditableField
          type={FieldType.textarea}
          content={
            comment.content === ""
              ? "No title yet"
              : comment.content
          }
          isEditable={userIsAuthor}
          label="Comment"
          placeholder="Your comment here"
          initialFieldValue={comment?.content ?? ""}
          onSaveHook={async (v) => {
            await updateComment(v, nanoId)
          }}
          loading={loadingUpdate === LoadingState.Loading}
        />
        <CommentAuthor comment={comment} />
      </CardContent>
    </Card>
  )
}

type CommentAuthorProps = {
  comment: SelectCommentWithCreator
}

function CommentAuthor({ comment }: CommentAuthorProps) {
  return (
    <div className="flex gap-2 items-center">
      <p className="text-sm text-blue-500 font-bold">
        {comment.creator!.username}
      </p>
      <NodeDate updatedAt={comment.updatedAt} />
    </div>
  )
}
