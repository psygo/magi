import { reset } from "@server"

import { getNodes } from "@actions"

import { CanvasProvider } from "@context"

import { Canvas } from "@components"

export default async function HomePage() {
  // await reset()
  const nodes = await getNodes()

  // console.log(nodes)

  return nodes ? (
    <CanvasProvider initialNodes={nodes}>
      <Canvas />
    </CanvasProvider>
  ) : null
}
