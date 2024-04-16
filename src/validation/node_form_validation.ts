import { z } from "zod"

export const nodeFormSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  x: z.number(),
  y: z.number(),
})

export type NodeFormValidation = z.infer<
  typeof nodeFormSchema
>
