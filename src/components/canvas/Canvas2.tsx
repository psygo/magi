"use client"

import { useEffect, useMemo, useState } from "react"

import { useDebouncedCallback } from "use-debounce"

import dynamic from "next/dynamic"

import { useUser as useClerkUser } from "@clerk/nextjs"

import { type ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"

import { toDate, toPrecision } from "@utils"

import {
  type ScrollAndZoom,
  type FieldOfView,
} from "@types"

import { getNodes, postNodes } from "@actions"

import { useLocalStorage } from "@hooks"

import { Progress } from "../common/exports"

import { AccountButton } from "../users/exports"

import { Coordinates } from "./Coordinates"
import {
  nodesArrayToRecords,
  useCanvas2,
} from "../../context/CanvasProvider"
import { point } from "@excalidraw/excalidraw/types/ga"

const Excalidraw = dynamic(
  async () => {
    const mod = await import("@excalidraw/excalidraw")
    return mod.Excalidraw
  },
  {
    loading: () => <Progress />,
    ssr: false,
  },
)

export function Canvas2() {
  const { isSignedIn } = useClerkUser()

  const {
    excalidrawAPI,
    setExcalidrawAPI,
    excalElements,
    setExcalElements,
    excalAppState,
    setExcalAppState,
    nodes,
    setNodes,
  } = useCanvas2()

  const [lastUpdatedShapes, setLastUpdatedShapes] =
    useState<Date>(new Date())

  const { get: getIsDragging, set: setIsDragging } =
    useLocalStorage("isDragging", false)

  /*------------------------------------------------------*/
  /* 2D Pagination */

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
        yTop: newFov.yTop + extraDelta,
        yBottom: fieldOfView.yTop,
      }
      const newDeltaFovHorizontalBottom: FieldOfView = {
        xLeft: fieldOfView.xLeft,
        xRight: fieldOfView.xRight,
        yTop: fieldOfView.yBottom,
        yBottom: newFov.yBottom - extraDelta,
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

    console.log("new nodes", newNodes?.length)

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
      ...nodesArrayToRecords(newNodes),
    })
  }

  /*------------------------------------------------------*/

  const [pointer, setPointer] = useState<{
    x: number
    y: number
  }>({ x: 0, y: 0 })

  const Excal = useMemo(() => {
    return (
      <Excalidraw
        name="Magi"
        UIOptions={{
          canvasActions: {
            clearCanvas: false,
            toggleTheme: true,
          },
        }}
        gridModeEnabled
        renderTopRightUI={() => <AccountButton />}
        initialData={{
          elements: excalElements,
          appState: excalAppState,
        }}
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
        onPointerUpdate={({ pointer }) => {
          setPointer(pointer)
        }}
        onScrollChange={async () => {
          const appState = excalidrawAPI!.getAppState()
          debouncedScrollAndZoom({
            scrollX: appState.scrollX,
            scrollY: appState.scrollY,
            zoom: appState.zoom.value,
          })
        }}
        onChange={(elements, appState) => {
          if (appState.pendingImageElementId) return

          appState.draggingElement
            ? setIsDragging(true)
            : setIsDragging(false)

          setExcalElements([...elements])
          setExcalAppState(appState)
        }}
      />
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excalidrawAPI])

  /*------------------------------------------------------*/
  /* Upload Shape */

  const {
    get: getIsUploadingShape,
    set: setIsUploadingShape,
  } = useLocalStorage("isUploadingShape", false)

  async function uploadShape(els: ExcalidrawElement[]) {
    const isUploadingShape = getIsUploadingShape()
    const isDragging = getIsDragging()

    if (isUploadingShape || isDragging) return

    setIsUploadingShape(true)
    const newNodes = await postNodes(els)
    setIsUploadingShape(false)

    if (!newNodes) return

    setLastUpdatedShapes(new Date())
  }

  useEffect(() => {
    if (!isSignedIn) return

    setTimeout(() => {
      const notUpdatedYet = excalElements.filter(
        (el) => toDate(el.updated) > lastUpdatedShapes,
      )

      if (notUpdatedYet.length === 0) return

      uploadShape(notUpdatedYet).catch(() =>
        console.error("error"),
      )
    }, 250)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excalElements, lastUpdatedShapes, isSignedIn])

  /*------------------------------------------------------*/

  return (
    <div className="absolute w-screen h-screen">
      {Excal}
      <Coordinates x={pointer.x} y={pointer.y} />
    </div>
  )
}
