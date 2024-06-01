"use client"

import { useUser as useClerkUser } from "@clerk/nextjs"

import { FolderKanban } from "lucide-react"

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@shad"

import { NewCanvasForm } from "./NewCanvasForm"
import { UserCanvases } from "./UserCanvases"

export function CanvasesModal() {
  const { user, isSignedIn } = useClerkUser()

  if (!isSignedIn) return

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="p-2 mt-1">
          <FolderKanban className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className=" flex flex-col border-2 border-gray-700 overflow-y-scroll h-[90vh] rounded-md">
        <DialogHeader className="h-max pl-3">
          <p className="text-lg font-semibold">
            @{user.username}&apos;s Canvases
          </p>
        </DialogHeader>

        <div className="flex flex-col gap-6 mt-4">
          <NewCanvasForm />
          <UserCanvases />
        </div>
      </DialogContent>
    </Dialog>
  )
}
