import { useUser as useClerkUser } from "@clerk/nextjs"

import { FolderKanban } from "lucide-react"

import {
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@shad"

export function CanvasModal() {
  const { user, isSignedIn } = useClerkUser()

  if (!isSignedIn) return

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
        <h2 className="text-lg font-semibold">
          @{user.username}&apos;s Canvases
        </h2>
      </DialogContent>
    </Dialog>
  )
}
