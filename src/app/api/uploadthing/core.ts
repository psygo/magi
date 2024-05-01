/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  createUploadthing,
  type FileRouter,
} from "uploadthing/next"

const f = createUploadthing()

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      // TODO: add user guard
      // console.log("req", req)
      return {}
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // console.log("file", file)
      // console.log("metadata", metadata)
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
