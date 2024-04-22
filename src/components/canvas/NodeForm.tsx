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
  SheetTrigger,
  Textarea,
} from "@shad"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  nodeEditFormSchema,
  type NodeEditFormValidation,
} from "@validation"

export function NodeForm() {
  const nodeForm = useForm<NodeEditFormValidation>({
    resolver: zodResolver(nodeEditFormSchema),
  })

  async function onSubmit(values: NodeEditFormValidation) {
    // await postNode(
    //   values.title,
    //   values.description ?? "",
    //   coords!.x,
    //   coords!.y,
    // )
  }

  return (
    <Sheet
    // open={isCreatingNode}
    // onOpenChange={setIsCreatingNode}
    >
      <SheetTrigger></SheetTrigger>
      <SheetContent className="pt-3">
        <SheetHeader>
          <SheetTitle>Create a Node</SheetTitle>
        </SheetHeader>

        <hr className="mt-6" />

        <Form {...nodeForm}>
          <form
            id="node-form"
            onSubmit={nodeForm.handleSubmit(onSubmit)}
          >
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
          </form>
        </Form>

        <SheetFooter>
          <SheetClose asChild>
            <Button form="node-form" type="submit">
              Create
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
