import { stockFormZodSchema } from "@/schemas/stockFormZodSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
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
import { Controller, useForm, type SubmitHandler } from "react-hook-form"
import { SpinnerButton } from "./spinner-button"
import { Button } from "@workspace/ui/components/button"
import { useState } from "react"
import { PlusIcon } from "lucide-react"
import type { Stock } from "@/models/stock-model"
import { useInsertStock } from "@/hooks/useInsertStock"

interface ModalProps {
  productId: string
  produtoName: string
}

export default function InsertStockModal({
  productId,
  produtoName,
}: ModalProps) {
  const { control, handleSubmit, reset } = useForm<Stock>({
    resolver: zodResolver(stockFormZodSchema),
    defaultValues: {
      productId: productId,
      quantityInStock: 0,
      quantityMax: 0,
      quantityMin: 0,
    },
  })

  const { mutate } = useInsertStock()

  const [isPending, setIsPending] = useState(false)

  const onSubmit: SubmitHandler<Stock> = (data) => {
    mutate(data)

    reset({
      productId: productId,
      quantityInStock: 0,
      quantityMax: 0,
      quantityMin: 0,
    })
  }

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            size="sm"
            variant={"ghost"}
            className={"cursor-pointer text-sm"}
          >
            <PlusIcon data-icon="inline-start" />
            Adicionar
          </Button>
        }
      />
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Adicionar Produto ao Estoque</FieldLegend>
              <FieldDescription>
                Preencha todos os campos com informações do estoque
              </FieldDescription>
              <FieldGroup>
                <Controller
                  name="productId"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <Input
                        disabled
                        {...field}
                        value={field.value ?? ""}
                        id="productId"
                        placeholder={produtoName}
                        hidden
                      />
                    </Field>
                  )}
                />

                <Field>
                  <FieldLabel htmlFor="quantityInStock">Produto</FieldLabel>
                  <Input disabled placeholder={produtoName} />
                </Field>

                <Controller
                  name="quantityInStock"
                  control={control}
                  render={({
                    field: { onChange, value, ...field },
                    fieldState,
                  }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="quantityInStock">
                        Quantidade Estoque
                      </FieldLabel>
                      <Input
                        {...field}
                        value={value ?? ""}
                        onChange={(e) => {
                          const val = e.target.valueAsNumber
                          onChange(isNaN(val) ? "" : val)
                        }}
                        id="quantityInStock"
                        type="number"
                        placeholder="Digite a quantidade..."
                        min={0}
                      />
                    </Field>
                  )}
                />

                <Controller
                  name="quantityMax"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="quantityMax">
                        Quantidade Máxima
                      </FieldLabel>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        id="quantityMax"
                        type="number"
                        placeholder="Digite a quantidade..."
                        min={0}
                      />
                    </Field>
                  )}
                />

                <Controller
                  name="quantityMin"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="quantityMin">
                        Quantidade Mínima
                      </FieldLabel>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        id="quantityMin"
                        type="number"
                        placeholder="Digite a quantidade..."
                        min={0}
                      />
                    </Field>
                  )}
                />
              </FieldGroup>
            </FieldSet>
            <Field orientation="horizontal">
              {isPending ? (
                <SpinnerButton />
              ) : (
                <Button type="submit">Adicionar</Button>
              )}
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
