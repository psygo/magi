"use client"

import { useUser } from "@clerk/nextjs"

import { cn, pointsColor } from "@styles"

import { useNodeData } from "@providers"

import { VoteButton } from "../votes/exports"

export function NodeVotePointsSection() {
  const { user } = useUser()

  const { node, vote, loadingVote } = useNodeData()

  const votedPoints = node?.stats?.votedPoints ?? 0
  const voteTotal = node?.stats?.voteTotal ?? 0

  return (
    <div className="flex items-center h-max">
      <VoteButton
        up
        onClick={async () => {
          if (user?.id === node?.creator?.clerkId) return
          await vote(true)
        }}
        iconSize={24}
        votedPoints={votedPoints}
        loading={loadingVote}
      />
      <VoteButton
        onClick={async () => {
          if (user?.id === node?.creator?.clerkId) return
          await vote(false)
        }}
        iconSize={24}
        votedPoints={votedPoints}
        loading={loadingVote}
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
