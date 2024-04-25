// import { reset } from "@server"

import { getNodes } from "@actions"

import { CanvasProvider } from "@context"

import { Canvas } from "@components"

export default async function HomePage() {
  // await reset({ deleteNodes: true, deleteUsers: true })

  const nodes = await getNodes()

  return (
    <CanvasProvider initialNodes={nodes}>
      <Canvas />
    </CanvasProvider>
  )
}
