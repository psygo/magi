"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"

import {
  type DebouncedState,
  useDebouncedCallback,
} from "use-debounce"

import { type ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"

import { toPrecision } from "@utils"

import { getNodes } from "@actions"

import {
  type FieldOfView,
  type ScrollAndZoom,
  type WithReactChildren,
} from "@types"

import {
  nodesArrayToRecords2,
  useCanvas2,
} from "./CanvasProvider"

type PaginationContext = {
  debouncedScrollAndZoom: DebouncedState<
    (newScrollAndZoom: ScrollAndZoom) => void
  >
}

const PaginationContext =
  createContext<PaginationContext | null>(null)

type PaginationProviderProps = WithReactChildren

export function PaginationProvider({
  children,
}: PaginationProviderProps) {
  const { excalidrawAPI, excalAppState, nodes, setNodes } =
    useCanvas2()

  const [scrollAndZoom, setScrollAndZoom] =
    useState<ScrollAndZoom>({
      scrollX: excalAppState.scrollX,
      scrollY: excalAppState.scrollY,
      zoom: excalAppState.zoom.value,
    })

  const debouncedScrollAndZoom = useDebouncedCallback(
    (newScrollAndZoom: ScrollAndZoom) =>
      setScrollAndZoom({ ...newScrollAndZoom }),
    100,
  )

  function updateSearchParams() {
    const scrollX = Math.round(scrollAndZoom.scrollX)
    const scrollY = Math.round(scrollAndZoom.scrollY)
    const zoom = toPrecision(scrollAndZoom.zoom)

    const searchParams = new URLSearchParams()
    searchParams.set("scrollX", scrollX.toString())
    searchParams.set("scrollY", scrollY.toString())
    searchParams.set("zoom", zoom.toString())

    const searchParamsString = `?${searchParams.toString()}`
    history.replaceState(
      {},
      "",
      `/canvases/open-public${searchParamsString}`,
    )
  }

  useEffect(() => {
    pagination()
      .then(() => updateSearchParams())
      .catch(() => console.error("error on pagination"))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollAndZoom])

  const [fov, setFov] = useState<FieldOfView>()

  useEffect(() => {
    if (!excalidrawAPI) return
    const appState = excalidrawAPI.getAppState()
    setFov({
      xLeft: 0,
      xRight: appState.width / appState.zoom.value,
      yTop: 0,
      yBottom: appState.height / appState.zoom.value,
    })
  }, [excalidrawAPI])

  async function pagination() {
    if (!excalidrawAPI) return
    const appState = excalidrawAPI.getAppState()

    const scrollX = scrollAndZoom.scrollX
    const scrollY = scrollAndZoom.scrollY
    const height = appState.height
    const width = appState.width
    const zoom = scrollAndZoom.zoom

    const currentScreen = {
      xLeft: -scrollX,
      xRight: -scrollX + width / zoom,
      yTop: -scrollY,
      yBottom: -scrollY + height / zoom,
    }

    const fieldOfView: FieldOfView = fov!

    if (
      currentScreen.xLeft < fieldOfView.xLeft ||
      currentScreen.xRight > fieldOfView.xRight ||
      currentScreen.yTop < fieldOfView.yTop ||
      currentScreen.yBottom > fieldOfView.yBottom
    ) {
      const newFov: FieldOfView = {
        xLeft:
          currentScreen.xLeft < fieldOfView.xLeft
            ? currentScreen.xLeft
            : fieldOfView.xLeft,
        xRight:
          currentScreen.xRight > fieldOfView.xRight
            ? currentScreen.xRight
            : fieldOfView.xRight,
        yTop:
          currentScreen.yTop < fieldOfView.yTop
            ? currentScreen.yTop
            : fieldOfView.yTop,
        yBottom:
          currentScreen.yBottom > fieldOfView.yBottom
            ? currentScreen.yBottom
            : fieldOfView.yBottom,
      }

      const extraDelta = 100
      const newDeltaFovVerticalLeft: FieldOfView = {
        xLeft: newFov.xLeft - extraDelta,
        xRight: fieldOfView.xLeft,
        yTop: newFov.yTop,
        yBottom: newFov.yBottom,
      }
      const newDeltaFovVerticalRight: FieldOfView = {
        xLeft: fieldOfView.xRight,
        xRight: newFov.xRight + extraDelta,
        yTop: newFov.yTop,
        yBottom: newFov.yBottom,
      }
      const newDeltaFovHorizontalTop: FieldOfView = {
        xLeft: fieldOfView.xLeft,
        xRight: fieldOfView.xRight,
        yTop: newFov.yTop - extraDelta,
        yBottom: fieldOfView.yTop,
      }
      const newDeltaFovHorizontalBottom: FieldOfView = {
        xLeft: fieldOfView.xLeft,
        xRight: fieldOfView.xRight,
        yTop: fieldOfView.yBottom,
        yBottom: newFov.yBottom + extraDelta,
      }

      setFov(newFov)

      await getMoreNodes([
        newDeltaFovVerticalLeft,
        newDeltaFovVerticalRight,
        newDeltaFovHorizontalTop,
        newDeltaFovHorizontalBottom,
      ])
    }
  }

  async function getMoreNodes(fov: FieldOfView[]) {
    const newNodes = await getNodes(fov)

    if (!newNodes) return
    excalidrawAPI!.updateScene({
      elements: [
        ...excalidrawAPI!.getSceneElements(),
        ...newNodes.map(
          (n) => n.excalData as ExcalidrawElement,
        ),
      ],
      appState: excalidrawAPI!.getAppState(),
    })
    setNodes({
      ...nodes,
      ...nodesArrayToRecords2(newNodes),
    })
  }

  return (
    <PaginationContext.Provider
      value={{ debouncedScrollAndZoom }}
    >
      {children}
    </PaginationContext.Provider>
  )
}

export function usePagination() {
  const context = useContext(PaginationContext)

  if (!context) {
    throw new Error(
      "`usePagination` must be used within a `PaginationProvider`.",
    )
  }

  return context
}
