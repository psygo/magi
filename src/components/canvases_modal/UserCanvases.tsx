"use client"

import { useState } from "react"

import { useRouter } from "next/navigation"

import { Loader2, Pencil, Save } from "lucide-react"

import { LoadingState, type SelectCanvas } from "@types"

import { putCanvas } from "@actions"

import { useCanvases } from "@providers"

import { Button, Input } from "@shad"

export function UserCanvases() {
  const { canvases } = useCanvases()

  const router = useRouter()

  return (
    <div className="flex flex-col gap-3">
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
        canvases.map((c) => (
          <EditableCanvas key={c.nanoId} canvas={c} />
        ))}
    </div>
  )
}

type EditableCanvasProps = {
  canvas: SelectCanvas
}

function EditableCanvas({ canvas }: EditableCanvasProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [canvasTitle, setCanvasTitle] = useState(
    canvas.title,
  )
  const [loading, setLoading] = useState(
    LoadingState.NotYet,
  )

  async function onSubmit() {
    setLoading(LoadingState.Loading)

    const res = await putCanvas(canvasTitle, canvas.nanoId)

    if (!res) setLoading(LoadingState.Errored)
    setLoading(LoadingState.Loaded)
    setIsEditing(false)
  }

  return (
    <div className="flex w-full gap-2 items-center">
      {isEditing ? (
        <Input
          id="canvas-title"
          placeholder="My Canvas"
          autoFocus
          value={canvasTitle}
          onChange={(e) => setCanvasTitle(e.target.value)}
        />
      ) : (
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={onSubmit}
        >
          {canvasTitle}
        </Button>
      )}

      {isEditing ? (
        <Button
          className="text-green-400 border-green-400"
          variant="outline"
          onClick={onSubmit}
        >
          {loading === LoadingState.Loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Save className="h-5 w-5" />
          )}
        </Button>
      ) : (
        <Button
          variant="outline"
          onClick={() => setIsEditing(true)}
        >
          <Pencil className="h-[18px] w-[18px]" />
        </Button>
      )}
    </div>
  )
}
