"use client"

import {
  Braces,
  Grid3X3,
  Moon,
  Move3D,
  Sun,
  X,
} from "lucide-react"

import { MainMenu } from "@excalidraw/excalidraw"

import { Theme } from "@types"

import { saveTheme } from "@actions"

import { usePreferences, useTheme } from "@providers"

export function CanvasMenu() {
  const { theme, cycleTheme } = useTheme()

  const {
    showMeta,
    setShowMeta,
    gridModeEnabled,
    setGridModeEnabled,
    showCoords,
    setShowCoords,
  } = usePreferences()

  return (
    <MainMenu>
      <MainMenu.Item
        onSelect={async () => {
          const nextTheme = cycleTheme()
          await saveTheme(nextTheme)
        }}
        icon={
          theme === Theme.light ? (
            <Sun className="h-[14px] w-[14px]" />
          ) : (
            <Moon className="h-[14px] w-[14px]" />
          )
        }
      >
        Toggle Theme
      </MainMenu.Item>

      <MainMenu.Item
        onSelect={() => setShowMeta(!showMeta)}
        icon={
          showMeta ? (
            <Braces className="h-[14px] w-[14px]" />
          ) : (
            <X className="h-[14px] w-[14px]" />
          )
        }
      >
        Show Metadata
      </MainMenu.Item>

      <MainMenu.Item
        onSelect={() =>
          setGridModeEnabled(!gridModeEnabled)
        }
        icon={
          gridModeEnabled ? (
            <Grid3X3 className="h-[14px] w-[14px]" />
          ) : (
            <X className="h-[14px] w-[14px]" />
          )
        }
      >
        Show Grid
      </MainMenu.Item>
      <MainMenu.Item
        onSelect={() => setShowCoords(!showCoords)}
        icon={
          showCoords ? (
            <Move3D className="h-[14px] w-[14px]" />
          ) : (
            <X className="h-[14px] w-[14px]" />
          )
        }
      >
        Show Coordinates
      </MainMenu.Item>

      <MainMenu.DefaultItems.Export />
      <MainMenu.DefaultItems.SaveAsImage />
      <MainMenu.DefaultItems.Help />
    </MainMenu>
  )
}
