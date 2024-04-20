import { type ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"

import { reset } from "@server"

import { getNodes } from "@actions"

import { CanvasProvider, initialAppState } from "@context"

import { Canvas } from "@components"

export default async function HomePage() {
  // await reset()
  const nodes = await getNodes()

  return nodes ? (
    <CanvasProvider
      initialData={{
        elements: nodes?.map(
          (n) => n.excalData as ExcalidrawElement,
        ),
        appState: initialAppState,
      }}
      initialNodes={nodes}
    >
      <Canvas />
    </CanvasProvider>
  ) : null
}
