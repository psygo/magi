import { z } from "zod"

import { type AppState } from "@excalidraw/excalidraw/types/types"

import { CanvasProvider } from "@context"

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
  searchParams,
}: CanvasPageProps) {
  const parsedSearchParams =
    canvasAppStateSchema.parse(searchParams)
  const initialAppState: AppState =
    parsedSearchParams as AppState

  return (
    <CanvasProvider initialAppState={initialAppState}>
      <Canvas />
    </CanvasProvider>
  )
}
