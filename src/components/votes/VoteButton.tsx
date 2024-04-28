"use client"

import { useState } from "react"

import { ArrowDown, ArrowUp } from "lucide-react"

import { Button } from "@shad"

type VoteButtonProps = {
  up?: boolean
  onClick: () => void
  iconSize?: number
  votedPoints?: number
}

export function VoteButton({
  up = false,
  onClick,
  iconSize = 18,
  votedPoints = 0,
}: VoteButtonProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <Button
      variant="ghost"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {up ? (
        <ArrowUp
          style={{
            color:
              votedPoints > 0 || hovered ? "green" : "",
            height: iconSize,
            width: iconSize,
          }}
        />
      ) : (
        <ArrowDown
          style={{
            color: votedPoints < 0 || hovered ? "red" : "",
            height: iconSize,
            width: iconSize,
          }}
        />
      )}
    </Button>
  )
}
