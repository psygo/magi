import { getNodes } from "@server"

import { GraphProvider } from "@context"

import { Graph } from "@components"

export default async function HomePage() {
  const n = await getNodes()

  return (
    <GraphProvider initialNodes={n}>
      <Graph />
    </GraphProvider>
  )
}
