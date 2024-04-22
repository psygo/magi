import { z } from "zod"

export const nodeEditFormSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
})

export type NodeEditFormValidation = z.infer<
  typeof nodeEditFormSchema
>
