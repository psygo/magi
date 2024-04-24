"use client"

import { useState } from "react"

import { ArrowDown, ArrowUp } from "lucide-react"

import { Button } from "@shad"

type VoteButtonProps = {
  up?: boolean
  onClick: () => void
  iconSize?: number
}

export function VoteButton({
  up = false,
  onClick,
  iconSize = 18,
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
          style={{
            color: hovered ? "red" : "",
            height: iconSize,
            width: iconSize,
          }}
        />
      ) : (
        <ArrowDown
          style={{
            color: hovered ? "red" : "",
            height: iconSize,
            width: iconSize,
          }}
        />
      )}
    </Button>
  )
}
