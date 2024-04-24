"use client"

import { useState } from "react"

import { ArrowDown, ArrowUp } from "lucide-react"

import { Button } from "@shad"

type VoteButtonProps = {
  up?: boolean
  onClick: () => void
}

export function VoteButton({
  up = false,
  onClick,
}: VoteButtonProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <Button
      variant="link"
      className="p-0 m-0"
      onClick={onClick}
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
