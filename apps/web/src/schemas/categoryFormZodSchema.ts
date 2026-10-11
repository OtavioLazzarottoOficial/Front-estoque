import z from "zod"
import { useZodForm } from "../hooks/useZodForm"

export const categoryFormZodSchema = z.object({
  id: z.uuid().optional(),
  name: z.string(),
  description: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export const useCategoryFormZodSchema = () => {
  return useZodForm(categoryFormZodSchema)
}
