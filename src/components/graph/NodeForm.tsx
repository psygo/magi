import {
  Button,
  Input,
  Label,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@shad"

type NodeFormProps = {
  open?: boolean
}

export function NodeForm({ open = false }: NodeFormProps) {
  return (
    <Sheet open={open}>
      <SheetContent className="pt-3">
        <SheetHeader>
          <SheetTitle>Create a Node</SheetTitle>
          <SheetDescription>
            Create a new content node.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-8 py-8">
          <div className="flex flex-col gap-4">
            <Label htmlFor="title" className="pl-3">
              Title
            </Label>
            <Input id="title" value="A great title" />
          </div>
          <div className="flex flex-col gap-4">
            <Label htmlFor="title" className="pl-3">
              Description
            </Label>
            <Input id="title" value="A great description" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Create</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
