"use client"

import { useState } from "react"

import { useRouter } from "next/navigation"

import { Plus } from "lucide-react"

import { postCanvas } from "@actions"

import { Button, Input, Label } from "@shad"

export function NewCanvasForm() {
  const router = useRouter()

  const [canvasTitle, setCanvasTitle] = useState("")

  async function handleSubmit() {
    const newCanvas = await postCanvas(canvasTitle)
    if (!newCanvas) return
    router.push(`/canvases/${newCanvas.nanoId}`)
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        await handleSubmit()
      }}
      className="grid grid-cols-3 gap-x-2 items-end"
    >
      <div className="col-span-2 flex flex-col gap-3">
        <Label htmlFor="canvas-title" className="pl-3">
          Create a New Canvas
        </Label>
        <Input
          id="canvas-title"
          className="w-full"
          placeholder="My Canvas Title"
          value={canvasTitle}
          onChange={(e) => setCanvasTitle(e.target.value)}
        />
      </div>
      <div className="col-span-1 flex justify-end">
        <Button
          variant="outline"
          type="submit"
          className="w-max border-green-400 text-green-400 flex gap-1 px-3"
        >
          <Plus className="h-[18px] w-[18px]" />
          Create Canvas
        </Button>
      </div>
    </form>
  )
}
