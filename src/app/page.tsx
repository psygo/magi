import { reset } from "@server/db/reset"

import { Graph } from "@components"

export default async function HomePage() {
  await reset()

  return <Graph />
}
