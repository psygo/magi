import { z } from "zod"

export const nodeFormSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
})

export type NodeFormValidation = z.infer<
  typeof nodeFormSchema
>
