"use client"

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Textarea,
} from "@shad"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  nodeFormSchema,
  type NodeFormValidation,
} from "@validation"

import { useGraph } from "@context"

export function NodeForm() {
  const { selectedNode, isCreatingNode, coords } =
    useGraph()

  const nodeForm = useForm<NodeFormValidation>({
    resolver: zodResolver(nodeFormSchema),
    defaultValues: {
      title: selectedNode?.title ?? "",
      description: selectedNode?.description ?? "",
      x: coords!.x,
      y: coords!.y,
    },
  })

  return (
    <Sheet open={isCreatingNode}>
      <SheetContent className="pt-3">
        <SheetHeader>
          <SheetTitle>Create a Node</SheetTitle>
        </SheetHeader>

        <hr className="mt-6" />

        <Form {...nodeForm}>
          <fieldset className="my-6 flex flex-col gap-4">
            <FormField
              control={nodeForm.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="A Great Title"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={nodeForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A great description."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </fieldset>
        </Form>

        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Create</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
