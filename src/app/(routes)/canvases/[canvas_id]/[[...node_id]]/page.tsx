import { z } from "zod"

import { type AppState } from "@excalidraw/excalidraw/types/types"

import { defaultFov } from "@types"

import { getNodes } from "@actions"

import { CanvasProvider } from "@providers"

import { Canvas } from "@components"

type CanvasPageProps = {
  params: { canvas_id: string; node_id: string }
  searchParams: Record<
    string,
    string | string[] | undefined
  >
}

const canvasAppStateSchema = z.object({
  scrollX: z.string().default("0").transform(Number),
  scrollY: z.string().default("0").transform(Number),
  zoom: z
    .string()
    .default("1")
    .transform((v) => ({
      value: parseFloat(v),
    })),
})

export default async function CanvasPage({
  params,
  searchParams,
}: CanvasPageProps) {
  const { canvas_id } = params
  const parsedSearchParams =
    canvasAppStateSchema.parse(searchParams)
  const initialAppState = parsedSearchParams as AppState

  const initialNodes = await getNodes(
    [defaultFov],
    canvas_id,
  )

  return (
    <CanvasProvider
      initialNodes={initialNodes}
      initialAppState={initialAppState}
    >
      <Canvas />
    </CanvasProvider>
  )
}
