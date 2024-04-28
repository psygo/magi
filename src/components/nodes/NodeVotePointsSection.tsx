"use client"

import { useState } from "react"

import { useUser } from "@clerk/nextjs"

import { type ExcalId, type ClerkId } from "@types"

import { postVote } from "@actions"

import { cn, pointsColor } from "@styles"

import { VoteButton } from "../votes/exports"

type NodeVotePointsSectionProps = {
  excalId: ExcalId
  creatorClerkId: ClerkId
  initialVoteTotal?: number
  initialUserVotedPoints?: number
}

export function NodeVotePointsSection({
  excalId,
  creatorClerkId,
  initialVoteTotal = 0,
  initialUserVotedPoints = 0,
}: NodeVotePointsSectionProps) {
  const { user } = useUser()

  const [voteTotal, setVoteTotal] = useState(
    initialVoteTotal ?? 0,
  )

  const [userVotedPoints, setUserVotedPoints] = useState(
    initialUserVotedPoints,
  )

  return (
    <div className="flex items-center h-max">
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
          "px-[14px] font-bold text-xl",
          pointsColor(voteTotal),
        )}
      >
        {voteTotal}
      </p>
    </div>
  )
}
