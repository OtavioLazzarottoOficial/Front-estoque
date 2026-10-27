import { useZodForm } from "@/hooks/useZodForm"
import z from "zod"

export const stockFormZodSchema = z.object({
  id: z.string().optional(),
  productId: z.string(),
  quantityInStock: z.coerce.number().min(0, "Deve ser maior ou igual a 0"),
  quantityMax: z.coerce.number().min(1, "Quantidade máxima inválida"),
  quantityMin: z.coerce.number().min(0, "Quantidade mínima inválida"),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export const useStockFormZodSchema = () => {
  return useZodForm(stockFormZodSchema)
}
