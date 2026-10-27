import z from "zod"
import { useZodForm } from "../hooks/useZodForm"
import { Status } from "@/types/product"

export const productFormZodSchema = z.object({
  id: z.uuid().optional(),
  name: z.string().min(1, "O nome do produto é obrigatório"),
  description: z.string().min(1, "A descrição é obrigatória"),
  sku: z.string().optional(),
  price: z.coerce.number().min(0, "O preço não pode ser menor que zero"),
  categoryId: z.string().min(1, "Selecione uma categoria"),
  status: z.enum(Status).optional(),
  category: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .optional(),
  images: z.array(z.instanceof(File)).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export const useProductFormZodSchema = () => {
  return useZodForm(productFormZodSchema)
}
