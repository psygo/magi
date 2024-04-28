"use client"

import { Loader2, Pencil } from "lucide-react"

import { Button, Input, Label, Textarea } from "@shad"

import { type WithReactChildren } from "@types"

import { cn } from "@styles"
import { useState } from "react"

export const autoFocusDefault = {
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

export enum FieldType {
  input,
  textarea,
}

type EditableFieldProps = {
  type?: FieldType
  content: string
  contentClassName?: string
  afterContent?: React.ReactNode
  isEditable?: boolean
  label: string
  placeholder: string
  initialFieldValue: string
  editIconSize?: number
  onSaveHook?: (value: string) => Promise<void>
  loading?: boolean
}

export function EditableField({
  type = FieldType.input,
  content,
  contentClassName,
  afterContent,
  isEditable = true,
  label,
  placeholder,
  initialFieldValue,
  editIconSize = 13,
  onSaveHook,
  loading = false,
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false)

  const [value, setValue] = useState(initialFieldValue)

  return isEditing ? (
    <div className="flex flex-col gap-2">
      <Label htmlFor="field">{label}</Label>
      {type === FieldType.input ? (
        <Input
          id="field"
          placeholder={placeholder}
          autoFocus={isEditing}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      ) : (
        <Textarea
          id="field"
          placeholder={placeholder}
          autoFocus={isEditing}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      )}
      <div className="flex gap-2 justify-end">
        <Button
          variant="outline"
          className="btn w-max border-red-500 text-red-500"
          onClick={() => setIsEditing(false)}
        >
          Cancel
        </Button>
        <Button
          className="w-max"
          disabled={loading}
          onClick={async () => {
            if (onSaveHook) await onSaveHook(value)

            setIsEditing(false)
          }}
        >
          {loading && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Save
        </Button>
      </div>
    </div>
  ) : (
    <div>
      <span
        className={cn(
          value === "" ? "text-gray-400" : "",
          contentClassName,
        )}
      >
        {content}{" "}
        {isEditable && (
          <Button
            variant="ghost"
            className="ml-1 mb-[-8px] p-[3px] h-max"
            onClick={() => setIsEditing(true)}
          >
            <Pencil
              className="text-gray-500"
              style={{
                height: editIconSize,
                width: editIconSize,
              }}
            />
          </Button>
        )}
      </span>
      {afterContent}
    </div>
  )
}
