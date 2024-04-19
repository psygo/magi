import { type ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"

import { type ExcalAppState } from "@types"

import { getNodes } from "@actions"

import { CanvasProvider } from "@context"

import { Canvas } from "@components"
import { reset } from "../../server/exports"

const initialElements: ExcalidrawElement[] = Array.from(
  { length: 10 },
  (_, i) => ({
    id: `-Aalzqg7oYo-c_9iZDciK${i}`,
    type: "rectangle",
    x: 218.44921875 + i,
    y: 102.51171875 + i,
    width: 167.57421875,
    height: 146.2109375,
    angle: 0,
    strokeColor: "#1e1e1e",
    backgroundColor: "transparent",
    fillStyle: "solid",
    strokeWidth: 2,
    strokeStyle: "solid",
    roughness: 1,
    opacity: 100,
    groupIds: [],
    frameId: null,
    roundness: {
      type: 3,
    },
    seed: 562430449,
    version: 39,
    versionNonce: 822351153,
    isDeleted: false,
    boundElements: null,
    updated: 1713531961485,
    link: null,
    locked: false,
  }),
)

const initialAppState: ExcalAppState = {
  viewBackgroundColor: "#a5d8ff",
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  zoom: { value: 1 },
}

export default async function HomePage() {
  // await reset()
  const nodes = await getNodes()

  // console.log(nodes?.map((n) => n.excalData))

  // return <></>

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
