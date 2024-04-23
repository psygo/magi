"use client"

import { useState } from "react"

import { ArrowDown, ArrowUp } from "lucide-react"

import { type ExcalId } from "@types"

import { postVote } from "@actions"

import { Button } from "~/components/common/shad/exports"

type VoteButtonProps = {
  up?: boolean
  excalId: ExcalId
}

export function VoteButton({
  up = false,
  excalId,
}: VoteButtonProps) {
  const [hovered, setHovered] = useState(false)

  async function handleClick() {
    await postVote(excalId, up)
  }

  return (
    <Button
      variant="link"
      className="p-0 m-0"
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {up ? (
        <ArrowUp
          className="h-4 w-4"
          style={{ color: hovered ? "red" : "" }}
        />
      ) : (
        <ArrowDown
          className="h-4 w-4"
          style={{ color: hovered ? "red" : "" }}
        />
      )}
    </Button>
  )
}
