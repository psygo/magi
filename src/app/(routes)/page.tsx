import { getNodes } from "@actions"

import { CanvasProvider } from "@context"

import { Canvas } from "@components"

export default async function HomePage() {
  const nodes = await getNodes()

  return (
    <CanvasProvider initialNodes={nodes}>
      <Canvas />
    </CanvasProvider>
  )
}
