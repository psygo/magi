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
            <Moon style={{ height: 14, width: 14 }} />
          )
        }
      >
        Toggle Theme
      </MainMenu.Item>
      <MainMenu.Item
        onSelect={() => setShowMeta(!showMeta)}
        icon={
          showMeta ? (
            <Braces style={{ height: 14, width: 14 }} />
          ) : (
            <X style={{ height: 14, width: 14 }} />
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
            <Grid3X3 style={{ height: 14, width: 14 }} />
          ) : (
            <X style={{ height: 14, width: 14 }} />
          )
        }
      >
        Show Grid
      </MainMenu.Item>
      <MainMenu.Item
        onSelect={() => setShowCoords(!showCoords)}
        icon={
          showCoords ? (
            <Move3D style={{ height: 14, width: 14 }} />
          ) : (
            <X style={{ height: 14, width: 14 }} />
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
