import { postProduct } from "@/hooks/useFetchProducts"
import type { CategoryProps } from "@/types/category"
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
  FieldSeparator,
  FieldSet,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Textarea } from "@workspace/ui/components/textarea"
import { Plus } from "lucide-react"

import { Controller, useForm, type SubmitHandler } from "react-hook-form"
import { productFormZodSchema } from "@/schemas/productFormZodSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Product } from "@/models/product-model"
import { useNavigate } from "@tanstack/react-router"
interface PostModalProps {
  categories?: CategoryProps[] | undefined
}

export default function PostModal({ categories }: PostModalProps) {
  const { control, handleSubmit, setValue } = useForm<Product>({
    resolver: zodResolver(productFormZodSchema),
  })

  const navigate = useNavigate()

  const { refetch } = useQuery({
    queryKey: ["products"],
  })

  const { mutate } = useMutation({
    mutationKey: ["postProduct"],
    mutationFn: async (data: Product) => await postProduct(data),
    onSuccess: () => {
      navigate({ to: "/product-list" })
      refetch()
    },
  })

  const onSubmit: SubmitHandler<Product> = (data) => {
    mutate(data)
    setValue("name", "")
    setValue("price", 0)
    setValue("categoryId", "")
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

      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Cadastrar Produto</FieldLegend>
              <FieldDescription>
                Preencha todos os campos com informações do produto
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
                        placeholder="Nome do produto..."
                        required
                      />
                    </Field>
                  )}
                />
                <Controller
                  name="price"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="price">Preço</FieldLabel>
                      <Input
                        {...field}
                        id="price"
                        type="number"
                        placeholder="Digite o valor do produto..."
                        required
                      />
                    </Field>
                  )}
                />

                <Controller
                  name="categoryId"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="category">Categoria</FieldLabel>

                      {categories && categories.length > 0 ? (
                        <Select
                          name={field.name}
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger id="categoryId">
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {categories.map((item) => (
                                <SelectItem key={item.id} value={item.id}>
                                  {item.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Select>
                          <SelectTrigger id="categoryId">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem
                                value={"Nenhuma categoria cadastrada"}
                              >
                                Nenhuma categoria cadastrada
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="status"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="status">Status</FieldLabel>

                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Selecione um status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value={"ACTIVE"}>Ativo</SelectItem>
                            <SelectItem value={"INACTIVE"}>Inativo</SelectItem>
                            <SelectItem value={"OUT_OF_STOCK"}>
                              Fora de Estoque
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />
              </FieldGroup>
            </FieldSet>
            <FieldSeparator />

            <FieldSet>
              <FieldGroup>
                <Controller
                  name="description"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="description">Descrição</FieldLabel>
                      <Textarea
                        {...field}
                        id="description"
                        placeholder="Digite a descrição do produto"
                        className="resize-none"
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
