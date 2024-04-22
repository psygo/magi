import { getEdges, getNodes } from "@actions"

import { CanvasProvider } from "@context"

import { Canvas } from "@components"

export default async function HomePage() {
  const [nodes, edges] = await Promise.all([
    getNodes(),
    getEdges(),
  ])

  return nodes ? (
    <CanvasProvider
      initialNodes={nodes}
      initialEdges={edges}
    >
      <Canvas />
    </CanvasProvider>
  ) : null
}
