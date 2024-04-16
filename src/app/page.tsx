import { reset } from "@server/db/reset"

import { GraphProvider } from "@context"

import { Graph } from "@components"

export default async function HomePage() {
  await reset()

  return (
    <GraphProvider>
      <Graph />
    </GraphProvider>
  )
}
