import z from "zod"
import { useZodForm } from "../hooks/useZodForm"
import { Status } from "@/types/product"

export const productFormZodSchema = z.object({
  id: z.uuid().optional(),
  name: z.string(),
  description: z.string(),
  sku: z.string().optional(),
  price: z.coerce.number(),
  categoryId: z.string(),
  status: z.enum(Status).optional(),
  category: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export const useProductFormZodSchema = () => {
  return useZodForm(productFormZodSchema)
}
