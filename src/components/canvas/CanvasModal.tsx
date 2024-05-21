"use client"

import { useState } from "react"

import { useUser as useClerkUser } from "@clerk/nextjs"

import { FolderKanban } from "lucide-react"

import { postCanvas } from "@actions"

import { useCanvases } from "@providers"

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  Input,
  Label,
} from "@shad"

export function CanvasModal() {
  const { canvases } = useCanvases()

  const { user, isSignedIn } = useClerkUser()

  const [canvasTitle, setCanvasTitle] = useState("")

  if (!isSignedIn) return

  async function handleSubmit() {
    const newCanvas = await postCanvas(canvasTitle)
    console.log("new canvas", newCanvas)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="p-2 mt-1 bg-[#ececf4] dark:bg-[#23232a]"
        >
          <FolderKanban className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="border-2 border-gray-700 overflow-y-scroll h-[90vh] rounded-md">
        <DialogHeader>
          <h2 className="text-lg font-semibold">
            @{user.username}&apos;s Canvases
          </h2>
        </DialogHeader>

        {canvases &&
          canvases.length > 0 &&
          canvases.map((c) => {
            return <h3 key={c.nanoId}>{c.title}</h3>
          })}

        <form
          onSubmit={async (e) => {
            e.preventDefault()
            await handleSubmit()
          }}
          className="flex flex-col items-start gap-2"
        >
          <Label htmlFor="canvas-title">Canvas Title</Label>
          <Input
            id="canvas-title"
            placeholder="My Canvas"
            value={canvasTitle}
            onChange={(e) => setCanvasTitle(e.target.value)}
          />
          <Button type="submit" className="w-max">
            Create Canvas
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
