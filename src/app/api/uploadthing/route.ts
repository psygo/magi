import "server-only"

import { createRouteHandler } from "uploadthing/next"

import { magiFileRouter } from "./core"

export const { GET, POST } = createRouteHandler({
  router: magiFileRouter,
})
