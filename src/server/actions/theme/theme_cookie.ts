"use server"

import { cookies } from "next/headers"

import { type Theme } from "@types"

export async function saveTheme(theme: Theme) {
  try {
    const cookieStore = cookies()
    cookieStore.set("theme", theme)
  } catch (e) {
    console.error(e)
  }
}
