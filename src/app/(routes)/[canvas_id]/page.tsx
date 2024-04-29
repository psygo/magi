import { z } from "zod"

import { type AppState } from "@excalidraw/excalidraw/types/types"

import { getNodes } from "@actions"

import { CanvasProvider } from "@context"

import { Canvas } from "@components"

type CanvasPageProps = {
  params: { canvas_id: string }
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
    .default("0.8")
    .transform((v) => ({
      value: parseFloat(v),
    })),
})

export default async function CanvasPage({
  searchParams,
}: CanvasPageProps) {
  const parsedSearchParams =
    canvasAppStateSchema.parse(searchParams)
  const initialAppState: AppState =
    parsedSearchParams as AppState

  const nodes = await getNodes()

  return (
    <CanvasProvider
      initialNodes={nodes}
      initialAppState={initialAppState}
    >
      <Canvas />
    </CanvasProvider>
  )
}
