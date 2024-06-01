"use client"

import { useState } from "react"

import { useRouter } from "next/navigation"

import { Loader2, Pencil, Save, Trash } from "lucide-react"

import { LoadingState, type SelectCanvas } from "@types"

import { deleteCanvas, putCanvas } from "@actions"

import { Button, Input } from "@shad"

type EditableCanvasProps = {
  canvas: SelectCanvas
}

export function EditableCanvas({
  canvas,
}: EditableCanvasProps) {
  const router = useRouter()

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

  async function onDelete() {
    setLoading(LoadingState.Loading)

    const res = await deleteCanvas(canvas.nanoId)

    if (!res) setLoading(LoadingState.Errored)
    setLoading(LoadingState.Loaded)
    setIsEditing(false)

    router.push("/")
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
          {canvasTitle}{" "}
          {canvas.isDeleted ? "(deleted)" : ""}
        </Button>
      )}

      <Button
        className="text-red-400 border-red-400"
        variant="outline"
        onClick={onDelete}
        disabled={loading === LoadingState.Loading}
      >
        {loading === LoadingState.Loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Trash className="h-[18px] w-[18px]" />
        )}
      </Button>

      {isEditing ? (
        <Button
          className="text-green-400 border-green-400"
          variant="outline"
          onClick={onSubmit}
          disabled={loading === LoadingState.Loading}
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
          disabled={loading === LoadingState.Loading}
        >
          <Pencil className="h-[18px] w-[18px]" />
        </Button>
      )}
    </div>
  )
}
