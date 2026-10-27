import * as React from "react"
import type { CategoryProps } from "@/types/category"
import { Button } from "@workspace/ui/components/button"
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
import { ImagePlus, Plus, X } from "lucide-react"

import { Controller, useForm, type Resolver, type SubmitHandler } from "react-hook-form"
import { productFormZodSchema } from "@/schemas/productFormZodSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Product } from "@/models/product-model"
import { useInsertProduct } from "@/hooks/useInsertProduct"
import { SpinnerButton } from "./spinner-button"
import { Status } from "@/types/product"
import { cn } from "cn"

interface PostModalProps {
  categories?: CategoryProps[] | undefined
}

const MAX_IMAGES = 10
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024 // 5MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"]

export default function PostModal({ categories }: PostModalProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([])
  const [fileError, setFileError] = React.useState<string | null>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)

  const { control, handleSubmit, setValue, reset } = useForm<Product>({
    // z.coerce.number() faz o input do schema ser `unknown`; o cast mantém o
    // tipo do formulário igual ao tipo de saída validado pelo Zod.
    resolver: zodResolver(productFormZodSchema) as Resolver<Product>,
    defaultValues: {
      name: "",
      price: 0,
      status: Status.ACTIVE,
      categoryId: "",
      description: "",
      images: [],
    },
  })

  const { mutate, isPending } = useInsertProduct()

  // Gerencia as URLs de preview com cleanup de memória
  const previews = React.useMemo(() => {
    return selectedFiles.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    }))
  }, [selectedFiles])

  React.useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url))
    }
  }, [previews])

  const handleFiles = (incoming: File[]) => {
    setFileError(null)

    const validFiles: File[] = []
    for (const file of incoming) {
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        setFileError(
          `Arquivo "${file.name}" inválido. Permitido apenas JPG, PNG ou WEBP.`
        )
        return
      }
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        setFileError(
          `Arquivo "${file.name}" excede o tamanho máximo de 5MB.`
        )
        return
      }
      validFiles.push(file)
    }

    const merged = [...selectedFiles, ...validFiles]
    if (merged.length > MAX_IMAGES) {
      setFileError(
        `Limite excedido: você pode selecionar no máximo ${MAX_IMAGES} imagens.`
      )
      return
    }

    setSelectedFiles(merged)
    setValue("images", merged, { shouldValidate: true })
  }

  const handleRemoveImage = (indexToRemove: number) => {
    const updated = selectedFiles.filter((_, idx) => idx !== indexToRemove)
    setSelectedFiles(updated)
    setValue("images", updated, { shouldValidate: true })
    setFileError(null)
  }

  const resetForm = () => {
    reset({
      name: "",
      price: 0,
      status: Status.ACTIVE,
      categoryId: "",
      description: "",
      images: [],
    })
    setSelectedFiles([])
    setFileError(null)
  }

  const onSubmit: SubmitHandler<Product> = (data) => {
    mutate(
      {
        ...data,
        images: selectedFiles,
      },
      {
        onSuccess: () => {
          resetForm()
          setOpen(false)
        },
      }
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) {
          resetForm()
        }
      }}
    >
      <DialogTrigger
        render={
          <Button className="font-extrabold" variant="default">
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
                Preencha todos os campos com informações e imagens do produto
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
                        step="0.01"
                        placeholder="Digite o valor do produto..."
                        required
                      />
                    </Field>
                  )}
                />

                <Controller
                  name="categoryId"
                  control={control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel htmlFor="categoryId">Categoria</FieldLabel>

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
                              <SelectItem value="Nenhuma categoria cadastrada">
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
                  render={({ field }) => (
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
                            <SelectItem value="ACTIVE">Ativo</SelectItem>
                            <SelectItem value="INACTIVE">Inativo</SelectItem>
                            <SelectItem value="OUT_OF_STOCK">
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

            {/* Seção de Upload de Imagens */}
            <FieldSet>
              <FieldLegend>Imagens do Produto</FieldLegend>
              <FieldDescription>
                Adicione fotos do produto (JPG, PNG ou WEBP até 5MB cada, máximo de 10)
              </FieldDescription>

              <FieldGroup>
                {selectedFiles.length < MAX_IMAGES && (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault()
                      setIsDragging(true)
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault()
                      setIsDragging(false)
                      if (e.dataTransfer.files) {
                        handleFiles(Array.from(e.dataTransfer.files))
                      }
                    }}
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 text-center cursor-pointer transition-colors",
                      isDragging
                        ? "border-blue-500 bg-blue-50/50"
                        : "border-gray-300 hover:border-gray-400 bg-gray-50/50"
                    )}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) {
                          handleFiles(Array.from(e.target.files))
                        }
                        e.target.value = ""
                      }}
                    />
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <ImagePlus className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-700">
                        Clique para selecionar ou arraste imagens aqui
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Formatos: JPG, PNG ou WEBP (até 5MB cada)
                      </p>
                    </div>
                  </div>
                )}

                {fileError && (
                  <p className="text-xs font-medium text-red-600">{fileError}</p>
                )}

                {previews.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{selectedFiles.length} de {MAX_IMAGES} imagens</span>
                      <span className="text-[11px] text-gray-400">
                        A primeira imagem será a principal
                      </span>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                      {previews.map((preview, index) => (
                        <div
                          key={preview.url}
                          className="group relative aspect-square overflow-hidden rounded-md border border-gray-200 bg-gray-100 shadow-sm"
                        >
                          <img
                            src={preview.url}
                            alt={preview.name}
                            className="h-full w-full object-cover"
                          />
                          {index === 0 && (
                            <span className="absolute bottom-1 left-1 rounded bg-black/75 px-1 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                              Principal
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRemoveImage(index)
                            }}
                            className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white opacity-90 shadow-sm transition hover:scale-110 hover:bg-red-700"
                            title="Remover imagem"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
              {isPending ? (
                <SpinnerButton />
              ) : (
                <Button type="submit">Cadastrar</Button>
              )}
              <DialogClose
                render={
                  <Button variant="outline" type="button">
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
