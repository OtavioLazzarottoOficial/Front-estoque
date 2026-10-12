import { postCategory } from "@/hooks/useFetchCategories"
import { Button } from "@workspace/ui/components/button"
import { useMutation, useQuery } from "@tanstack/react-query"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"

import { Plus } from "lucide-react"

import { Controller, useForm } from "react-hook-form"

export default function PostCategoryModal() {
  const { control, handleSubmit, setValue } = useForm()

  const { mutate } = useMutation({
    mutationKey: ["postCategory"],
    mutationFn: async (data) => await postCategory(data),
  })

  function onSubmit(data) {
    mutate(data)
    setValue("name", "")
    setValue("description", "")
  }
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button className={"font-extrabold"} variant={"default"}>
            Adicionar <Plus color="white" />
          </Button>
        }
      />

      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Cadastrar Categoria</FieldLegend>
              <FieldDescription>
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
                        required
                      />
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
                        required
                      />
                    </Field>
                  )}
                />
              </FieldGroup>
            </FieldSet>

            <Field orientation="horizontal">
              <Button type="submit">Cadastrar</Button>
              <DialogClose
                render={
                  <Button variant={"outline"} type="button">
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
