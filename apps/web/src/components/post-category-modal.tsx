import { useState } from "react"
import { postCategory } from "@/hooks/useCategories"
import { Button } from "@workspace/ui/components/button"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "@workspace/ui/components/toast"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"

import { Plus, Loader2 } from "lucide-react"

import { Controller, useForm, type Resolver, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { categoryFormZodSchema } from "@/schemas/categoryFormZodSchema"

type CategoryFormValues = {
  name: string
  description: string
}

export default function PostCategoryModal() {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const {
    control,
    handleSubmit,
    reset,
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormZodSchema) as Resolver<CategoryFormValues>,
    defaultValues: { name: "", description: "" },
  })

  const { mutate, isPending } = useMutation({
    mutationKey: ["postCategory"],
    mutationFn: async (data: CategoryFormValues) => await postCategory(data),

    onSuccess: async () => {
      toast.add({ title: "Categoria cadastrada com sucesso!", type: "success" })
      await queryClient.invalidateQueries({
        queryKey: ["categories"],
        exact: false,
      })
      reset()
      setOpen(false)
    },
    onError: (error) => {
      console.error("Erro ao cadastrar categoria:", error)
      toast.add({
        title: "Erro ao cadastrar categoria",
        description: "Verifique os dados e tente novamente.",
        type: "error",
      })
    },
  })

  const onSubmit: SubmitHandler<CategoryFormValues> = (data) => {
    mutate(data)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) reset()
      }}
    >
      <DialogTrigger
        render={
          <Button className="font-medium">
            Adicionar <Plus />
          </Button>
        }
      />

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar categoria</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para criar uma nova categoria.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <FieldSet>
              <FieldLegend className="sr-only">Dados da categoria</FieldLegend>
              <FieldDescription className="sr-only">
                Preencha todos os campos com informações da categoria
              </FieldDescription>
              <FieldGroup>
                <Controller
                  name="name"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="name">Nome</FieldLabel>
                      <Input
                        {...field}
                        id="name"
                        placeholder="Nome da categoria..."
                        aria-invalid={fieldState.invalid}
                        disabled={isPending}
                      />
                      {fieldState.error ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : null}
                    </Field>
                  )}
                />
                <Controller
                  name="description"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="description">Descrição</FieldLabel>
                      <Input
                        {...field}
                        id="description"
                        placeholder="Descrição da categoria..."
                        aria-invalid={fieldState.invalid}
                        disabled={isPending}
                      />
                      {fieldState.error ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : null}
                    </Field>
                  )}
                />
              </FieldGroup>
            </FieldSet>

            <Field orientation="horizontal">
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cadastrando...
                  </>
                ) : (
                  "Cadastrar"
                )}
              </Button>
              <DialogClose
                render={
                  <Button variant={"outline"} type="button" disabled={isPending}>
                    Cancelar
                  </Button>
                }
              />
            </Field>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
