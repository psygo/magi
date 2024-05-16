import "server-only"

import {
  createUploadthing,
  type FileRouter,
} from "uploadthing/next"
import { UploadThingError } from "uploadthing/server"

import { userIdFromClerk } from "@server"

const f = createUploadthing()

export const magiFileRouter = {
  imageUploader: f({ image: { maxFileSize: "2MB" } })
    .onUploadError(({ error }) => {
      console.error(
        "UploadThing Router Error: ",
        error.message,
      )
    })
    .middleware(async () => {
      const userId = await userIdFromClerk()

      if (!userId)
        throw new UploadThingError("Unauthorized")

      return { userId }
    })
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    .onUploadComplete(async () => {}),
} satisfies FileRouter

export type OurFileRouter = typeof magiFileRouter
