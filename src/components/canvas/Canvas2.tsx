"use client"

import { useEffect, useMemo, useState } from "react"

import { useDebouncedCallback } from "use-debounce"

import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"

import { useCookies } from "next-client-cookies"

import { useUser as useClerkUser } from "@clerk/nextjs"

import {
  type AppState,
  type ExcalidrawImperativeAPI,
} from "@excalidraw/excalidraw/types/types"
import { type ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"

import { toDate, toPrecision } from "@utils"

import {
  type FieldOfView,
  type SelectNodeWithCreatorAndStats,
} from "@types"

import { postNodes } from "@actions"

import { useLocalStorage } from "@hooks"

import { standardInitialAppState } from "@context"

import { Progress } from "../common/exports"

import { AccountButton } from "../users/exports"

import { Coordinates } from "./Coordinates"

type ScrollAndZoom = {
  scrollX: number
  scrollY: number
  zoom: number
}

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

type Canvas2Props = {
  initialNodes?: SelectNodeWithCreatorAndStats[]
  initialAppState?: AppState
}

export function Canvas2({
  initialNodes = [],
  initialAppState = standardInitialAppState,
}: Canvas2Props) {
  const { isSignedIn } = useClerkUser()

  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI>()

  const [excalElements, setExcalElements] = useState<
    ExcalidrawElement[]
  >(
    initialNodes.map(
      (n) => n.excalData as ExcalidrawElement,
    ),
  )
  const [lastUpdatedShapes, setLastUpdatedShapes] =
    useState<Date>(new Date())

  const { get: getIsDragging, set: setIsDragging } =
    useLocalStorage("isDragging", false)

  const router = useRouter()

  const [excalAppState, setExcalAppState] =
    useState<AppState>(initialAppState)

  /*------------------------------------------------------*/
  /* 2D Pagination */

  const cookies = useCookies()

  const [scrollAndZoom, setScrollAndZoom] =
    useState<ScrollAndZoom>({
      scrollX: initialAppState.scrollX,
      scrollY: initialAppState.scrollY,
      zoom: initialAppState.zoom.value,
    })

  useEffect(() => {
    if (!excalidrawAPI) return

    cookies.set(
      "fieldOfView",
      JSON.stringify({
        xLeft: -scrollAndZoom.scrollX - window.innerWidth,
        xRight:
          -scrollAndZoom.scrollX + 2 * window.innerWidth,
        yTop: -scrollAndZoom.scrollY - window.innerHeight,
        yBottom:
          -scrollAndZoom.scrollY + 2 * window.innerHeight,
      }),
    )

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excalidrawAPI])

  function updateSearchParams() {
    const scrollX = Math.round(scrollAndZoom.scrollX)
    const scrollY = Math.round(scrollAndZoom.scrollY)
    const zoom = toPrecision(scrollAndZoom.zoom)

    const searchParams = new URLSearchParams()
    searchParams.set("scrollX", scrollX.toString())
    searchParams.set("scrollY", scrollY.toString())
    searchParams.set("zoom", zoom.toString())

    const searchParamsString = `?${searchParams.toString()}`
    router.replace(
      `/canvases/open-public${searchParamsString}`,
    )
  }

  function pagination() {
    const appState = excalidrawAPI!.getAppState()

    const scrollX = Math.round(appState.scrollX)
    const scrollY = Math.round(appState.scrollY)
    const zoom = toPrecision(appState.zoom.value)
    const height = Math.round(appState.height / zoom)
    const width = Math.round(appState.width / zoom)

    const currentScreen = {
      xLeft: -scrollX,
      xRight: -scrollX + width,
      yTop: -scrollY,
      yBottom: -scrollY + height,
    }

    const currentFieldOfView: FieldOfView = JSON.parse(
      cookies.get("fieldOfView")!,
    ) as FieldOfView

    if (
      currentScreen.xLeft < currentFieldOfView.xLeft ||
      currentScreen.xRight > currentFieldOfView.xRight ||
      currentScreen.yTop < currentFieldOfView.yTop ||
      currentScreen.yBottom > currentFieldOfView.yBottom
    ) {
      const newFieldOfView: FieldOfView = {
        xLeft: Math.min(
          currentFieldOfView.xLeft,
          currentScreen.xLeft,
        ),
        xRight: Math.max(
          currentFieldOfView.xRight,
          currentScreen.xRight,
        ),
        yTop: Math.min(
          currentFieldOfView.yTop,
          currentScreen.yTop,
        ),
        yBottom: Math.max(
          currentFieldOfView.yBottom,
          currentScreen.yBottom,
        ),
      }

      cookies.set(
        "fieldOfView",
        JSON.stringify(newFieldOfView),
      )
    }
  }

  const debouncedScrollAndZoom = useDebouncedCallback(
    (newScrollAndZoom: ScrollAndZoom) => {
      setScrollAndZoom({ ...newScrollAndZoom })
    },
    1_000,
  )

  useEffect(() => {
    console.log("scroll", scrollAndZoom)
    updateSearchParams()
  }, [scrollAndZoom])

  /*------------------------------------------------------*/

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
        onScrollChange={async () => {
          // await pagination()
          // updateSearchParams()
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
      <Coordinates
        x={excalAppState.scrollX}
        y={excalAppState.scrollY}
      />
    </div>
  )
}
