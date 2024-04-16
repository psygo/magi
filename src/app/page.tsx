import { db, nodes } from "@server"

import { GraphProvider } from "@context"

import { Graph } from "@components"

export default async function HomePage() {
  const n = await db.select().from(nodes)

  return (
    <GraphProvider initialNodes={n}>
      <Graph />
    </GraphProvider>
  )
}
