import { Card, CardContent } from "@shad"

type CoordinatesProps = {
  x: number
  y: number
}

export function Coordinates({ x, y }: CoordinatesProps) {
  return (
    <Card className="p-2 fixed z-50 bottom-[68px] left-4 bg-[#ececf4] dark:bg-[#23232a]">
      <CardContent className="p-0 flex flex-col gap-2 text-xs">
        <div className="flex gap-2">
          <p className="text-gray-400">X</p>
          <p>{Math.round(x)}</p>
        </div>
        <div className="flex gap-2">
          <p className="text-gray-400">Y</p>
          <p>{Math.round(y)}</p>
        </div>
      </CardContent>
    </Card>
  )
}
