"use client"

import { useRouter } from "next/navigation"

import { useCanvases } from "@providers"

import { Button } from "@shad"

export function UserCanvases() {
  const { canvases } = useCanvases()

  const router = useRouter()

  return (
    <div className="flex flex-col gap-2">
      <h3 className="pl-3">Your Canvases</h3>
      <Button
        className="justify-start"
        variant="outline"
        onClick={() => {
          router.push(`/canvases/open-public`)
        }}
      >
        Open Public (Default for Everyone)
      </Button>
      {canvases &&
        canvases.length > 0 &&
        canvases.map((c) => {
          return (
            <Button
              key={c.nanoId}
              className="justify-start"
              variant="outline"
              onClick={() => {
                router.push(`/canvases/${c.nanoId}`)
              }}
            >
              {c.title}
            </Button>
          )
        })}
    </div>
  )
}
