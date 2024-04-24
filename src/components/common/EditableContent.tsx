import { Pencil } from "lucide-react"

import { Button } from "@shad"

import { type WithReactChildren } from "@types"

import { cn } from "@styles"

export const autoFocus = {
  autoFocus: true,
  onFocus: (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
  ) =>
    e.currentTarget.setSelectionRange(
      e.currentTarget.value.length,
      e.currentTarget.value.length,
    ),
}

type EditableContentEditContainerProps =
  WithReactChildren & {
    onSave: () => void
    onCancel: () => void
  }

export function EditableContentContainerEdit({
  onSave,
  onCancel,
  children,
}: EditableContentEditContainerProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSave()
      }}
      className="flex flex-col gap-2 justify-start"
    >
      {children}
      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="outline"
          className="btn border-red-500 text-red-500"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  )
}

type EditableContentViewContainerProps =
  WithReactChildren & {
    onEdit?: () => void
    iconSize?: number
    showEditButton?: boolean
  }

export function EditableContentContainerView({
  onEdit,
  iconSize = 13,
  showEditButton = true,
  children,
}: EditableContentViewContainerProps) {
  return (
    <div className={cn("flex gap-2 items-center")}>
      {children}
      {showEditButton && (
        <PencilButton iconSize={iconSize} onEdit={onEdit} />
      )}
    </div>
  )
}

type PencilButtonProps = Pick<
  EditableContentViewContainerProps,
  "onEdit" | "iconSize"
>

export function PencilButton({
  iconSize = 13,
  onEdit,
}: PencilButtonProps) {
  return (
    <Button
      variant="ghost"
      className="p-0 px-2 mt-[1px] h-max"
      onClick={onEdit}
    >
      <Pencil
        className={cn(
          "text-gray-500",
          `h-[${iconSize}px] w-[${iconSize}px]`,
        )}
      />
    </Button>
  )
}
