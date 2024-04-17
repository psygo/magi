import { getNodes } from "@server"

import { GraphProvider } from "@context"

import { Graph } from "@components"

export default async function HomePage() {
  const nodes = await getNodes()

  return (
    <GraphProvider initialNodes={nodes}>
      <Graph />
    </GraphProvider>
  )
}
