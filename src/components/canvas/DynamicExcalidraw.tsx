"use client"

import dynamic from "next/dynamic"

import { Progress } from "../common/exports"

/*--------------------------------------------------------*/

export const Excalidraw = dynamic(
  async () => {
    const mod = await import("@excalidraw/excalidraw")
    return mod.Excalidraw
  },
  {
    loading: () => <Progress />,
    ssr: false,
  },
)

/*--------------------------------------------------------*/

export const DynamicMainMenu = dynamic(
  async () => {
    const mod = await import("@excalidraw/excalidraw")
    return mod.MainMenu
  },
  {
    ssr: false,
  },
)

/*--------------------------------------------------------*/

export const DynamicMainMenuItem = dynamic(
  async () => {
    const mod = await import("@excalidraw/excalidraw")
    return mod.MainMenu.Item
  },
  {
    ssr: false,
  },
)

export const DynamicMainMenuExport = dynamic(
  async () => {
    const mod = await import("@excalidraw/excalidraw")
    return mod.MainMenu.DefaultItems.Export
  },
  {
    ssr: false,
  },
)

export const DynamicMainMenuSaveAsImage = dynamic(
  async () => {
    const mod = await import("@excalidraw/excalidraw")
    return mod.MainMenu.DefaultItems.SaveAsImage
  },
  {
    ssr: false,
  },
)

export const DynamicMainMenuHelp = dynamic(
  async () => {
    const mod = await import("@excalidraw/excalidraw")
    return mod.MainMenu.DefaultItems.Help
  },
  {
    ssr: false,
  },
)

/*--------------------------------------------------------*/
