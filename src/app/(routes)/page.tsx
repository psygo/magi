import { reset } from "@server"

import { getEdges, getNodes } from "@actions"

import { CanvasProvider } from "@context"

import { Canvas } from "@components"

export default async function HomePage() {
  // await reset()
  const [nodes, edges] = await Promise.all([
    getNodes(),
    getEdges(),
  ])

  // console.log(nodes)

  return nodes ? (
    <CanvasProvider
      initialNodes={nodes}
      initialEdges={edges}
    >
      <Canvas />
    </CanvasProvider>
  ) : null
}
