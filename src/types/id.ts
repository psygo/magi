import { z } from "zod"

export const stringIdSchema = z.string()
export type StringId = z.infer<typeof stringIdSchema>

export const clerkIdSchema = z.string()
export type ClerkId = z.infer<typeof clerkIdSchema>

export const usernameSchema = z.string()
export type Username = z.infer<typeof usernameSchema>

export const emailSchema = z.string().email()
export type Email = z.infer<typeof emailSchema>
