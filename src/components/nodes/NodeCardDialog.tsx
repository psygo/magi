"use client"

import { useState } from "react"

import { type ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Separator,
} from "~/components/common/shad/exports"

import {
  type ExcalId,
  LoadingState,
  type SelectUserWithStats,
  type ClerkId,
} from "@types"

import { postVote } from "@actions"

import { NodeProvider, useNodeData } from "@context"

import { cn, pointsColor } from "@styles"

import { Progress } from "../common/exports"

import { CommentSection } from "../comments/exports"

import { VoteButton } from "../votes/VoteButton"

import { Title } from "./Title"
import { Description } from "./Description"
import { UserAvatar } from "../users/UserAvatar"
import { useUser } from "@clerk/nextjs"

type NodeEdgeCardDialogProps = {
  excalEl: ExcalidrawElement
  voteTotal: number
}

export function NodeCardDialog({
  excalEl,
  voteTotal,
}: NodeEdgeCardDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className={cn(
            "p-0 px-[2px] font-bold text-base",
            pointsColor(voteTotal),
          )}
        >
          {voteTotal}
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-y-scroll max-h-[90vh]">
        <NodeProvider excalEl={excalEl}>
          <NodeCardDialogContent />
        </NodeProvider>
      </DialogContent>
    </Dialog>
  )
}

function NodeCardDialogContent() {
  const { node, loading } = useNodeData()

  if (!node || loading !== LoadingState.Loaded)
    return <Progress />

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex gap-2">
          <p className="text-gray-500">Node Data</p>
          <p className="text-gray-400">{node?.excalId}</p>
        </DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-4 mt-4">
        <Title />
        <Description
          aF={node.title !== "" || node.description !== ""}
        />
        <VotePointsSection
          excalId={node.excalId}
          creatorClerkId={node.creator!.clerkId}
          initialUserVotedPoints={node.stats?.votedPoints}
          initialVoteTotal={node.stats?.voteTotal}
        />
        <NodeAuthor author={node.creator!} />
        <Separator className="my-2" />
        <CommentSection excalId={node.excalId} />
      </div>
    </>
  )
}

type NodeAuthorProps = {
  author: SelectUserWithStats
}

function NodeAuthor({ author }: NodeAuthorProps) {
  const points = author.stats!.voteTotal

  return (
    <div className="flex gap-2 items-center">
      <p>by</p>
      <UserAvatar
        username={author.username}
        imageUrl={author.imageUrl}
        iconSize={24}
        fontSize={14}
      />
      <h6 className="text-md text-blue-500">
        @{author.username}
      </h6>
      <h6 className={cn("text-md", pointsColor(points))}>
        {points}
      </h6>
    </div>
  )
}

type VotePointsSectionProps = {
  excalId: ExcalId
  creatorClerkId: ClerkId
  initialVoteTotal?: number
  initialUserVotedPoints?: number
}

function VotePointsSection({
  excalId,
  creatorClerkId,
  initialVoteTotal = 0,
  initialUserVotedPoints = 0,
}: VotePointsSectionProps) {
  const { user } = useUser()

  const [voteTotal, setVoteTotal] = useState(
    initialVoteTotal ?? 0,
  )

  const [userVotedPoints, setUserVotedPoints] = useState(
    initialUserVotedPoints,
  )

  return (
    <div className="flex gap-4 items-center">
      <VoteButton
        up
        onClick={async () => {
          if (user?.id === creatorClerkId) return
          await postVote(excalId, true)
          setVoteTotal(initialUserVotedPoints + 1)
          setUserVotedPoints(1)
        }}
        iconSize={24}
        votedPoints={userVotedPoints}
      />
      <VoteButton
        onClick={async () => {
          if (user?.id === creatorClerkId) return
          await postVote(excalId, false)
          setVoteTotal(initialUserVotedPoints - 1)
          setUserVotedPoints(-1)
        }}
        iconSize={24}
        votedPoints={userVotedPoints}
      />
      <p
        className={cn(
          "px-[2px] font-bold text-xl",
          pointsColor(voteTotal),
        )}
      >
        {voteTotal}
      </p>
    </div>
  )
}
