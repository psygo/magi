"use client"

import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  //   Label,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@shad"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  nodeFormSchema,
  type NodeFormValidation,
} from "@validation"

import { useGraph } from "@context"

export function NodeForm() {
  const { isCreatingNode } = useGraph()

  const nodeForm = useForm<NodeFormValidation>({
    resolver: zodResolver(nodeFormSchema),
  })

  return (
    <Sheet open={isCreatingNode}>
      <SheetContent className="pt-3">
        <SheetHeader>
          <SheetTitle>Create a Node</SheetTitle>
          <SheetDescription>
            Create a new content node.
          </SheetDescription>
        </SheetHeader>

        <section className="my-6">
          <Form {...nodeForm}>
            <FormField
              control={nodeForm.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="A great title"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>
        </section>

        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Create</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
