import { Card, CardContent } from "@shad"

type CoordinatesProps = {
  x: number
  y: number
}

export function Coordinates({ x, y }: CoordinatesProps) {
  return (
    <Card className="p-3 fixed z-50 bottom-[68px] right-4">
      <CardContent className="p-0 flex flex-col gap-2">
        <div className="flex gap-2">
          <p>X</p>
          <p className="font-bold">{x}</p>
        </div>
        <div className="flex gap-2">
          <p>Y</p>
          <p className="font-bold">{y}</p>
        </div>
      </CardContent>
    </Card>
  )
}
