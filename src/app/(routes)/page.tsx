// import { reset } from "@server"

import { redirect } from "next/navigation"

export default async function HomePage() {
  // await reset({ deleteNodes: true, deleteUsers: true })

  redirect("/canvases/open-canvas")
}
