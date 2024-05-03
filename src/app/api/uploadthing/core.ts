import "server-only"

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  createUploadthing,
  type FileRouter,
} from "uploadthing/next"
import { UploadThingError } from "uploadthing/server"

import { userIdFromClerk } from "@server"

const f = createUploadthing()

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async () => {
      const userId = await userIdFromClerk()

      if (!userId)
        throw new UploadThingError("Unauthorized")

      return { userId }
    })
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    .onUploadComplete(async () => {}),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
