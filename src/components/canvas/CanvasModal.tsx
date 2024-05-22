"use client"

import { useState } from "react"

import { useRouter } from "next/navigation"

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

  const router = useRouter()

  const [canvasTitle, setCanvasTitle] = useState("")

  if (!isSignedIn) return

  async function handleSubmit() {
    const newCanvas = await postCanvas(canvasTitle)
    if (!newCanvas) return
    router.push(`/canvases/${newCanvas.nanoId}`)
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
        <DialogHeader className="h-max">
          <p className="text-lg font-semibold">
            @{user.username}&apos;s Canvases
          </p>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              await handleSubmit()
            }}
            className="grid grid-cols-3 gap-x-2 items-end"
          >
            <div className="col-span-2 flex flex-col gap-3">
              <Label
                htmlFor="canvas-title"
                className="pl-3"
              >
                Create a New Canvas
              </Label>
              <Input
                id="canvas-title"
                className="w-full"
                placeholder="My Canvas Title"
                value={canvasTitle}
                onChange={(e) =>
                  setCanvasTitle(e.target.value)
                }
              />
            </div>
            <div className="col-span-1 flex w-full justify-end">
              <Button type="submit" className="w-max">
                Create Canvas
              </Button>
            </div>
          </form>

          <div className="flex flex-col gap-2">
            <h3 className="pl-3">Your Canvases</h3>
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
        </div>
      </DialogContent>
    </Dialog>
  )
}
